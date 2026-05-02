import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@petpooja/shared';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  socket = io('/', {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function onSocketEvent<T>(event: SocketEvents, callback: (data: T) => void) {
  socket?.on(event, callback);
  return () => {
    socket?.off(event, callback);
  };
}
