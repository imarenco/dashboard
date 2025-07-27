import { Transaction, Analytics } from '../entities';

export interface ISocketManager {
  broadcastNewTransaction(transaction: Transaction): void;
  broadcastAnalyticsUpdate(analytics: Analytics): void;
} 