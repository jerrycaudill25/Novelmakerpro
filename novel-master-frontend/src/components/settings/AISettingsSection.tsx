// src/components/settings/AISettingsSection.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, BookOpen, AlertTriangle, RotateCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';
import { StyleProfileViewer } from './StyleProfileViewer';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function AISettingsSection() {
  const { aiSettings, setAISettings } = useStore();
  const queryClient = useQueryClient();
  const [bannedInput, setBannedInput] = useState('');

  const { data: settings, isLoading } = useQuery(
    ['ai-settings'],
    () => api.getAISettings(),
    {
      onSuccess: (data) => setAISettings(data),
    }
  );

  const toggleMutation = useMutation(
    (enabled: boolean) => api.toggleLearning(enabled),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['ai-settings']);
        toast.success(data.learning_enabled ? 'Learning enabled' : 'Learning disabled');
      }
    }
  );

  const updateMutation = useMutation(
    (data: any) => api.updateAISettings(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ai-settings']);
        toast.success('Settings saved');
      }
    }
  );

  const handleBannedWordsSubmit = () => {
    const words = bannedInput.split(',').map(w => w.trim()).filter(Boolean);
    updateMutation.mutate({ banned_word_overrides: words });
    setBannedInput('');
  };

  const handleReset = () => {
    if (!confirm('This will permanently delete all learned style preferences. Continue?')) return;
    toast.info('Reset functionality coming in next patch');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Learning Toggle */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Enable AI Learning</h3>
              <p className="text-sm text-text-muted mt-1">
                The AI will learn from your edits to match your writing style over time.
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleMutation.mutate(!settings?.learning_enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings?.learning_enabled ? 'bg-primary' : 'bg-surface-hover'
            }`}
          >
            <motion.div
              animate={{ x: settings?.learning_enabled ? 26 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
            />
          </button>
        </div>
      </div>

      {/* Banned Word Overrides */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Banned Word Overrides</h3>
            <p className="text-sm text-text-muted mt-1">
              Words or phrases the AI should never flag for you (comma-separated).
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={bannedInput}
            onChange={(e) => setBannedInput(e.target.value)}
            placeholder="e.g. very, really, just"
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
          />
          <Button size="sm" onClick={handleBannedWordsSubmit} isLoading={updateMutation.isLoading}>
            Save
          </Button>
        </div>
        {settings?.banned_word_overrides && settings.banned_word_overrides.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {settings.banned_word_overrides.map((word: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-background rounded-lg text-xs text-text-secondary border border-border">
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Style Profile */}
      {settings?.learning_enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Style Profile</h3>
              <p className="text-sm text-text-muted mt-1">
                Patterns the AI has learned from your writing.
              </p>
            </div>
          </div>
          <StyleProfileViewer />
        </motion.div>
      )}

      {/* Danger Zone */}
      <div className="bg-danger/5 rounded-2xl border border-danger/20 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="font-semibold text-danger">Reset Style Profile</h3>
            <p className="text-sm text-text-muted mt-1">
              Permanently delete all learned preferences. This cannot be undone.
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Reset Learning Data
        </Button>
      </div>
    </div>
  );
}
