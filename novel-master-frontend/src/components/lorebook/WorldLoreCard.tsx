// src/components/lorebook/WorldLoreCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Pencil, Trash2, BookOpen } from 'lucide-react';
import type { WorldLore } from '../../types';
import { Badge } from '../ui/Badge';

interface WorldLoreCardProps {
  lore: WorldLore;
  onEdit: (lore: WorldLore) => void;
  onDelete: (id: number) => void;
}

const categoryColors: Record<string, any> = {
  magic_system: 'primary',
  geography: 'success',
  history: 'warning',
  culture: 'accent',
  technology: 'secondary',
  rules: 'danger',
  timeline: 'default',
};

export function WorldLoreCard({ lore, onEdit, onDelete }: WorldLoreCardProps) {
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
        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-sm truncate">
              {lore.title}
            </span>
            <Badge variant={categoryColors[lore.category] || 'default'} size="sm">
              {lore.category.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: lore.importance }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
            ))}
            {Array.from({ length: 3 - lore.importance }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-surface-hover" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(lore); }}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(lore.lore_id); }}
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
            <div className="px-3 pb-3">
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {lore.content}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
