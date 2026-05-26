// src/components/lorebook/LorebookPanel.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, User, BookOpen, Users, Globe } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { Character, WorldLore } from '../../types';
import { CharacterCard } from './CharacterCard';
import { WorldLoreCard } from './WorldLoreCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface LorebookPanelProps {
  projectId: number;
  onClose: () => void;
}

type TabId = 'characters' | 'lore';

const loreCategories = [
  { id: 'all', label: 'All' },
  { id: 'magic_system', label: 'Magic' },
  { id: 'geography', label: 'Geography' },
  { id: 'history', label: 'History' },
  { id: 'culture', label: 'Culture' },
  { id: 'technology', label: 'Tech' },
  { id: 'rules', label: 'Rules' },
  { id: 'timeline', label: 'Timeline' },
];

export function LorebookPanel({ projectId, onClose }: LorebookPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('characters');
  const [search, setSearch] = useState('');
  const [loreFilter, setLoreFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Character | WorldLore | null>(null);

  const queryClient = useQueryClient();

  // Characters query
  const { data: characters, isLoading: charsLoading } = useQuery(
    ['characters', projectId],
    () => api.getCharacters(projectId),
    { enabled: !!projectId }
  );

  // World Lore query
  const { data: lore, isLoading: loreLoading } = useQuery(
    ['world-lore', projectId, loreFilter],
    () => api.getWorldLore(projectId, loreFilter === 'all' ? undefined : loreFilter),
    { enabled: !!projectId }
  );

  // Mutations
  const createChar = useMutation(
    (data: any) => api.createCharacter(projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['characters', projectId]);
        toast.success('Character created');
        setShowForm(false);
      },
      onError: () => toast.error('Failed to create character')
    }
  );

  const updateChar = useMutation(
    ({ id, data }: { id: number; data: any }) => api.updateCharacter(projectId, id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['characters', projectId]);
        toast.success('Character updated');
        setShowForm(false);
        setEditingItem(null);
      }
    }
  );

  const deleteChar = useMutation(
    (id: number) => api.deleteCharacter(projectId, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['characters', projectId]);
        toast.success('Character deleted');
      }
    }
  );

  const createLore = useMutation(
    (data: any) => api.createWorldLore(projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['world-lore', projectId]);
        toast.success('Lore entry created');
        setShowForm(false);
      }
    }
  );

  const updateLore = useMutation(
    ({ id, data }: { id: number; data: any }) => api.updateWorldLore(projectId, id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['world-lore', projectId]);
        toast.success('Lore updated');
        setShowForm(false);
        setEditingItem(null);
      }
    }
  );

  const deleteLore = useMutation(
    (id: number) => api.deleteWorldLore(projectId, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['world-lore', projectId]);
        toast.success('Lore deleted');
      }
    }
  );

  const filteredCharacters = characters?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role_type.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const filteredLore = lore ?? [];

  const handleDelete = (id: number, type: TabId) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    if (type === 'characters') deleteChar.mutate(id);
    else deleteLore.mutate(id);
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-80 lg:w-96 bg-background-secondary border-l border-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-text-primary">Lorebook</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => { setActiveTab('characters'); setShowForm(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'characters'
              ? 'text-primary-light border-b-2 border-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Characters
        </button>
        <button
          onClick={() => { setActiveTab('lore'); setShowForm(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'lore'
              ? 'text-primary-light border-b-2 border-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          World Lore
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'characters' ? 'Search characters...' : 'Search lore...'}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
          />
        </div>
        {activeTab === 'lore' && (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
            {loreCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setLoreFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                  loreFilter === cat.id
                    ? 'bg-primary/20 text-primary-light'
                    : 'bg-surface text-text-muted hover:bg-surface-hover'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="wait">
          {activeTab === 'characters' && (
            <motion.div
              key="chars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {charsLoading ? (
                <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
              ) : filteredCharacters.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No characters yet.</p>
                </div>
              ) : (
                filteredCharacters.map((char) => (
                  <CharacterCard
                    key={char.character_id}
                    character={char}
                    onEdit={(c) => { setEditingItem(c); setShowForm(true); }}
                    onDelete={(id) => handleDelete(id, 'characters')}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'lore' && (
            <motion.div
              key="lore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {loreLoading ? (
                <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
              ) : filteredLore.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No lore entries yet.</p>
                </div>
              ) : (
                filteredLore.map((l) => (
                  <WorldLoreCard
                    key={l.lore_id}
                    lore={l}
                    onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
                    onDelete={(id) => handleDelete(id, 'lore')}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <div className="p-3 border-t border-border">
        <Button
          fullWidth
          size="sm"
          onClick={() => { setEditingItem(null); setShowForm(true); }}
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'characters' ? 'Add Character' : 'Add Lore'}
        </Button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-2xl border border-border w-full max-w-sm max-h-[80vh] overflow-y-auto p-5 space-y-4"
            >
              <h3 className="text-lg font-bold text-text-primary">
                {editingItem ? 'Edit' : 'New'} {activeTab === 'characters' ? 'Character' : 'Lore'}
              </h3>

              {activeTab === 'characters' ? (
                <CharacterForm
                  initial={editingItem as Character | null}
                  onSubmit={(data) => {
                    if (editingItem) {
                      updateChar.mutate({ id: (editingItem as Character).character_id, data });
                    } else {
                      createChar.mutate(data);
                    }
                  }}
                  onCancel={() => setShowForm(false)}
                  isLoading={createChar.isLoading || updateChar.isLoading}
                />
              ) : (
                <LoreForm
                  initial={editingItem as WorldLore | null}
                  onSubmit={(data) => {
                    if (editingItem) {
                      updateLore.mutate({ id: (editingItem as WorldLore).lore_id, data });
                    } else {
                      createLore.mutate(data);
                    }
                  }}
                  onCancel={() => setShowForm(false)}
                  isLoading={createLore.isLoading || updateLore.isLoading}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CHARACTER FORM
   ══════════════════════════════════════════════════════════════════════════════ */

function CharacterForm({
  initial,
  onSubmit,
  onCancel,
  isLoading
}: {
  initial: Character | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    role_type: initial?.role_type || 'supporting',
    raw_data: initial?.raw_data || '',
    physical_traits: initial?.physical_traits || '',
    personality_traits: initial?.personality_traits || '',
    backstory: initial?.backstory || '',
    goals: initial?.goals || '',
  });

  return (
    <div className="space-y-3">
      <Input
        label="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Role</label>
        <select
          value={form.role_type}
          onChange={(e) => setForm({ ...form, role_type: e.target.value })}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm"
        >
          <option value="protagonist">Protagonist</option>
          <option value="antagonist">Antagonist</option>
          <option value="supporting">Supporting</option>
          <option value="minor">Minor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Raw Data / Notes</label>
        <textarea
          value={form.raw_data}
          onChange={(e) => setForm({ ...form, raw_data: e.target.value })}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm min-h-[80px] resize-none"
          placeholder="Freeform notes for auto-extraction..."
        />
      </div>
      <Input
        label="Physical Traits"
        value={form.physical_traits}
        onChange={(e) => setForm({ ...form, physical_traits: e.target.value })}
      />
      <Input
        label="Personality Traits"
        value={form.personality_traits}
        onChange={(e) => setForm({ ...form, personality_traits: e.target.value })}
      />
      <Input
        label="Goals"
        value={form.goals}
        onChange={(e) => setForm({ ...form, goals: e.target.value })}
      />
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button
          onClick={() => onSubmit(form)}
          isLoading={isLoading}
          className="flex-1"
          disabled={!form.name.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   LORE FORM
   ══════════════════════════════════════════════════════════════════════════════ */

function LoreForm({
  initial,
  onSubmit,
  onCancel,
  isLoading
}: {
  initial: WorldLore | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    category: initial?.category || 'magic_system',
    title: initial?.title || '',
    content: initial?.content || '',
    importance: initial?.importance || 2,
  });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm"
        >
          <option value="magic_system">Magic System</option>
          <option value="geography">Geography</option>
          <option value="history">History</option>
          <option value="culture">Culture</option>
          <option value="technology">Technology</option>
          <option value="rules">Rules</option>
          <option value="timeline">Timeline</option>
        </select>
      </div>
      <Input
        label="Title *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm min-h-[100px] resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Importance ({form.importance})</label>
        <input
          type="range"
          min={1}
          max={3}
          value={form.importance}
          onChange={(e) => setForm({ ...form, importance: Number(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button
          onClick={() => onSubmit(form)}
          isLoading={isLoading}
          className="flex-1"
          disabled={!form.title.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
