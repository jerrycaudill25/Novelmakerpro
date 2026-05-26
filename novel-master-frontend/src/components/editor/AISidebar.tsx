// src/components/editor/AISidebar.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, AlertTriangle, TrendingUp, Zap, BookOpen,
  Wand2, Expand, RotateCcw, Check, Save, Brain,
  RefreshCw, User, ScrollText, Ban
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { wsService } from '../../services/websocket';
import { api } from '../../services/api';
import type { AIFeedback, RAGContext, StyleSummary } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';

interface AISidebarProps {
  content: string;
  projectId: number | null;
  fileId: number | null;
  onClose: () => void;
}

const aiActions = [
  { id: 'improve', label: 'Improve', icon: Wand2, description: 'Enhance clarity and flow' },
  { id: 'expand', label: 'Expand', icon: Expand, description: 'Add detail and depth' },
  { id: 'describe', label: 'Describe', icon: BookOpen, description: 'Richer sensory details' },
  { id: 'rephrase', label: 'Rephrase', icon: RotateCcw, description: 'Fresh phrasing' },
  { id: 'brainstorm', label: 'Brainstorm', icon: Zap, description: 'Generate ideas' },
];

type TabId = 'analysis' | 'lore' | 'style';

export function AISidebar({ content, projectId, fileId, onClose }: AISidebarProps) {
  const { aiFeedback, isAnalyzing, user } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('analysis');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [originalSuggestion, setOriginalSuggestion] = useState('');
  const [ragContext, setRagContext] = useState<RAGContext | null>(null);
  const [styleSummary, setStyleSummary] = useState<StyleSummary | null>(null);

  const handleAction = (actionId: string) => {
    setSelectedAction(actionId);
    setOriginalSuggestion('');
    const responses: Record<string, string> = {
      improve: 'The cold wind whispered through the empty streets, carrying the scent of rain and distant memories.',
      expand: 'Elara tightened her grip on the hilt of her blade, feeling the worn leather grooves that had been shaped by years of practice.',
      describe: 'The damp stone walls glistened with moisture, and each footstep echoed like a distant memory.',
      rephrase: '"We have no other path," she murmured, though uncertainty clung to her like morning fog.',
      brainstorm: 'Consider: What if the Spire is actually a prison? What if Kael is the key?',
    };
    setTimeout(() => {
      const text = responses[actionId] || 'AI suggestion would appear here.';
      setSuggestion(text);
      setOriginalSuggestion(text);
    }, 800);
  };

  const insertSuggestion = () => {
    if (!suggestion) return;
    toast.success('Suggestion inserted');
    setSuggestion('');
    setSelectedAction(null);
    setOriginalSuggestion('');
  };

  const handleSaveAndLearn = () => {
    if (!originalSuggestion || !suggestion || !projectId || !user) return;
    wsService.saveAndLearn(originalSuggestion, suggestion, projectId, user.user_id);
    toast.success('Learned your style preference');
  };

  const refreshContext = async () => {
    if (!projectId) return;
    try {
      const sceneRequest = content.slice(0, 200) || 'Current scene';
      const ctx = await api.assembleContext(projectId, sceneRequest);
      setRagContext(ctx);
      toast.success('Context refreshed');
    } catch {
      toast.error('Failed to refresh context');
    }
  };

  const fetchStyleSummary = async () => {
    try {
      const data = await api.getStyleProfile();
      setStyleSummary(data.summary);
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    if (activeTab === 'lore' && projectId) {
      refreshContext();
    }
    if (activeTab === 'style') {
      fetchStyleSummary();
    }
  }, [activeTab, projectId]);

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-yellow-400';
    if (score >= 7.5) return 'text-slate-300';
    if (score >= 6) return 'text-orange-400';
    return 'text-danger';
  };

  const getScoreBg = (score: number) => {
    if (score >= 9) return 'bg-yellow-500/20';
    if (score >= 7.5) return 'bg-slate-400/20';
    if (score >= 6) return 'bg-orange-500/20';
    return 'bg-danger/20';
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'analysis', label: 'Analysis', icon: Sparkles },
    { id: 'lore', label: 'Lore', icon: BookOpen },
    { id: 'style', label: 'Style', icon: Brain },
  ];

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
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold text-text-primary">AI Assistant</span>
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary-light border-b-2 border-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════════
              ANALYSIS TAB — Original + Style Violations + Save & Learn
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              {aiFeedback && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-xl p-4 ${getScoreBg(aiFeedback.score)} border border-border`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-secondary">Prose Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(aiFeedback.score)}`}>
                      {aiFeedback.score}/10
                    </span>
                  </div>
                  {aiFeedback.badge && (
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary-light font-medium">{aiFeedback.badge} Badge</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Cadence</span>
                      <span className="text-text-primary">{aiFeedback.cadence}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(aiFeedback.cadence / 10) * 100}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Global Violations */}
              {aiFeedback?.violations && aiFeedback.violations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Issues Found
                  </h3>
                  {aiFeedback.violations.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-surface rounded-lg p-3 border border-border"
                    >
                      <p className="text-xs text-text-muted mb-1">{v.pattern}</p>
                      <p className="text-sm text-warning">Found {v.count} times</p>
                      {v.examples.length > 0 && (
                        <p className="text-xs text-text-muted mt-1 italic">"{v.examples[0]}"</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* PHASE 3 — Style Violations */}
              {(aiFeedback as any)?.style_violations && ((aiFeedback as any).style_violations as any[]).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                    <Ban className="w-4 h-4 text-warning" />
                    Style Violations
                  </h3>
                  {((aiFeedback as any).style_violations as any[]).map((v: any, i: number) => (
                    <motion.div
                      key={`sv-${i}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-warning/10 rounded-lg p-3 border border-warning/20"
                    >
                      <p className="text-xs text-text-muted line-through">{v.original_pattern}</p>
                      <p className="text-sm text-warning mt-1">→ {v.suggestion}</p>
                      <p className="text-xs text-text-muted mt-1">Confidence: {Math.round(v.confidence * 100)}%</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* AI Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {aiActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(action.id)}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        selectedAction === action.id
                          ? 'bg-primary/15 border-primary/30'
                          : 'bg-surface border-border hover:bg-surface-hover'
                      }`}
                    >
                      <action.icon className={`w-4 h-4 mb-1.5 ${selectedAction === action.id ? 'text-primary' : 'text-text-muted'}`} />
                      <p className="text-sm font-medium text-text-primary">{action.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Suggestion with PHASE 3 Save & Learn */}
              {suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface rounded-xl p-4 border border-primary/30"
                >
                  <p className="text-sm text-text-primary leading-relaxed mb-3">{suggestion}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={insertSuggestion} className="flex-1">
                      <Check className="w-3 h-3" />
                      Insert
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleSaveAndLearn}>
                      <Save className="w-3 h-3" />
                      Save & Learn
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setSuggestion(''); setSelectedAction(null); }}>
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Analyzing State */}
              {isAnalyzing && (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LORE TAB — PHASE 3 — RAG Context Display
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'lore' && (
            <motion.div
              key="lore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-primary" />
                  Active Context
                </h3>
                <button
                  onClick={refreshContext}
                  className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {ragContext ? (
                <>
                  {ragContext.characters_used.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-text-muted uppercase">Characters</p>
                      {ragContext.characters_used.map((char, i) => (
                        <div key={i} className="flex items-center gap-2 bg-surface rounded-lg p-2.5 border border-border">
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-primary font-medium">{char.name}</span>
                          <Badge variant="default" size="sm">{char.role}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {ragContext.lore_used.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-text-muted uppercase">World Rules</p>
                      {ragContext.lore_used.map((lore, i) => (
                        <div key={i} className="flex items-center gap-2 bg-surface rounded-lg p-2.5 border border-border">
                          <BookOpen className="w-4 h-4 text-accent" />
                          <span className="text-sm text-text-primary font-medium">{lore.title}</span>
                          <Badge variant="default" size="sm">{lore.category}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <details className="group">
                    <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                      View raw context
                    </summary>
                    <div className="mt-2 p-3 bg-background rounded-lg border border-border">
                      <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
                        {ragContext.context}
                      </pre>
                    </div>
                  </details>
                </>
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No context assembled yet.</p>
                  <p className="text-xs mt-1">Click refresh to build from lorebook.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STYLE TAB — PHASE 3 — Style Profile Summary
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {styleSummary ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-surface rounded-xl p-3 text-center border border-border">
                      <p className="text-lg font-bold text-text-primary">{styleSummary.total_corrections}</p>
                      <p className="text-[10px] text-text-muted uppercase">Total</p>
                    </div>
                    <div className="bg-surface rounded-xl p-3 text-center border border-border">
                      <p className="text-lg font-bold text-text-primary">{styleSummary.active_corrections}</p>
                      <p className="text-[10px] text-text-muted uppercase">Active</p>
                    </div>
                    <div className="bg-surface rounded-xl p-3 text-center border border-border">
                      <p className="text-lg font-bold text-primary">{styleSummary.average_confidence.toFixed(2)}</p>
                      <p className="text-[10px] text-text-muted uppercase">Avg Conf</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-text-muted uppercase">Top Patterns</p>
                    {styleSummary.top_patterns.slice(0, 5).map((pattern, i) => (
                      <div key={i} className="bg-surface rounded-lg p-3 border border-border space-y-1.5">
                        <p className="text-xs text-text-muted line-through">{pattern.original_pattern}</p>
                        <p className="text-sm text-primary-light font-medium">→ {pattern.corrected_pattern}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="primary" size="sm">Used {pattern.freq} times</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No style profile yet.</p>
                  <p className="text-xs mt-1">Enable learning and edit AI suggestions.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
