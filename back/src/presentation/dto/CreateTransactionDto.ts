import { CreateTransactionData } from '../../domain/entities/Transaction';

export class CreateTransactionDto {
  customerName: string;
  amount: number;
  currency: string;

  constructor(data: any) {
    this.customerName = data.customerName;
    this.amount = data.amount;
    this.currency = data.currency;
  }

  toDomain(): CreateTransactionData {
    return {
      customerName: this.customerName,
      amount: this.amount,
      currency: this.currency
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.customerName || this.customerName.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (!this.amount || this.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!this.currency || this.currency.trim().length === 0) {
      errors.push('Currency is required');
    }

    return errors;
  }
} 