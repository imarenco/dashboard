import { TransactionService } from '../../domain/services/TransactionService';
import { Analytics } from '../../domain/entities/Analytics';

export class GetAnalyticsUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(): Promise<Analytics> {
    return this.transactionService.getAnalytics();
  }
} 