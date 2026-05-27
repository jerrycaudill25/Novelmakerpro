import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { authApi } from '../services/api';
import { wsService } from '../services/websocket';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useStore();
  const queryClient = useQueryClient();

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    enabled: !!localStorage.getItem('nm_token'),
    retry: false,
  });

  useEffect(() => {
    if (meData) {
      setUser(meData);
      setAuthenticated(true);
      wsService.connect();
    }
  }, [meData, setUser, setAuthenticated]);

  useEffect(() => {
    const hasToken = !!localStorage.getItem('nm_token');
    if (!meLoading && !meData && hasToken) {
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('nm_token');
    }
  }, [meLoading, meData, setUser, setAuthenticated]);

  useEffect(() => {
    if (!meLoading) {
      setLoading(false);
    }
  }, [meLoading, setLoading]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logout = () => {
    useStore.getState().logout();
    wsService.disconnect();
    queryClient.clear();
  };

  return {
    user,
    isAuthenticated,
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
