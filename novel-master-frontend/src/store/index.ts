import { create } from 'zustand'
import { User, Novel } from '../types/index'

interface AppStore {
  user: User | null
  novels: Novel[]
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setNovels: (novels: Novel[]) => void
  addNovel: (novel: Novel) => void
  updateNovel: (id: string, novel: Partial<Novel>) => void
  deleteNovel: (id: string) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  novels: [],
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setNovels: (novels) => set({ novels }),
  addNovel: (novel) =>
    set((state) => ({ novels: [...state.novels, novel] })),
  updateNovel: (id, updates) =>
    set((state) => ({
      novels: state.novels.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),
  deleteNovel: (id) =>
    set((state) => ({
      novels: state.novels.filter((n) => n.id !== id),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
