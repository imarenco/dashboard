import { api } from '../api';
import { CreateTransactionData } from '@/types/transaction';

// Mock fetch globally
global.fetch = jest.fn();

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockTransactions = [
        {
          id: '1',
          customerName: 'John Doe',
          amount: 100,
          currency: 'USD',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await api.getTransactions();

      expect(result).toEqual(mockTransactions);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/transactions');
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getTransactions()).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const transactionData: CreateTransactionData = {
        customerName: 'John Doe',
        amount: '100',
        currency: 'USD',
      };

      const mockTransaction = {
        id: '1',
        customerName: 'John Doe',
        amount: 100,
        currency: 'USD',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await api.createTransaction(transactionData);

      expect(result).toEqual(mockTransaction);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
    });

    it('should throw error when creation fails', async () => {
      const transactionData: CreateTransactionData = {
        customerName: 'John Doe',
        amount: '100',
        currency: 'USD',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Validation failed' }),
      });

      await expect(api.createTransaction(transactionData)).rejects.toThrow('Validation failed');
    });
  });

  describe('getAnalytics', () => {
    it('should fetch analytics successfully', async () => {
      const mockAnalytics = {
        totalRevenue: 1000,
        totalTransactions: 10,
        uniqueCustomers: 5,
        averageTransactionValue: 100,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalytics,
      });

      const result = await api.getAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/analytics');
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getAnalytics()).rejects.toThrow('Failed to fetch analytics');
    });
  });

  describe('API_BASE_URL', () => {
    it('should use environment variable when available', () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'http://custom-api.com';

      // Re-import to get the updated API_BASE_URL
      jest.resetModules();
      const { api: newApi } = require('../api');

      expect(newApi).toBeDefined();
      
      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it('should fallback to localhost when environment variable is not set', () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      // Re-import to get the updated API_BASE_URL
      jest.resetModules();
      const { api: newApi } = require('../api');

      expect(newApi).toBeDefined();
      
      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });
}); 