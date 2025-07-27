import mongoose, { Document, Schema } from 'mongoose';

export interface ITransactionDocument extends Document {
  customerName: string;
  amount: number;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const TransactionModel = mongoose.model<ITransactionDocument>('Transaction', transactionSchema); 