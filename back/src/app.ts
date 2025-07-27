import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import { Container, setupDependencies } from './config/container';
import { SocketManager } from './infrastructure/websocket/SocketManager';
import { createTransactionRoutes } from './presentation/routes/transactionRoutes';
import { TransactionController } from './presentation/controllers/TransactionController';
import { errorHandler } from './presentation/middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
const socketManager = new SocketManager(httpServer);

// Setup dependency injection
const container = new Container();
setupDependencies(container, socketManager);

// Routes
const transactionController = container.resolve<TransactionController>('transactionController');
app.use('/api', createTransactionRoutes(transactionController));

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    
    httpServer.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 