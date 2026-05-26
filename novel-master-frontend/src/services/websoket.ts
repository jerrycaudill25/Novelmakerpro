import { io } from 'socket.io-client';

const WS_URL =
  import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export const socket = io(WS_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('WebSocket connected');
});

socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

socket.on('connect_error', (err) => {
  console.error('WebSocket error:', err.message);
});
