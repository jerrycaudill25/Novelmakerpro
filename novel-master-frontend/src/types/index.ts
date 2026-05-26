export interface User {
  id: string
  email: string
  name: string
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
}

export interface Chapter {
  id: string
  novelId: string
  title: string
  content: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
