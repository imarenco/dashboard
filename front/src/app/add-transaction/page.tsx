'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddTransactionTemplate } from '@/components/templates/AddTransactionTemplate';
import { api } from '@/lib/api';
import { TransactionFormData } from '@/types/transaction';
import { useTransactionContext } from '@/context/TransactionContext';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: TransactionFormData) => {
    setLoading(true);
    setError('');

    try {
      const transaction = await api.createTransaction(formData);
      addTransaction(transaction);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddTransactionTemplate
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
} 