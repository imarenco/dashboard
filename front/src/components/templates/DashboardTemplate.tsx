import React from 'react';
import { DashboardHeader } from '../organisms/DashboardHeader';
import { AnalyticsCards } from '../organisms/AnalyticsCards';
import { TransactionsTable } from '../organisms/TransactionsTable';
import { Analytics } from '@/types/analytics';
import { Transaction } from '@/types/transaction';

interface DashboardTemplateProps {
  analytics: Analytics;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  loading: boolean;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  analytics,
  transactions,
  filteredTransactions,
  searchTerm,
  setSearchTerm,
  loading
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <AnalyticsCards
          analytics={analytics}
          transactions={transactions}
        />
        
        <TransactionsTable
          transactions={filteredTransactions}
          loading={loading}
        />
      </div>
    </div>
  );
}; 