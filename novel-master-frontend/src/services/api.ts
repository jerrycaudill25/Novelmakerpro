import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
})

api.interceptors.request.use((config) => {
  // Standardized to 'nm_token' to match useAuth.ts
  const token = localStorage.getItem('nm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data, // Extracts data payload directly so you don't have to use .data.data everywhere
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nm_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  signup: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
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

export const feedApi = {
  getFeed: (limit: number = 20, offset: number = 0) =>
    api.get(`/feed?limit=${limit}&offset=${offset}`),
}

export { api }
export default api
