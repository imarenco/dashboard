import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ISocketManager } from '../../domain/services/ISocketManager';
import { Transaction, Analytics } from '../../domain/entities';

export class SocketManager implements ISocketManager {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  broadcastNewTransaction(transaction: Transaction): void {
    this.io.emit('newTransaction', transaction);
  }

  broadcastAnalyticsUpdate(analytics: Analytics): void {
    this.io.emit('analyticsUpdate', analytics);
  }
} 