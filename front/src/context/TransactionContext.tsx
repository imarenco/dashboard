'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { TransactionContextType, TransactionState } from '@/types/transactionContext';
import { Transaction } from '@/types/transaction';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

// Initial state
const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  searchTerm: '',
};

// Action types
type TransactionAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string };

// Reducer
function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        error: null,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Provider component
export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Socket.IO integration
  const { onNewTransaction } = useSocket();

  useEffect(() => {
    onNewTransaction((transaction: Transaction) => {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    });
  }, [onNewTransaction]);

  // Actions
  const setTransactions = (transactions: Transaction[]) => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
  };

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  };

  const searchTransactions = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll filter client-side since the backend doesn't support search yet
      // In the future, this could be: const transactions = await api.getTransactions(searchTerm);
      const transactions = await api.getTransactions();
      const filtered = searchTerm.trim() 
        ? transactions.filter(t => 
            t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : transactions;
      
      setTransactions(filtered);
      setSearchTerm(searchTerm);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search transactions');
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const filteredTransactions = useMemo(() => {
    if (!state.searchTerm.trim()) {
      return state.transactions;
    }
    return state.transactions.filter(transaction =>
      transaction.customerName.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }, [state.transactions, state.searchTerm]);

  const uniqueCustomers = useMemo(() => {
    return new Set(state.transactions.map(t => t.customerName)).size;
  }, [state.transactions]);

  // Fetch initial data
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const transactions = await api.getTransactions();
        setTransactions(transactions);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const contextValue: TransactionContextType = {
    ...state,
    setTransactions,
    addTransaction,
    setLoading,
    setError,
    setSearchTerm,
    searchTransactions,
    filteredTransactions,
    uniqueCustomers,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

// Custom hook to use the context
export function useTransactionContext(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
} 