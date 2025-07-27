import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { TransactionFormData } from '@/types/transaction';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
  error?: string;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    customerName: '',
    amount: '',
    currency: 'USD'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Input
        id="customerName"
        name="customerName"
        type="text"
        label="Customer Name"
        required
        value={formData.customerName}
        onChange={handleChange}
        placeholder="Enter customer name"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          label="Amount"
          required
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
        />

        <Select
          id="currency"
          name="currency"
          label="Currency"
          value={formData.currency}
          onChange={handleChange}
          options={CURRENCIES}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Transaction'}
        </Button>
      </div>
    </form>
  );
}; 