import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (!socket) {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected successfully with ID:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.io] Connection simulated / pending backend:', err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
