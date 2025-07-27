import { Request, Response } from 'express';
import { TransactionController } from '../TransactionController';
import { CreateTransactionUseCase } from '../../../application/useCases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '../../../application/useCases/GetTransactionsUseCase';
import { GetAnalyticsUseCase } from '../../../application/useCases/GetAnalyticsUseCase';
import { Transaction, Analytics } from '../../../domain/entities';

// Mock the use cases
jest.mock('../../../application/useCases/CreateTransactionUseCase');
jest.mock('../../../application/useCases/GetTransactionsUseCase');
jest.mock('../../../application/useCases/GetAnalyticsUseCase');

const MockedCreateTransactionUseCase = CreateTransactionUseCase as jest.MockedClass<typeof CreateTransactionUseCase>;
const MockedGetTransactionsUseCase = GetTransactionsUseCase as jest.MockedClass<typeof GetTransactionsUseCase>;
const MockedGetAnalyticsUseCase = GetAnalyticsUseCase as jest.MockedClass<typeof GetAnalyticsUseCase>;

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockCreateTransactionUseCase: jest.Mocked<CreateTransactionUseCase>;
  let mockGetTransactionsUseCase: jest.Mocked<GetTransactionsUseCase>;
  let mockGetAnalyticsUseCase: jest.Mocked<GetAnalyticsUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateTransactionUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetTransactionsUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetAnalyticsUseCase = {
      execute: jest.fn(),
    } as any;

    MockedCreateTransactionUseCase.mockImplementation(() => mockCreateTransactionUseCase);
    MockedGetTransactionsUseCase.mockImplementation(() => mockGetTransactionsUseCase);
    MockedGetAnalyticsUseCase.mockImplementation(() => mockGetAnalyticsUseCase);

    transactionController = new TransactionController(
      mockCreateTransactionUseCase,
      mockGetTransactionsUseCase,
      mockGetAnalyticsUseCase
    );

    mockRequest = {
      body: {},
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const validTransactionData = {
      customerName: 'John Doe',
      amount: 100.50,
    };

    const createdTransaction: Transaction = {
      id: '1',
      customerName: 'John Doe',
      amount: 100.50,
      createdAt: new Date(),
    };

    it('should create a transaction successfully', async () => {
      mockRequest.body = validTransactionData;
      mockCreateTransactionUseCase.execute.mockResolvedValue(createdTransaction);

      await transactionController.createTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(validTransactionData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTransaction);
    });

    it('should return 400 for validation errors', async () => {
      mockRequest.body = { customerName: '', amount: 0 };

      await transactionController.createTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          'Customer name is required',
          'Amount must be greater than 0',
        ]),
      });
    });

    it('should handle service errors', async () => {
      mockRequest.body = validTransactionData;
      const errorMessage = 'Service error';
      mockCreateTransactionUseCase.execute.mockRejectedValue(new Error(errorMessage));

      await transactionController.createTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getTransactions', () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        customerName: 'John Doe',
        amount: 100,
        createdAt: new Date(),
      },
    ];

    it('should return all transactions', async () => {
      mockGetTransactionsUseCase.execute.mockResolvedValue(mockTransactions);

      await transactionController.getTransactions(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetTransactionsUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Service error';
      mockGetTransactionsUseCase.execute.mockRejectedValue(new Error(errorMessage));

      await transactionController.getTransactions(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getAnalytics', () => {
    const mockAnalytics: Analytics = {
      totalRevenue: 100,
      totalTransactions: 1,
      uniqueCustomers: 1,
      averageTransactionValue: 100,
    };

    it('should return analytics', async () => {
      mockGetAnalyticsUseCase.execute.mockResolvedValue(mockAnalytics);

      await transactionController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetAnalyticsUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnalytics);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Service error';
      mockGetAnalyticsUseCase.execute.mockRejectedValue(new Error(errorMessage));

      await transactionController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
}); 