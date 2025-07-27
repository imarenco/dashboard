import { CreateTransactionData } from '../../domain/entities/Transaction';

export class CreateTransactionDto {
  customerName: string;
  amount: number;

  constructor(data: any) {
    this.customerName = data.customerName;
    this.amount = data.amount;
  }

  toDomain(): CreateTransactionData {
    return {
      customerName: this.customerName,
      amount: this.amount
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

    return errors;
  }
} 