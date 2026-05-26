// src/hooks/useAuth.ts
import { useEffect } from 'react';
// CRITICAL FIX: Migrated from '@tanstack/react-query' v3 to '@tanstack/react-query' v5
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { api } from '../services/api';
import { wsService } from '../services/websocket';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useStore();
  const queryClient = useQueryClient();

  // CRITICAL FIX: v5 useQuery uses object syntax instead of tuple syntax
  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
    enabled: !!localStorage.getItem('nm_token'),
    retry: false,
    // onSuccess/onError removed from useQuery in v5 — use useEffect instead
  });

  // Handle successful auth data fetch
  useEffect(() => {
    if (meData) {
      setUser(meData);
      setAuthenticated(true);
      wsService.connect();
    }
  }, [meData, setUser, setAuthenticated]);

  // Handle auth error
  useEffect(() => {
    // In v5, error handling is done via the error property or separate effects
    // We check if query failed and no data exists
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

  // CRITICAL FIX: v5 useMutation uses object syntax with mutationFn
  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  // CRITICAL FIX: v5 useMutation uses object syntax with mutationFn
  const registerMutation = useMutation({
    mutationFn: api.register,
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
    // CRITICAL FIX: v5 uses isPending instead of isLoading for mutations
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
