import React from 'react';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { TransactionForm } from '../molecules/TransactionForm';
import { TransactionFormData } from '@/types/transaction';

interface AddTransactionTemplateProps {
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
  error?: string;
}

export const AddTransactionTemplate: React.FC<AddTransactionTemplateProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add New Transaction
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new sales transaction
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg">
          <TransactionForm
            onSubmit={onSubmit}
            loading={loading}
            error={error}
          />
        </Card>
      </div>
    </div>
  );
}; 