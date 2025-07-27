import { TransactionService } from '../TransactionService';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { ISocketManager } from '../ISocketManager';
import { Transaction, CreateTransactionData, Analytics } from '../../entities';

// Mock implementations
const mockTransactionRepository: jest.Mocked<ITransactionRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  getTotalRevenue: jest.fn(),
  getUniqueCustomers: jest.fn(),
  getAnalytics: jest.fn(),
};

const mockSocketManager: jest.Mocked<ISocketManager> = {
  broadcastNewTransaction: jest.fn(),
  broadcastAnalyticsUpdate: jest.fn(),
};

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService(mockTransactionRepository, mockSocketManager);
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
    };

    it('should create a transaction successfully', async () => {
      mockTransactionRepository.create.mockResolvedValue(createdTransaction);
      mockTransactionRepository.getAnalytics.mockResolvedValue(mockAnalytics);

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
    it('should return analytics', async () => {
      const mockAnalytics: Analytics = {
        totalRevenue: 300,
        totalTransactions: 2,
        uniqueCustomers: 2,
        averageTransactionValue: 150,
      };

      mockTransactionRepository.getAnalytics.mockResolvedValue(mockAnalytics);

      const result = await transactionService.getAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(mockTransactionRepository.getAnalytics).toHaveBeenCalled();
    });
  });
}); 