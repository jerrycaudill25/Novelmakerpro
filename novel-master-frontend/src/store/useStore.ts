// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Project, CommunityPost, UserPreferences,
  AIFeedback, Notification, AISettings, StyleSummary
} from '../types';

interface AppState {
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════════════════
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProjectInList: (project: Project) => void;
  removeProject: (projectId: number) => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // FEED
  // ═══════════════════════════════════════════════════════════════════════════
  feedPosts: CommunityPost[];
  trendingPosts: CommunityPost[];
  setFeedPosts: (posts: CommunityPost[]) => void;
  setTrendingPosts: (posts: CommunityPost[]) => void;
  appendFeedPosts: (posts: CommunityPost[]) => void;
  updatePostReactions: (postId: number, reaction: string | null, count: number) => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // AI
  // ═══════════════════════════════════════════════════════════════════════════
  aiFeedback: AIFeedback | null;
  isAnalyzing: boolean;
  setAIFeedback: (feedback: AIFeedback | null) => void;
  setAnalyzing: (value: boolean) => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // UI
  // ═══════════════════════════════════════════════════════════════════════════
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activePanel: 'ai' | 'comments' | 'outline' | 'none';
  theme: 'dark' | 'light';
  setSidebarOpen: (value: boolean) => void;
  setRightPanelOpen: (value: boolean) => void;
  setActivePanel: (panel: 'ai' | 'comments' | 'outline' | 'none') => void;
  toggleTheme: () => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // EDITOR
  // ═══════════════════════════════════════════════════════════════════════════
  editorContent: string;
  editorSelection: { start: number; end: number; text: string } | null;
  currentFileId: number | null;
  setEditorContent: (content: string) => void;
  setEditorSelection: (selection: { start: number; end: number; text: string } | null) => void;
  setCurrentFileId: (id: number | null) => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════
  preferences: UserPreferences | null;
  setPreferences: (prefs: UserPreferences) => void;

  /* ══════════════════════════════════════════════════════════════════════════
     PHASE 3 EXTENSIONS — AI & Learning, Lorebook
     ══════════════════════════════════════════════════════════════════════════ */

  // AI & Learning
  aiSettings: AISettings | null;
  setAISettings: (settings: AISettings) => void;
  styleProfile: StyleSummary | null;
  setStyleProfile: (profile: StyleSummary) => void;

  // Lorebook
  lorebookOpen: boolean;
  setLorebookOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Auth ───────────────────────────────────────────────────────────────
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      logout: () => {
        localStorage.removeItem('nm_token');
        set({ user: null, isAuthenticated: false, projects: [], feedPosts: [] });
      },

      // ─── Projects ─────────────────────────────────────────────────────────────
      projects: [],
      currentProject: null,
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
      updateProjectInList: (project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.project_id === project.project_id ? project : p)),
        })),
      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.project_id !== projectId),
        })),

      // ─── Feed ───────────────────────────────────────────────────────────────
      feedPosts: [],
      trendingPosts: [],
      setFeedPosts: (posts) => set({ feedPosts: posts }),
      setTrendingPosts: (posts) => set({ trendingPosts: posts }),
      appendFeedPosts: (posts) =>
        set((state) => ({
          feedPosts: [...state.feedPosts, ...posts],
        })),
      updatePostReactions: (postId, reaction, count) =>
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.post_id === postId ? { ...p, user_reaction: reaction, like_count: count } : p
          ),
        })),

      // ─── AI ─────────────────────────────────────────────────────────────────
      aiFeedback: null,
      isAnalyzing: false,
      setAIFeedback: (feedback) => set({ aiFeedback: feedback }),
      setAnalyzing: (value) => set({ isAnalyzing: value }),

      // ─── UI ─────────────────────────────────────────────────────────────────
      sidebarOpen: true,
      rightPanelOpen: false,
      activePanel: 'none',
      theme: 'dark',
      setSidebarOpen: (value) => set({ sidebarOpen: value }),
      setRightPanelOpen: (value) => set({ rightPanelOpen: value }),
      setActivePanel: (panel) => set({ activePanel: panel, rightPanelOpen: panel !== 'none' }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // ─── Notifications ──────────────────────────────────────────────────────
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // ─── Editor ─────────────────────────────────────────────────────────────
      editorContent: '',
      editorSelection: null,
      currentFileId: null,
      setEditorContent: (content) => set({ editorContent: content }),
      setEditorSelection: (selection) => set({ editorSelection: selection }),
      setCurrentFileId: (id) => set({ currentFileId: id }),

      // ─── Preferences ────────────────────────────────────────────────────────
      preferences: null,
      setPreferences: (prefs) => set({ preferences: prefs }),

      /* ═══════════════════════════════════════════════════════════════════════
         PHASE 3 — AI & Learning, Lorebook
         ═══════════════════════════════════════════════════════════════════════ */

      // AI & Learning
      aiSettings: null,
      setAISettings: (settings) => set({ aiSettings: settings }),
      styleProfile: null,
      setStyleProfile: (profile) => set({ styleProfile: profile }),

      // Lorebook
      lorebookOpen: false,
      setLorebookOpen: (open) => set({ lorebookOpen: open }),
    }),
    {
      name: 'novel-master-storage',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        aiSettings: state.aiSettings,
      }),
    }
  )
);
