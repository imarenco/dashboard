import request from 'supertest';
import express from 'express';
import { TransactionController } from '../TransactionController';
import { CreateTransactionUseCase } from '../../../application/useCases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '../../../application/useCases/GetTransactionsUseCase';
import { GetAnalyticsUseCase } from '../../../application/useCases/GetAnalyticsUseCase';
import { Transaction } from '../../../domain/entities/Transaction';
import { Analytics } from '../../../domain/entities/Analytics';

// Mock the use cases
const mockCreateTransactionUseCase = {
  execute: jest.fn(),
} as any;

const mockGetTransactionsUseCase = {
  execute: jest.fn(),
} as any;

const mockGetAnalyticsUseCase = {
  execute: jest.fn(),
} as any;

describe('TransactionController', () => {
  let app: express.Application;
  let transactionController: TransactionController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    transactionController = new TransactionController(
      mockCreateTransactionUseCase,
      mockGetTransactionsUseCase,
      mockGetAnalyticsUseCase
    );

    // Register routes
    app.post('/api/transactions', (req, res) => transactionController.createTransaction(req, res));
    app.get('/api/transactions', (req, res) => transactionController.getTransactions(req, res));
    app.get('/api/analytics', (req, res) => transactionController.getAnalytics(req, res));

    jest.clearAllMocks();
  });

  describe('POST /api/transactions', () => {
    const validTransactionData = {
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

    it('should create a transaction successfully', async () => {
      mockCreateTransactionUseCase.execute.mockResolvedValue(createdTransaction);

      const response = await request(app)
        .post('/api/transactions')
        .send(validTransactionData)
        .expect(201);

      // Check that the response has the same data but with string date
      expect(response.body).toMatchObject({
        id: createdTransaction.id,
        customerName: createdTransaction.customerName,
        amount: createdTransaction.amount,
        currency: createdTransaction.currency,
      });
      expect(response.body.createdAt).toBe(createdTransaction.createdAt.toISOString());
      expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(validTransactionData);
    });

    it('should return 400 for missing customer name', async () => {
      const invalidData = { ...validTransactionData, customerName: '' };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toContain('Customer name is required');
      expect(mockCreateTransactionUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid amount', async () => {
      const invalidData = { ...validTransactionData, amount: 0 };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toContain('Amount must be greater than 0');
      expect(mockCreateTransactionUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid currency', async () => {
      const invalidData = { ...validTransactionData, currency: 'INVALID' };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toContain('Currency must be one of: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL');
      expect(mockCreateTransactionUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 500 for service errors', async () => {
      mockCreateTransactionUseCase.execute.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/api/transactions')
        .send(validTransactionData)
        .expect(500);

      expect(response.body.error).toBe('Service error');
    });
  });

  describe('GET /api/transactions', () => {
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

      mockGetTransactionsUseCase.execute.mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      // Check that the response has the same data but with string dates
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: mockTransactions[0].id,
        customerName: mockTransactions[0].customerName,
        amount: mockTransactions[0].amount,
        currency: mockTransactions[0].currency,
      });
      expect(response.body[0].createdAt).toBe(mockTransactions[0].createdAt.toISOString());
      expect(mockGetTransactionsUseCase.execute).toHaveBeenCalled();
    });

    it('should return 500 for service errors', async () => {
      mockGetTransactionsUseCase.execute.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/transactions')
        .expect(500);

      expect(response.body.error).toBe('Service error');
    });
  });

  describe('GET /api/analytics', () => {
    it('should return analytics', async () => {
      const mockAnalytics: Analytics = {
        totalRevenue: 300,
        totalTransactions: 2,
        uniqueCustomers: 2,
        averageTransactionValue: 150,
        baseCurrency: 'USD',
      };

      mockGetAnalyticsUseCase.execute.mockResolvedValue(mockAnalytics);

      const response = await request(app)
        .get('/api/analytics')
        .expect(200);

      expect(response.body).toEqual(mockAnalytics);
      expect(mockGetAnalyticsUseCase.execute).toHaveBeenCalled();
    });

    it('should return 500 for service errors', async () => {
      mockGetAnalyticsUseCase.execute.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/analytics')
        .expect(500);

      expect(response.body.error).toBe('Service error');
    });
  });
}); 