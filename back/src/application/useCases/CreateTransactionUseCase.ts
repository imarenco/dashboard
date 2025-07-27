import { TransactionService } from '../../domain/services/TransactionService';
import { CreateTransactionData, Transaction } from '../../domain/entities/Transaction';

export class CreateTransactionUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(data: CreateTransactionData): Promise<Transaction> {
    return this.transactionService.createTransaction(data);
  }
} 