// src/components/editor/FullScreenEditor.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, Save, ChevronLeft, FileText,
  Plus, FolderOpen
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { AISidebar } from './AISidebar';
import { LorebookPanel } from '../lorebook/LorebookPanel';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface EditorFile {
  file_id: number;
  display_name: string;
  word_count: number;
}

export function FullScreenEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const pid = Number(projectId);
  const { user } = useAuth();
  const {
    lorebookOpen,
    setLorebookOpen,
    currentFileId,
    setCurrentFileId
  } = useStore();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled');
  const [showAI, setShowAI] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Fetch project files
  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['project-files', pid],
    queryFn: () => api.getProjectFiles(pid),
    enabled: !!pid,
  });

  // Fetch current file content
  const { data: fileData, isLoading: contentLoading } = useQuery({
    queryKey: ['file-content', pid, currentFileId],
    queryFn: () => api.getFileContent(pid, currentFileId!),
    enabled: !!pid && !!currentFileId,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: { content: string; changeSummary?: string }) =>
      api.updateFileContent(pid, currentFileId!, data.content, data.changeSummary),
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['file-content', pid, currentFileId] });
    },
    onError: () => toast.error('Failed to save')
  });

  useEffect(() => {
    if (fileData?.content) {
      setContent(fileData.content);
    }
    if (fileData?.display_name) {
      setTitle(fileData.display_name);
    }
  }, [fileData]);

  const handleSave = useCallback(() => {
    if (!currentFileId) return;
    saveMutation.mutate({ content });
  }, [content, currentFileId, saveMutation]);

  const handleAIAction = () => {
    setShowAI(!showAI);
    setLorebookOpen(false);
  };

  const handleLoreAction = () => {
    setLorebookOpen(!lorebookOpen);
    setShowAI(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Keyboard shortcut: Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-background">
      {/* ════════════════════════════════════════════════════════════════════════
          LEFT SIDEBAR — Files + Lorebook Quick List
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="w-64 bg-background-secondary border-r border-border flex-col hidden md:flex">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
            <FolderOpen className="w-4 h-4" />
            Project Files
          </h2>
          <button
            onClick={() => navigate('/library')}
            className="p-1 rounded hover:bg-surface-hover text-text-muted"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filesLoading ? (
            <div className="p-4 text-text-muted text-sm">Loading files...</div>
          ) : files?.length === 0 ? (
            <div className="p-4 text-text-muted text-sm">No files yet.</div>
          ) : (
            files?.map((file: EditorFile) => (
              <button
                key={file.file_id}
                onClick={() => setCurrentFileId(file.file_id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentFileId === file.file_id
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <div className="font-medium truncate">{file.display_name}</div>
                <div className="text-xs text-text-muted">{file.word_count.toLocaleString()} words</div>
              </button>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => toast.info('New file upload coming soon')}
          >
            <Plus className="w-4 h-4" />
            Add File
          </Button>
        </div>

        {/* PHASE 3 — Lorebook Quick List in Left Sidebar */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            Lorebook
          </h3>
          <LorebookQuickList projectId={pid} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MAIN EDITOR AREA
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-text-primary font-semibold outline-none min-w-0 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* PHASE 3 — Lorebook Toggle Button */}
            <Button
              variant={lorebookOpen ? 'primary' : 'ghost'}
              size="sm"
              onClick={handleLoreAction}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lore</span>
            </Button>
            <Button
              variant={showAI ? 'primary' : 'ghost'}
              size="sm"
              onClick={handleAIAction}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              isPending={saveMutation.isPending}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {contentLoading ? (
              <div className="flex items-center justify-center h-full text-text-muted">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                className="w-full h-full bg-transparent text-text-primary font-serif text-lg leading-relaxed resize-none outline-none"
                placeholder="Start writing your story..."
                spellCheck={false}
              />
            )}
          </div>

          {/* PHASE 3 — Right Panels (AI + Lorebook) */}
          <AnimatePresence>
            {showAI && (
              <AISidebar
                content={content}
                projectId={pid}
                fileId={currentFileId}
                onClose={() => setShowAI(false)}
              />
            )}
            {lorebookOpen && (
              <LorebookPanel
                projectId={pid}
                onClose={() => setLorebookOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PHASE 3 — Lorebook Quick List Component (embedded in left sidebar)
   ══════════════════════════════════════════════════════════════════════════════ */

function LorebookQuickList({ projectId }: { projectId: number }) {
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters-quick', projectId],
    queryFn: () => api.getCharacters(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return <p className="text-xs text-text-muted">Loading...</p>;
  }

  if (!characters?.length) {
    return <p className="text-xs text-text-muted">No characters yet</p>;
  }

  return (
    <div className="space-y-1.5">
      {characters.slice(0, 5).map((char) => (
        <div key={char.character_id} className="flex items-center gap-2 text-sm text-text-secondary">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            char.role_type === 'protagonist' ? 'bg-yellow-400' :
            char.role_type === 'antagonist' ? 'bg-red-400' :
            char.role_type === 'supporting' ? 'bg-blue-400' : 'bg-gray-400'
          }`} />
          <span className="truncate">{char.name}</span>
        </div>
      ))}
      {characters.length > 5 && (
        <p className="text-xs text-text-muted pl-4">+{characters.length - 5} more</p>
      )}
    </div>
  );
}
