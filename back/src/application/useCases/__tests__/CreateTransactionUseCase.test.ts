import { CreateTransactionUseCase } from '../CreateTransactionUseCase';
import { TransactionService } from '../../../domain/services/TransactionService';
import { CreateTransactionData, Transaction } from '../../../domain/entities/Transaction';

// Mock the TransactionService
jest.mock('../../../domain/services/TransactionService');

const MockedTransactionService = TransactionService as jest.MockedClass<typeof TransactionService>;

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let mockTransactionService: jest.Mocked<TransactionService>;

  beforeEach(() => {
    mockTransactionService = {
      createTransaction: jest.fn(),
      getAllTransactions: jest.fn(),
      getAnalytics: jest.fn(),
    } as any;

    MockedTransactionService.mockImplementation(() => mockTransactionService);
    createTransactionUseCase = new CreateTransactionUseCase(mockTransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validTransactionData: CreateTransactionData = {
      customerName: 'John Doe',
      amount: 100.50,
    };

    const expectedTransaction: Transaction = {
      id: '1',
      customerName: 'John Doe',
      amount: 100.50,
      createdAt: new Date(),
    };

    it('should create a transaction successfully', async () => {
      mockTransactionService.createTransaction.mockResolvedValue(expectedTransaction);

      const result = await createTransactionUseCase.execute(validTransactionData);

      expect(result).toEqual(expectedTransaction);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(validTransactionData);
    });

    it('should propagate errors from the service', async () => {
      const errorMessage = 'Service error';
      mockTransactionService.createTransaction.mockRejectedValue(new Error(errorMessage));

      await expect(createTransactionUseCase.execute(validTransactionData)).rejects.toThrow(errorMessage);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(validTransactionData);
    });
  });
}); 