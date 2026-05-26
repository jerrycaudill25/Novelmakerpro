// src/components/lorebook/CharacterCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Pencil, Trash2, User } from 'lucide-react';
import type { Character } from '../../types';
import { Badge } from '../ui/Badge';

interface CharacterCardProps {
  character: Character;
  onEdit: (char: Character) => void;
  onDelete: (id: number) => void;
}

const roleColors: Record<string, any> = {
  protagonist: 'gold',
  antagonist: 'danger',
  supporting: 'primary',
  minor: 'default',
};

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-surface rounded-xl border border-border overflow-hidden group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-sm truncate">
              {character.name}
            </span>
            <Badge variant={roleColors[character.role_type] || 'default'} size="sm">
              {character.role_type}
            </Badge>
          </div>
          {character.physical_traits && (
            <p className="text-xs text-text-muted truncate">{character.physical_traits}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(character); }}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(character.character_id); }}
            className="p-1.5 rounded-lg hover:bg-danger/20 text-text-muted hover:text-danger"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-text-muted"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {character.personality_traits && (
                <div className="bg-background rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-text-muted uppercase mb-1">Personality</p>
                  <p className="text-xs text-text-secondary">{character.personality_traits}</p>
                </div>
              )}
              {character.goals && (
                <div className="bg-background rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-text-muted uppercase mb-1">Goals</p>
                  <p className="text-xs text-text-secondary">{character.goals}</p>
                </div>
              )}
              {character.backstory && (
                <div className="bg-background rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-text-muted uppercase mb-1">Backstory</p>
                  <p className="text-xs text-text-secondary">{character.backstory}</p>
                </div>
              )}
              {Object.keys(character.extracted_facts || {}).length > 0 && (
                <div className="bg-background rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-text-muted uppercase mb-1">Key Facts</p>
                  <div className="space-y-1">
                    {Object.entries(character.extracted_facts).map(([key, value]) => (
                      <div key={key} className="flex gap-2 text-xs">
                        <span className="text-text-muted capitalize">{key}:</span>
                        <span className="text-text-secondary">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
