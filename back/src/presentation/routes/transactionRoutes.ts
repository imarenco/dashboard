import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

export function createTransactionRoutes(transactionController: TransactionController): Router {
  const router = Router();

  router.post('/transactions', (req, res) => transactionController.createTransaction(req, res));
  router.get('/transactions', (req, res) => transactionController.getTransactions(req, res));
  router.get('/analytics', (req, res) => transactionController.getAnalytics(req, res));

  return router;
} 