export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  createdAt: Date;
}

export interface CreateTransactionData {
  customerName: string;
  amount: number;
} 