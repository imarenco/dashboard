import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { Transaction, CreateTransactionData, Analytics } from '../../../domain/entities';
import { TransactionModel, ITransactionDocument } from '../models/TransactionModel';

export class TransactionRepository implements ITransactionRepository {
  async findAll(): Promise<Transaction[]> {
    const documents = await TransactionModel.find().sort({ createdAt: -1 });
    return documents.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Transaction | null> {
    const document = await TransactionModel.findById(id);
    return document ? this.mapToDomain(document) : null;
  }

  async create(data: CreateTransactionData): Promise<Transaction> {
    const document = new TransactionModel(data);
    const savedDocument = await document.save();
    return this.mapToDomain(savedDocument);
  }

  async getTotalRevenue(): Promise<number> {
    const result = await TransactionModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getUniqueCustomers(): Promise<number> {
    const result = await TransactionModel.aggregate([
      { $group: { _id: '$customerName' } },
      { $count: 'uniqueCustomers' }
    ]);
    return result.length > 0 ? result[0].uniqueCustomers : 0;
  }

  async getAnalytics(): Promise<Analytics> {
    const [totalRevenue, totalTransactions, uniqueCustomers] = await Promise.all([
      this.getTotalRevenue(),
      TransactionModel.countDocuments(),
      this.getUniqueCustomers()
    ]);

    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      totalTransactions,
      uniqueCustomers,
      averageTransactionValue
    };
  }

  private mapToDomain(document: ITransactionDocument): Transaction {
    return {
      id: document._id.toString(),
      customerName: document.customerName,
      amount: document.amount,
      createdAt: document.createdAt
    };
  }
} 