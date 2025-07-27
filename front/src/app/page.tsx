'use client';

import { DashboardTemplate } from '@/components/templates/DashboardTemplate';
import { useTransactionContext } from '@/context/TransactionContext';
import { useAnalyticsContext } from '@/context/AnalyticsContext';

export default function DashboardPage() {
  const { 
    filteredTransactions, 
    loading: transactionsLoading, 
    error: transactionsError,
    searchTerm,
    setSearchTerm,
    searchTransactions
  } = useTransactionContext();

  const { 
    analytics, 
    loading: analyticsLoading, 
    error: analyticsError 
  } = useAnalyticsContext();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchTransactions(term);
  };

  return (
    <DashboardTemplate
      transactions={filteredTransactions}
      analytics={analytics}
      loading={{
        transactions: transactionsLoading,
        analytics: analyticsLoading
      }}
      error={{
        transactions: transactionsError,
        analytics: analyticsError
      }}
      searchTerm={searchTerm}
      onSearch={handleSearch}
    />
  );
}
