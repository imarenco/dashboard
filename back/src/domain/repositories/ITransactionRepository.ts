import { Transaction, CreateTransactionData, Analytics } from '../entities';

export interface CurrencyStats {
  currency: string;
  totalAmount: number;
  transactionCount: number;
}

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  create(data: CreateTransactionData): Promise<Transaction>;
  getTotalRevenue(): Promise<number>;
  getUniqueCustomers(): Promise<number>;
  getAnalytics(): Promise<Analytics>;
  getAnalyticsByCurrency(): Promise<CurrencyStats[]>;
  getTotalTransactions(): Promise<number>;
} 