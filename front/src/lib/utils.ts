import { Transaction } from '@/types/transaction';

/**
 * Generates a unique key for a transaction by combining multiple fields
 * This helps prevent duplicate key issues in React components
 */
export const generateTransactionKey = (transaction: Transaction): string => {
  return `${transaction.id}-${transaction.createdAt}-${transaction.customerName}-${transaction.amount}`;
};

/**
 * Checks if two transactions are duplicates by comparing their unique keys
 */
export const areTransactionsDuplicate = (transaction1: Transaction, transaction2: Transaction): boolean => {
  return generateTransactionKey(transaction1) === generateTransactionKey(transaction2);
}; 