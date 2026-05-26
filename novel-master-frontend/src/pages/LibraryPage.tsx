// src/pages/LibraryPage.tsx
import { useState } from 'react';
// CRITICAL FIX: Migrated from '@tanstack/react-query' v3 to '@tanstack/react-query' v5
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BookOpen, MoreHorizontal, Clock, FileText, Sparkles, Trash2, Copy, Crown } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export function LibraryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentProject } = useStore();
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

  // CRITICAL FIX: v5 useQuery uses object syntax
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const filteredProjects = projects?.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  }) ?? [];

  const statusColors: Record<string, string> = {
    draft: 'bg-warning/20 text-warning',
    editing: 'bg-primary/20 text-primary',
    reviewing: 'bg-accent/20 text-accent',
    published: 'bg-success/20 text-success',
    archived: 'bg-text-muted/20 text-text-muted',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Library</h1>
          <p className="text-text-secondary mt-1">{projects?.length || 0} projects</p>
        </div>
        <Button onClick={() => navigate('/editor/new')}>
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'draft', 'published'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48" count={6} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No projects yet. Start your first story!</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/editor/new')}>
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hover
                onClick={() => {
                  setCurrentProject(project);
                  navigate(`/editor/${project.project_id}`);
                }}
                className="p-5 h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    {project.ai_audit_score && project.ai_audit_score >= 9 && (
                      <Badge variant="gold" size="sm">
                        <Sparkles className="w-3 h-3" />
                        Gold
                      </Badge>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-text-primary mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
                  {project.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {project.file_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.word_count.toLocaleString()} words
                    </span>
                  </div>
                  <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
