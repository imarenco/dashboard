import { CurrencyConversionServiceImpl } from '../CurrencyConversionService';
import { TransactionService } from '../TransactionService';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { ISocketManager } from '../ISocketManager';

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

describe('Currency Conversion Integration', () => {
  let currencyService: CurrencyConversionServiceImpl;
  let transactionService: TransactionService;

  beforeEach(() => {
    currencyService = new CurrencyConversionServiceImpl();
    transactionService = new TransactionService(
      mockTransactionRepository,
      mockSocketManager,
      currencyService
    );
    jest.clearAllMocks();
  });

  describe('Multi-currency Analytics Calculation', () => {
    it('should correctly calculate total revenue from mixed currencies', async () => {
      // Mock currency stats from aggregation
      const mockCurrencyStats = [
        {
          currency: 'USD',
          totalAmount: 100,
          transactionCount: 1,
        },
        {
          currency: 'EUR',
          totalAmount: 100,
          transactionCount: 1,
        },
        {
          currency: 'GBP',
          totalAmount: 100,
          transactionCount: 1,
        },
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(3);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(3);

      const analytics = await transactionService.getAnalytics();

      // Expected calculations:
      // USD: 100 USD = 100 USD
      // EUR: 100 EUR = 100 / 0.85 = 117.65 USD
      // GBP: 100 GBP = 100 / 0.73 = 136.99 USD
      // Total: 100 + 117.65 + 136.99 = 354.63 USD (with floating point precision)
      expect(analytics.totalRevenue).toBeCloseTo(354.63, 2);
      expect(analytics.totalTransactions).toBe(3);
      expect(analytics.uniqueCustomers).toBe(3);
      expect(analytics.averageTransactionValue).toBeCloseTo(118.21, 2);
      expect(analytics.baseCurrency).toBe('USD');
    });

    it('should handle zero transactions correctly', async () => {
      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue([]);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(0);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(0);

      const analytics = await transactionService.getAnalytics();

      expect(analytics.totalRevenue).toBe(0);
      expect(analytics.totalTransactions).toBe(0);
      expect(analytics.uniqueCustomers).toBe(0);
      expect(analytics.averageTransactionValue).toBe(0);
      expect(analytics.baseCurrency).toBe('USD');
    });

    it('should handle duplicate customers correctly', async () => {
      const mockCurrencyStats = [
        {
          currency: 'USD',
          totalAmount: 100,
          transactionCount: 1,
        },
        {
          currency: 'EUR',
          totalAmount: 200,
          transactionCount: 1,
        },
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(2);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(1);

      const analytics = await transactionService.getAnalytics();

      expect(analytics.totalRevenue).toBeCloseTo(335.29, 2); // 100 + (200/0.85)
      expect(analytics.totalTransactions).toBe(2);
      expect(analytics.uniqueCustomers).toBe(1); // Only one unique customer
      expect(analytics.averageTransactionValue).toBeCloseTo(167.65, 2);
    });
  });

  describe('Exchange Rate Accuracy', () => {
    it('should provide realistic exchange rates', () => {
      // Test some common currency pairs
      const usdToEur = currencyService.getExchangeRate('USD', 'EUR');
      const eurToUsd = currencyService.getExchangeRate('EUR', 'USD');
      const usdToGbp = currencyService.getExchangeRate('USD', 'GBP');
      const gbpToUsd = currencyService.getExchangeRate('GBP', 'USD');

      // Verify rates are realistic (not exact market rates, but reasonable)
      expect(usdToEur).toBeGreaterThan(0.5);
      expect(usdToEur).toBeLessThan(2.0);
      expect(eurToUsd).toBeGreaterThan(0.5);
      expect(eurToUsd).toBeLessThan(2.0);
      expect(usdToGbp).toBeGreaterThan(0.5);
      expect(usdToGbp).toBeLessThan(2.0);
      expect(gbpToUsd).toBeGreaterThan(0.5);
      expect(gbpToUsd).toBeLessThan(2.0);

      // Verify inverse relationships
      expect(usdToEur * eurToUsd).toBeCloseTo(1, 10);
      expect(usdToGbp * gbpToUsd).toBeCloseTo(1, 10);
    });
  });
}); 