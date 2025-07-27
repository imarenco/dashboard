export interface Transaction {
  _id: string;
  customerName: string;
  amount: number;
  currency: string;
  date: string;
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