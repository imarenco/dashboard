import { CreateTransactionUseCase } from '../CreateTransactionUseCase';
import { TransactionService } from '../../../domain/services/TransactionService';
import { Transaction, CreateTransactionData } from '../../../domain/entities/Transaction';

// Mock the TransactionService
const mockTransactionService = {
  createTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getAnalytics: jest.fn(),
} as any;

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;

  beforeEach(() => {
    createTransactionUseCase = new CreateTransactionUseCase(mockTransactionService);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validTransactionData: CreateTransactionData = {
      customerName: 'John Doe',
      amount: 100.50,
      currency: 'USD',
    };

    const expectedTransaction: Transaction = {
      id: '1',
      customerName: 'John Doe',
      amount: 100.50,
      currency: 'USD',
      createdAt: new Date(),
    };

    it('should create a transaction successfully', async () => {
      mockTransactionService.createTransaction.mockResolvedValue(expectedTransaction);

      const result = await createTransactionUseCase.execute(validTransactionData);

      expect(result).toEqual(expectedTransaction);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(validTransactionData);
    });

    it('should propagate errors from the service', async () => {
      const errorMessage = 'Customer name is required';
      mockTransactionService.createTransaction.mockRejectedValue(new Error(errorMessage));

      await expect(createTransactionUseCase.execute(validTransactionData)).rejects.toThrow(errorMessage);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(validTransactionData);
    });
  });
}); 