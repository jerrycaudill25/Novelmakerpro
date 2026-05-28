import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { authApi } from '../services/api';
import { wsService } from '../services/websocket';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useStore();
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem('nm_token');

  const { data: meData, isSuccess, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    enabled: hasToken,
    retry: false,
  });

  // 1. If there is NO token, drop the loading gate immediately
  useEffect(() => {
    if (!hasToken) {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  }, [hasToken, setUser, setAuthenticated, setLoading]);

  // 2. If the backend successfully verifies the token
  useEffect(() => {
    if (isSuccess && meData) {
      setUser(meData);
      setAuthenticated(true);
      wsService.connect();
      setLoading(false);
    }
  }, [isSuccess, meData, setUser, setAuthenticated, setLoading]);

  // 3. If the token is expired or invalid
  useEffect(() => {
    if (isError) {
      localStorage.removeItem('nm_token');
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  }, [isError, setUser, setAuthenticated, setLoading]);

  const loginMutation = useMutation({
    mutationFn: (variables: { email: string; password: any }) => 
      authApi.login(variables.email, variables.password),
    onSuccess: (data: any) => {
      const token = data.token || data.accessToken || data.access_token;
      if (token) localStorage.setItem('nm_token', token);
      
      setUser(data.user || data);
      setAuthenticated(true);
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (variables: { username: string; email: string; password: any }) => 
      authApi.signup(variables.username, variables.email, variables.password),
    onSuccess: (data: any) => {
      const token = data.token || data.accessToken || data.access_token;
      if (token) localStorage.setItem('nm_token', token);
      
      setUser(data.user || data);
      setAuthenticated(true);
      wsService.connect();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logout = () => {
    localStorage.removeItem('nm_token');
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
    registerError: loginMutation.error,
  };
}
