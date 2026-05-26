import { create } from 'zustand'
import { User, Novel } from '../types'

interface AppStore {
  // User state
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // Novels state
  novels: Novel[]
  currentNovel: Novel | null
  setNovels: (novels: Novel[]) => void
  setCurrentNovel: (novel: Novel | null) => void
  addNovel: (novel: Novel) => void
  updateNovel: (novel: Novel) => void
  deleteNovel: (id: string) => void

  // UI state
  isLoading: boolean
  error: string | null
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // User
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Novels
  novels: [],
  currentNovel: null,
  setNovels: (novels) => set({ novels }),
  setCurrentNovel: (novel) => set({ currentNovel: novel }),
  addNovel: (novel) => set((state) => ({ novels: [...state.novels, novel] })),
  updateNovel: (novel) => set((state) => ({
    novels: state.novels.map((n) => (n.id === novel.id ? novel : n)),
    currentNovel: state.currentNovel?.id === novel.id ? novel : state.currentNovel
  })),
  deleteNovel: (id) => set((state) => ({
    novels: state.novels.filter((n) => n.id !== id),
    currentNovel: state.currentNovel?.id === id ? null : state.currentNovel
  })),

  // UI
  isLoading: false,
  error: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))
