export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  createdAt: string;
}

export interface CreateTransactionData {
  customerName: string;
  amount: string;
}

export interface TransactionFormData {
  customerName: string;
  amount: string;
} 