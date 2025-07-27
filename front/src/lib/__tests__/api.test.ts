import { api } from '../api'
import { Transaction, CreateTransactionData } from '../../types/transaction'
import { Analytics } from '../../types/analytics'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          customerName: 'John Doe',
          amount: 100,
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      })

      const result = await api.getTransactions()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/transactions')
      expect(result).toEqual(mockTransactions)
    })

    it('should handle fetch error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(api.getTransactions()).rejects.toThrow('Failed to fetch transactions')
    })

    it('should handle network error', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(api.getTransactions()).rejects.toThrow('Network error')
    })
  })

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const transactionData: CreateTransactionData = {
        customerName: 'John Doe',
        amount: '100',
      }

      const createdTransaction: Transaction = {
        id: '1',
        customerName: 'John Doe',
        amount: 100,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdTransaction,
      })

      const result = await api.createTransaction(transactionData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      expect(result).toEqual(createdTransaction)
    })

    it('should handle creation error', async () => {
      const transactionData: CreateTransactionData = {
        customerName: 'John Doe',
        amount: '100',
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Validation failed' }),
      })

      await expect(api.createTransaction(transactionData)).rejects.toThrow('Validation failed')
    })
  })

  describe('getAnalytics', () => {
    it('should fetch analytics successfully', async () => {
      const mockAnalytics: Analytics = {
        totalRevenue: 1000,
        totalTransactions: 10,
        uniqueCustomers: 5,
        averageTransactionValue: 100,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalytics,
      })

      const result = await api.getAnalytics()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/analytics')
      expect(result).toEqual(mockAnalytics)
    })

    it('should handle analytics fetch error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(api.getAnalytics()).rejects.toThrow('Failed to fetch analytics')
    })
  })

  describe('API base URL configuration', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should use environment variable for API URL', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://custom-api.com'
      
      // Re-import to get fresh module with new env
      const { api: freshApi } = await import('../api')

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await freshApi.getTransactions()

      expect(fetch).toHaveBeenCalledWith('http://custom-api.com/api/transactions')
    })

    it('should fallback to default URL when env var is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL
      
      // Re-import to get fresh module with new env
      const { api: freshApi } = await import('../api')

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await freshApi.getTransactions()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/transactions')
    })
  })
}) 