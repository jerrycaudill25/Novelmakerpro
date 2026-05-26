export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface Novel {
  id: string
  title: string
  description: string
  author: string
  chapters: Chapter[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived'
}

export interface Chapter {
  id: string
  novelId: string
  title: string
  content: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
