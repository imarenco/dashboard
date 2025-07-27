import { Request, Response } from 'express';
import { CreateTransactionUseCase } from '../../application/useCases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '../../application/useCases/GetTransactionsUseCase';
import { GetAnalyticsUseCase } from '../../application/useCases/GetAnalyticsUseCase';
import { CreateTransactionDto } from '../dto/CreateTransactionDto';

export class TransactionController {
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase,
    private getTransactionsUseCase: GetTransactionsUseCase,
    private getAnalyticsUseCase: GetAnalyticsUseCase
  ) {}

  async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const dto = new CreateTransactionDto(req.body);
      const validationErrors = dto.validate();

      if (validationErrors.length > 0) {
        res.status(400).json({ errors: validationErrors });
        return;
      }

      const transaction = await this.createTransactionUseCase.execute(dto.toDomain());
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await this.getTransactionsUseCase.execute();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await this.getAnalyticsUseCase.execute();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
} 