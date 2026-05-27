// src/pages/ProjectsPage.tsx
import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { FolderOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProjectsPage() {
  const { projects } = useStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-text-primary flex items-center gap-2">
          <FolderOpen className="w-8 h-8 text-primary" />
          All Projects
        </h1>
        <button
          onClick={() => navigate('/editor/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.project_id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/editor/${project.project_id}`)}
              className="bg-surface rounded-xl p-6 border border-border hover:border-primary/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <FolderOpen className="w-8 h-8 text-primary" />
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {project.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                {project.description || 'No description'}
              </p>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Words:</span>
                  <span className="text-text-primary font-medium">{project.word_count?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Files:</span>
                  <span className="text-text-primary font-medium">{project.file_count}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <p className="text-text-secondary text-lg">No projects yet</p>
          <button
            onClick={() => navigate('/editor/new')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
