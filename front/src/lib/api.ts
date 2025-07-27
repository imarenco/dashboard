import { Transaction, CreateTransactionData } from '@/types/transaction';
import { Analytics } from '@/types/analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create transaction');
    }

    return response.json();
  },

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return response.json();
  },
}; 