import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - return data directly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only handle 401 on explicit auth endpoints, not on general API calls
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('nm_token')
      localStorage.removeItem('nm_user')
      // Don't force redirect here - let components handle it
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (credentials: {username: string, password: string}) =>
    api.post('/auth/login', credentials),
  signup: (data: {username: string, email: string, password: string, display_name: string}) =>
    api.post('/auth/register', data),
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
  create: (novelId: string, data: any) => api.post(`/novels/${novelId}/chapters`, data),
  update: (novelId: string, chapterId: string, data: any) => api.put(`/novels/${novelId}/chapters/${chapterId}`, data),
  delete: (novelId: string, chapterId: string) => api.delete(`/novels/${novelId}/chapters/${chapterId}`),
}

export const feedApi = {
  getFeed: (limit: number = 20, offset: number = 0) =>
    api.get(`/feed?limit=${limit}&offset=${offset}`),
  getPost: (id: string) => api.get(`/feed/${id}`),
  createPost: (data: any) => api.post('/feed', data),
  likePost: (id: string) => api.post(`/feed/${id}/like`),
  commentPost: (id: string, data: any) => api.post(`/feed/${id}/comments`, data),
}

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: number, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
}

export { api }
export default api
