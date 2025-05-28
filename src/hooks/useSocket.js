import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useNotificationStore from './useNotification';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export default function useSocket(userId) {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!userId) return;

    const socket = io(socketUrl);

    socket.emit('registerUser', userId);

    socket.on('notification', (data) => {
      addNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
}
