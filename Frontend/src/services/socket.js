import { io } from 'socket.io-client';

let socket = null;

const getSocketUrl = () => {
  if (typeof window !== 'undefined') {
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    if (envUrl && !envUrl.includes('localhost')) {
      return envUrl;
    }
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const initSocket = (token) => {
  if (!socket) {
    const SOCKET_URL = getSocketUrl();
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected successfully with ID:', socket.id, 'to', SOCKET_URL);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.io] Connection pending backend:', err.message);
    });
  } else if (!socket.connected) {
    socket.connect();
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
