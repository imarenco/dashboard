import { CreateTransactionData } from '../../domain/entities/Transaction';

export class CreateTransactionDto {
  customerName: string;
  amount: number;
  currency: string;

  constructor(data: any) {
    this.customerName = data.customerName;
    this.amount = data.amount;
    this.currency = data.currency || 'USD';
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

    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL'];
    if (!this.currency || !validCurrencies.includes(this.currency)) {
      errors.push('Currency must be one of: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL');
    }

    return errors;
  }
} 