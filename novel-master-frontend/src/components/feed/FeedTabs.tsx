// src/components/feed/FeedTabs.tsx
import { motion } from 'framer-motion';

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export function FeedTabs({ activeTab, onTabChange, tabs }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === tab.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="feedTabIndicator"
              className="absolute inset-0 bg-background rounded-lg shadow-sm"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
