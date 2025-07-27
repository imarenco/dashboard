import { TransactionService } from '../../domain/services/TransactionService';
import { Transaction } from '../../domain/entities/Transaction';

export class GetTransactionsUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }
} 