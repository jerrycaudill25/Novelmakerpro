import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (username: string, email: string, password: string) =>
    api.post('/auth/signup', { username, email, password }),
  logout: () => api.post('/auth/logout'),
}

export const novelApi = {
  getAll: () => api.get('/novels'),
  getOne: (id: string) => api.get(`/novels/${id}`),
  create: (data: any) => api.post('/novels', data),
  update: (id: string, data: any) => api.put(`/novels/${id}`, data),
  delete: (id: string) => api.delete(`/novels/${id}`),
}

export const chapterApi = {
  getAll: (novelId: string) => api.get(`/novels/${novelId}/chapters`),
  create: (novelId: string, data: any) =>
    api.post(`/novels/${novelId}/chapters`, data),
  update: (novelId: string, chapterId: string, data: any) =>
    api.put(`/novels/${novelId}/chapters/${chapterId}`, data),
  delete: (novelId: string, chapterId: string) =>
    api.delete(`/novels/${novelId}/chapters/${chapterId}`),
}

export default api
