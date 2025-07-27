import { Transaction, CreateTransactionData, Analytics } from '../entities';
import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { ISocketManager } from './ISocketManager';
import { CurrencyConversionService } from './CurrencyConversionService';

export class TransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private socketManager: ISocketManager,
    private currencyConversionService: CurrencyConversionService
  ) {}

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    // Business validation
    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new Error('Customer name is required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL'];
    if (!data.currency || !validCurrencies.includes(data.currency)) {
      throw new Error('Currency must be one of: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL');
    }

    // Create transaction
    const transaction = await this.transactionRepository.create(data);

    // Broadcast new transaction
    this.socketManager.broadcastNewTransaction(transaction);

    // Get updated analytics and broadcast
    const analytics = await this.getAnalytics();
    this.socketManager.broadcastAnalyticsUpdate(analytics);

    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async getAnalytics(): Promise<Analytics> {
    // Use aggregation to get analytics by currency for better performance
    const currencyStats = await this.transactionRepository.getAnalyticsByCurrency();
    const totalTransactions = await this.transactionRepository.getTotalTransactions();
    const uniqueCustomers = await this.transactionRepository.getUniqueCustomers();

    // Convert all amounts to USD and sum them
    let totalRevenueUSD = 0;
    for (const stat of currencyStats) {
      const convertedAmount = this.currencyConversionService.convertToBaseCurrency(
        stat.totalAmount,
        stat.currency,
        'USD'
      );
      totalRevenueUSD += convertedAmount;
    }

    const averageTransactionValue = totalTransactions > 0 ? totalRevenueUSD / totalTransactions : 0;

    return {
      totalRevenue: totalRevenueUSD,
      totalTransactions,
      uniqueCustomers,
      averageTransactionValue,
      baseCurrency: 'USD',
    };
  }
} 