// src/pages/CirclesPage.tsx
import React from 'react';
import { Users, Plus } from 'lucide-react';

export function CirclesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Writing Circles
        </h1>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Create Circle
        </button>
      </div>

      <div className="text-center py-20">
        <Users className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
        <p className="text-text-secondary text-lg mb-2">No writing circles yet</p>
        <p className="text-text-muted">Create or join a circle to collaborate with other writers</p>
      </div>
    </div>
  );
}
