import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    username: string;
    display_name: string;
    tier: string;
    role: string;
    storage_used_mb: number;
    storage_limit_mb: number;
  };
}

interface User {
  user_id: number;
  username: string;
  display_name: string;
  email: string;
  tier: string;
  role: string;
  bio: string;
  storage_used_mb: number;
  storage_limit_mb: number;
  is_verified: boolean;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to every request if it exists
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 responses
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Store token and user in localStorage
   */
  private setAuth(token: string, user: any): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear auth (logout)
   */
  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Register new user
   */
  async register(
    username: string,
    email: string,
    password: string,
    displayName: string
  ): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/api/auth/register', {
        username,
        email,
        password,
        display_name: displayName,
      });
      
      const { token, user } = response.data;
      this.setAuth(token, user);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/api/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      this.setAuth(token, user);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<User> {
    try {
      const response = await this.api.get('/api/auth/me');
      const user = response.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuth();
  }

  /**
   * Get axios instance for other services to use
   */
  getApi(): AxiosInstance {
    return this.api;
  }
}

export default new AuthService();
