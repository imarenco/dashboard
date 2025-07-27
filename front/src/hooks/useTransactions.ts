import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { onNewTransaction, offNewTransaction } = useSocket();

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    onNewTransaction((transaction: Transaction) => {
      setTransactions(prev => [transaction, ...prev]);
    });

    return () => {
      offNewTransaction();
    };
  }, [onNewTransaction, offNewTransaction]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    transactions,
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    loading,
    refetch: fetchTransactions,
  };
}; 