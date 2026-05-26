// src/components/settings/StyleProfileViewer.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Brain } from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function StyleProfileViewer() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    ['style-profile'],
    () => api.getStyleProfile(),
    { staleTime: 60000 }
  );

  const deleteMutation = useMutation(
    (id: number) => api.deleteStylePreference(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['style-profile']);
        toast.success('Preference removed');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.preferences?.length) {
    return (
      <div className="text-center py-8 bg-surface rounded-xl border border-border">
        <Brain className="w-8 h-8 text-text-muted mx-auto mb-2" />
        <p className="text-text-muted text-sm">No style preferences learned yet.</p>
        <p className="text-text-muted text-xs mt-1">Edit AI suggestions to build your profile.</p>
      </div>
    );
  }

  const { summary, preferences } = data;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl p-3 text-center border border-border">
          <p className="text-xl font-bold text-text-primary">{summary.total_corrections}</p>
          <p className="text-[10px] text-text-muted uppercase mt-1">Total</p>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center border border-border">
          <p className="text-xl font-bold text-text-primary">{summary.active_corrections}</p>
          <p className="text-[10px] text-text-muted uppercase mt-1">Active</p>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center border border-border">
          <p className="text-xl font-bold text-primary">{summary.average_confidence.toFixed(2)}</p>
          <p className="text-[10px] text-text-muted uppercase mt-1">Avg Confidence</p>
        </div>
      </div>

      {/* Top Patterns */}
      {summary.top_patterns.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Top Patterns</p>
          <div className="space-y-2">
            {summary.top_patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-lg p-3 border border-border flex items-center gap-3"
              >
                <span className="text-xs text-text-muted line-through flex-1">{pattern.original_pattern}</span>
                <ArrowRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                <span className="text-sm text-primary-light font-medium flex-1">{pattern.corrected_pattern}</span>
                <Badge variant="primary" size="sm">{pattern.freq}×</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Preferences */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">All Corrections</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {preferences.map((pref) => (
            <div
              key={pref.preference_id}
              className="bg-surface rounded-lg p-3 border border-border flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted line-through">{pref.original_pattern}</span>
                  <ArrowRight className="w-3 h-3 text-text-muted" />
                  <span className="text-sm text-primary-light font-medium">{pref.corrected_pattern}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pref.confidence_score > 0.7 ? 'success' : 'warning'} size="sm">
                    {(pref.confidence_score * 100).toFixed(0)}%
                  </Badge>
                  {pref.context && (
                    <span className="text-xs text-text-muted truncate">{pref.context}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(pref.preference_id)}
                className="p-1.5 rounded-lg hover:bg-danger/20 text-text-muted hover:text-danger transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
