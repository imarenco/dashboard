import { TransactionService } from '../TransactionService';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
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

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService(
      mockTransactionRepository, 
      mockSocketManager, 
      mockCurrencyConversionService
    );
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const validTransactionData: CreateTransactionData = {
      customerName: 'John Doe',
      amount: 100.50,
      currency: 'USD',
    };

    const createdTransaction: Transaction = {
      id: '1',
      customerName: 'John Doe',
      amount: 100.50,
      currency: 'USD',
      createdAt: new Date(),
    };

    const mockAnalytics: Analytics = {
      totalRevenue: 100.50,
      totalTransactions: 1,
      uniqueCustomers: 1,
      averageTransactionValue: 100.50,
      baseCurrency: 'USD',
    };

    it('should create a transaction successfully', async () => {
      mockTransactionRepository.create.mockResolvedValue(createdTransaction);
      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue([
        { currency: 'USD', totalAmount: 100.50, transactionCount: 1 }
      ]);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(1);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(1);
      mockCurrencyConversionService.convertToBaseCurrency.mockReturnValue(100.50);

      const result = await transactionService.createTransaction(validTransactionData);

      expect(result).toEqual(createdTransaction);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(validTransactionData);
      expect(mockSocketManager.broadcastNewTransaction).toHaveBeenCalledWith(createdTransaction);
      expect(mockSocketManager.broadcastAnalyticsUpdate).toHaveBeenCalledWith(mockAnalytics);
    });

    it('should throw error when customer name is empty', async () => {
      const invalidData = { ...validTransactionData, customerName: '' };

      await expect(transactionService.createTransaction(invalidData)).rejects.toThrow(
        'Customer name is required'
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockSocketManager.broadcastNewTransaction).not.toHaveBeenCalled();
    });

    it('should throw error when customer name is only whitespace', async () => {
      const invalidData = { ...validTransactionData, customerName: '   ' };

      await expect(transactionService.createTransaction(invalidData)).rejects.toThrow(
        'Customer name is required'
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockSocketManager.broadcastNewTransaction).not.toHaveBeenCalled();
    });

    it('should throw error when amount is zero', async () => {
      const invalidData = { ...validTransactionData, amount: 0 };

      await expect(transactionService.createTransaction(invalidData)).rejects.toThrow(
        'Amount must be greater than 0'
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockSocketManager.broadcastNewTransaction).not.toHaveBeenCalled();
    });

    it('should throw error when amount is negative', async () => {
      const invalidData = { ...validTransactionData, amount: -50 };

      await expect(transactionService.createTransaction(invalidData)).rejects.toThrow(
        'Amount must be greater than 0'
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockSocketManager.broadcastNewTransaction).not.toHaveBeenCalled();
    });

    it('should throw error when currency is invalid', async () => {
      const invalidData = { ...validTransactionData, currency: 'INVALID' };

      await expect(transactionService.createTransaction(invalidData)).rejects.toThrow(
        'Currency must be one of: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL'
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockSocketManager.broadcastNewTransaction).not.toHaveBeenCalled();
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          customerName: 'John Doe',
          amount: 100,
          currency: 'USD',
          createdAt: new Date(),
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          amount: 200,
          currency: 'EUR',
          createdAt: new Date(),
        },
      ];

      mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

      const result = await transactionService.getAllTransactions();

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics with currency conversion', async () => {
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
      ];

      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue(mockCurrencyStats);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(2);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(2);
      mockCurrencyConversionService.convertToBaseCurrency
        .mockReturnValueOnce(100) // USD amount stays 100
        .mockReturnValueOnce(117.65); // EUR 100 converted to USD

      const result = await transactionService.getAnalytics();

      expect(result).toEqual({
        totalRevenue: 217.65,
        totalTransactions: 2,
        uniqueCustomers: 2,
        averageTransactionValue: 108.825,
        baseCurrency: 'USD',
      });
      expect(mockTransactionRepository.getAnalyticsByCurrency).toHaveBeenCalled();
      expect(mockTransactionRepository.getTotalTransactions).toHaveBeenCalled();
      expect(mockTransactionRepository.getUniqueCustomers).toHaveBeenCalled();
      expect(mockCurrencyConversionService.convertToBaseCurrency).toHaveBeenCalledTimes(2);
    });

    it('should return zero analytics when no transactions', async () => {
      mockTransactionRepository.getAnalyticsByCurrency.mockResolvedValue([]);
      mockTransactionRepository.getTotalTransactions.mockResolvedValue(0);
      mockTransactionRepository.getUniqueCustomers.mockResolvedValue(0);

      const result = await transactionService.getAnalytics();

      expect(result).toEqual({
        totalRevenue: 0,
        totalTransactions: 0,
        uniqueCustomers: 0,
        averageTransactionValue: 0,
        baseCurrency: 'USD',
      });
    });
  });
}); 