import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Transaction } from '@/types/transaction';
import { Analytics } from '@/types/analytics';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const newSocket = io(apiUrl);
    setSocket(newSocket);

    return () => {
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
    onNewTransaction,
    onAnalyticsUpdate,
    offNewTransaction,
    offAnalyticsUpdate,
  };
}; 