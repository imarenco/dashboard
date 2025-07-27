import { TransactionRepository } from '../infrastructure/database/repositories/TransactionRepository';
import { SocketManager } from '../infrastructure/websocket/SocketManager';
import { TransactionService } from '../domain/services/TransactionService';
import { CurrencyConversionServiceImpl } from '../domain/services/CurrencyConversionService';
import { CreateTransactionUseCase } from '../application/useCases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '../application/useCases/GetTransactionsUseCase';
import { GetAnalyticsUseCase } from '../application/useCases/GetAnalyticsUseCase';
import { TransactionController } from '../presentation/controllers/TransactionController';

export class Container {
  private dependencies: Map<string, any> = new Map();

  register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }

  resolve<T>(key: string): T {
    const instance = this.dependencies.get(key);
    if (!instance) {
      throw new Error(`Dependency ${key} not found`);
    }
    return instance;
  }
}

export function setupDependencies(container: Container, socketManager: SocketManager): void {
  // Infrastructure
  const transactionRepository = new TransactionRepository();
  container.register('transactionRepository', transactionRepository);
  container.register('socketManager', socketManager);

  // Domain Services
  const currencyConversionService = new CurrencyConversionServiceImpl();
  container.register('currencyConversionService', currencyConversionService);

  const transactionService = new TransactionService(
    transactionRepository, 
    socketManager, 
    currencyConversionService
  );
  container.register('transactionService', transactionService);

  // Application
  const createTransactionUseCase = new CreateTransactionUseCase(transactionService);
  const getTransactionsUseCase = new GetTransactionsUseCase(transactionService);
  const getAnalyticsUseCase = new GetAnalyticsUseCase(transactionService);
  
  container.register('createTransactionUseCase', createTransactionUseCase);
  container.register('getTransactionsUseCase', getTransactionsUseCase);
  container.register('getAnalyticsUseCase', getAnalyticsUseCase);

  // Presentation
  const transactionController = new TransactionController(
    createTransactionUseCase,
    getTransactionsUseCase,
    getAnalyticsUseCase
  );
  container.register('transactionController', transactionController);
} 