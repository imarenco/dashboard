import { TransactionService } from '../TransactionService';
import { ITransactionRepository, CurrencyStats } from '../../repositories/ITransactionRepository';
import { ISocketManager } from '../ISocketManager';
import { CurrencyConversionService } from '../CurrencyConversionService';
import { Transaction, CreateTransactionData, Analytics } from '../../entities';

// Mock implementations
const mockTransactionRepository: jest.Mocked<ITransactionRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  getTotalRevenue: jest.fn(),
  getUniqueCustomers: jest.fn(),
  getAnalytics: jest.fn(),
  getAnalyticsByCurrency: jest.fn(),
  getTotalTransactions: jest.fn(),
};

const mockSocketManager: jest.Mocked<ISocketManager> = {
  broadcastNewTransaction: jest.fn(),
  broadcastAnalyticsUpdate: jest.fn(),
};

const mockCurrencyConversionService: jest.Mocked<CurrencyConversionService> = {
  convertToBaseCurrency: jest.fn(),
  getExchangeRate: jest.fn(),
};

describe('TransactionService Performance', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService(
      mockTransactionRepository,
      mockSocketManager,
      mockCurrencyConversionService
    );
    jest.clearAllMocks();
  });

  describe('getAnalytics with Currency Aggregation', () => {
    it('should calculate analytics efficiently using currency aggregation', async () => {
      // Mock currency stats from aggregation
      const mockCurrencyStats: CurrencyStats[] = [
        {
          currency: 'USD',
          totalAmount: 1000,
          transactionCount: 5,
        },
        {
          currency: 'EUR',
          totalAmount: 800,
          transactionCount: 3,
        },
        {
          currency: 'GBP',
          totalAmount: 600,
          transactionCount: 2,
        },
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(10);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(7);

      // Mock currency conversions
      mockCurrencyConversionService.convertToBaseCurrency
        .mockReturnValueOnce(1000) // USD stays 1000
        .mockReturnValueOnce(941.18) // EUR 800 -> USD (800/0.85)
        .mockReturnValueOnce(821.92); // GBP 600 -> USD (600/0.73)

      const analytics = await transactionService.getAnalytics();

      // Expected total: 1000 + 941.18 + 821.92 = 2763.10 USD
      expect(analytics.totalRevenue).toBeCloseTo(2763.10, 2);
      expect(analytics.totalTransactions).toBe(10);
      expect(analytics.uniqueCustomers).toBe(7);
      expect(analytics.averageTransactionValue).toBeCloseTo(276.31, 2);
      expect(analytics.baseCurrency).toBe('USD');

      // Verify aggregation was called instead of findAll
      expect(mockTransactionRepository.getAnalyticsByCurrency).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.getTotalTransactions).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.getUniqueCustomers).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.findAll).not.toHaveBeenCalled();

      // Verify currency conversions were called correctly
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledTimes(3);
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledWith(1000, 'USD', 'USD');
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledWith(800, 'EUR', 'USD');
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledWith(600, 'GBP', 'USD');
    });

    it('should handle empty currency stats correctly', async () => {
      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue([]);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(0);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(0);

      const analytics = await transactionService.getAnalytics();

      expect(analytics.totalRevenue).toBe(0);
      expect(analytics.totalTransactions).toBe(0);
      expect(analytics.uniqueCustomers).toBe(0);
      expect(analytics.averageTransactionValue).toBe(0);
      expect(analytics.baseCurrency).toBe('USD');

      expect(mockCurrencyConversionService.convertToBaseCurrency).not.toHaveBeenCalled();
    });

    it('should handle single currency correctly', async () => {
      const mockCurrencyStats: CurrencyStats[] = [
        {
          currency: 'USD',
          totalAmount: 1500,
          transactionCount: 3,
        },
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(3);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(2);

      mockCurrencyConversionService.convertToBaseCurrency.mockReturnValue(1500);

      const analytics = await transactionService.getAnalytics();

      expect(analytics.totalRevenue).toBe(1500);
      expect(analytics.totalTransactions).toBe(3);
      expect(analytics.uniqueCustomers).toBe(2);
      expect(analytics.averageTransactionValue).toBe(500);
      expect(analytics.baseCurrency).toBe('USD');

      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledTimes(1);
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledWith(1500, 'USD', 'USD');
    });
  });

  describe('Performance Benefits', () => {
    it('should use aggregation instead of loading all transactions', async () => {
      const mockCurrencyStats: CurrencyStats[] = [
        { currency: 'USD', totalAmount: 100, transactionCount: 1 },
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(1);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(1);
      mockCurrencyConversionService.convertToBaseCurrency.mockReturnValue(100);

      await transactionService.getAnalytics();

      // Should use aggregation methods
      expect(mockTransactionRepository.getAnalyticsByCurrency).toHaveBeenCalled();
      expect(mockTransactionRepository.getTotalTransactions).toHaveBeenCalled();
      expect(mockTransactionRepository.getUniqueCustomers).toHaveBeenCalled();

      // Should NOT load all transactions
      expect(mockTransactionRepository.findAll).not.toHaveBeenCalled();
    });
  });
}); 