export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

export interface CreateTransactionData {
  customerName: string;
  amount: number;
  currency: string;
} 