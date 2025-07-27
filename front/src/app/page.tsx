'use client';

import { DashboardTemplate } from '@/components/templates/DashboardTemplate';
import { useTransactions } from '@/hooks/useTransactions';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const { transactions, filteredTransactions, searchTerm, setSearchTerm, loading } = useTransactions();
  const { analytics } = useAnalytics();

  return (
    <DashboardTemplate
      analytics={analytics}
      transactions={transactions}
      filteredTransactions={filteredTransactions}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
    />
  );
}
