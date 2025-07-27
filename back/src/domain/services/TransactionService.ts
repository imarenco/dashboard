import { Transaction, CreateTransactionData, Analytics } from '../entities';
import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { ISocketManager } from './ISocketManager';

export class TransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private socketManager: ISocketManager
  ) {}

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    // Business validation
    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new Error('Customer name is required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!data.currency || data.currency.trim().length === 0) {
      throw new Error('Currency is required');
    }

    // Create transaction
    const transaction = await this.transactionRepository.create(data);

    // Broadcast new transaction
    this.socketManager.broadcastNewTransaction(transaction);

    // Get updated analytics and broadcast
    const analytics = await this.transactionRepository.getAnalytics();
    this.socketManager.broadcastAnalyticsUpdate(analytics);

    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async getAnalytics(): Promise<Analytics> {
    return this.transactionRepository.getAnalytics();
  }
} 