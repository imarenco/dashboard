import { Transaction } from './transaction';

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export interface TransactionContextType extends TransactionState {
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (searchTerm: string) => void;
  searchTransactions: (searchTerm: string) => Promise<void>;
  
  // Computed values
  filteredTransactions: Transaction[];
  uniqueCustomers: number;
} 