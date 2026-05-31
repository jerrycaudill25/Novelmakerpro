import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { authApi } from '../services/api';
import { wsService } from '../services/websocket';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useStore();
  const queryClient = useQueryClient();
  
  const hasToken = !!(localStorage.getItem('nm_token') || localStorage.getItem('token'));

  // IMMEDIATE: Restore user from localStorage on mount (prevents flash of unauthenticated state)
  useEffect(() => {
    if (!user && hasToken) {
      const savedUser = localStorage.getItem('nm_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setAuthenticated(true);
          setLoading(false);
        } catch (e) {
          // Invalid stored user, ignore
        }
      }
    }
  }, []);

  // Fetch fresh user data from backend (silent, doesn't block UI)
  const { data: meData, isSuccess } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    enabled: hasToken,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Update user with fresh data from backend
  useEffect(() => {
    if (isSuccess && meData) {
      setUser(meData);
      setAuthenticated(true);
      localStorage.setItem('nm_user', JSON.stringify(meData));
      wsService.connect();
      setLoading(false);
    }
  }, [isSuccess, meData, setUser, setAuthenticated, setLoading]);

  // If no token at all, ensure logged out
  useEffect(() => {
    if (!hasToken) {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  }, [hasToken, setUser, setAuthenticated, setLoading]);

  const loginMutation = useMutation({
    mutationFn: (variables: { username: string; password: string }) =>
      authApi.login({ username: variables.username, password: variables.password }),
    onSuccess: (data: any) => {
      const token = data.token || data.accessToken || data.access_token;
      if (token) {
        localStorage.setItem('nm_token', token);
        localStorage.removeItem('token');
      }
      const userData = data.user || data;
      setUser(userData);
      setAuthenticated(true);
      localStorage.setItem('nm_user', JSON.stringify(userData));
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (variables: { username: string; email: string; password: string; display_name: string }) =>
      authApi.signup(variables),
    onSuccess: (data: any) => {
      const token = data.token || data.accessToken || data.access_token;
      if (token) {
        localStorage.setItem('nm_token', token);
        localStorage.removeItem('token');
      }
      const userData = data.user || data;
      setUser(userData);
      setAuthenticated(true);
      localStorage.setItem('nm_user', JSON.stringify(userData));
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logout = () => {
    localStorage.removeItem('nm_token');
    localStorage.removeItem('token');
    localStorage.removeItem('nm_user');
    useStore.getState().logout();
    wsService.disconnect();
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user,
    isAuthenticated: isAuthenticated || hasToken,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
