// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import { useStore } from '../store/useStore';
import type { AIFeedback } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = localStorage.getItem('nm_token');
    if (!token) return;

    this.socket = io('/', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('ai_feedback', (data: AIFeedback) => {
      useStore.getState().setAIFeedback(data);
      useStore.getState().setAnalyzing(false);
    });

    this.socket.on('system_error', (data: { message: string }) => {
      console.error('WebSocket error:', data.message);
      useStore.getState().setAnalyzing(false);
    });

    this.socket.on('system_status', (data: { message: string }) => {
      console.log('WebSocket status:', data.message);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinEditingSession(projectId: number, fileId: number) {
    const token = localStorage.getItem('nm_token');
    this.socket?.emit('join_editing_session', {
      token,
      project_id: projectId,
      file_id: fileId,
    });
  }

  leaveEditingSession(projectId: number, fileId: number) {
    this.socket?.emit('leave_editing_session', {
      project_id: projectId,
      file_id: fileId,
    });
  }

  analyzeTextChunk(text: string, projectId: number, fileId: number) {
    useStore.getState().setAnalyzing(true);
    this.socket?.emit('analyze_text_chunk', {
      text,
      project_id: projectId,
      file_id: fileId,
    });
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const wsService = new WebSocketService();
