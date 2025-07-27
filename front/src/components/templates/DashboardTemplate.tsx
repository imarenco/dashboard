import React from 'react';
import { DashboardHeader } from '../organisms/DashboardHeader';
import { AnalyticsCards } from '../organisms/AnalyticsCards';
import { TransactionsTable } from '../organisms/TransactionsTable';
import { Analytics } from '@/types/analytics';
import { Transaction } from '@/types/transaction';

interface DashboardTemplateProps {
  analytics: Analytics | null;
  transactions: Transaction[];
  loading: {
    transactions: boolean;
    analytics: boolean;
  };
  error: {
    transactions: string | null;
    analytics: string | null;
  };
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  analytics,
  transactions,
  loading,
  error,
  searchTerm,
  onSearch
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          searchTerm={searchTerm}
          onSearch={onSearch}
        />
        
        <AnalyticsCards
          analytics={analytics}
          transactions={transactions}
        />
        
        <TransactionsTable
          transactions={transactions}
          loading={loading.transactions}
        />
      </div>
    </div>
  );
}; 