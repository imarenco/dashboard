import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Transaction } from '@/types/transaction';
import { Analytics } from '@/types/analytics';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const newSocket = io(apiUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server:', newSocket.id);
      setIsConnected(true);
      
      // Join the dashboard room for real-time updates
      newSocket.emit('join-dashboard');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      
      // Rejoin the dashboard room after reconnection
      newSocket.emit('join-dashboard');
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-dashboard');
      newSocket.close();
    };
  }, []);

  const onNewTransaction = (callback: (transaction: Transaction) => void) => {
    if (socket) {
      socket.on('newTransaction', callback);
    }
  };

  const onAnalyticsUpdate = (callback: (analytics: Analytics) => void) => {
    if (socket) {
      socket.on('analyticsUpdate', callback);
    }
  };

  const offNewTransaction = () => {
    if (socket) {
      socket.off('newTransaction');
    }
  };

  const offAnalyticsUpdate = () => {
    if (socket) {
      socket.off('analyticsUpdate');
    }
  };

  return {
    socket,
    isConnected,
    onNewTransaction,
    onAnalyticsUpdate,
    offNewTransaction,
    offAnalyticsUpdate,
  };
}; 