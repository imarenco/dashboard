export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface CreateTransactionData {
  customerName: string;
  amount: string;
  currency: string;
}

export interface TransactionFormData {
  customerName: string;
  amount: string;
  currency: string;
} 