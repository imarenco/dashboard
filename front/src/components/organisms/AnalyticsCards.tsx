import React from 'react';
import { AnalyticsCard } from '../molecules/AnalyticsCard';
import { Analytics } from '@/types/analytics';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/lib/format';

interface AnalyticsCardsProps {
  analytics: Analytics | null;
  transactions: Transaction[];
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  analytics,
  transactions
}) => {
  const uniqueCustomers = new Set(transactions.map(t => t.customerName)).size;
  const baseCurrency = analytics?.baseCurrency || 'USD';

  const cards = [
    {
      title: 'Total Revenue',
      value: analytics ? formatCurrency(analytics.totalRevenue, baseCurrency) : formatCurrency(0, baseCurrency),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Transactions',
      value: analytics ? analytics.totalTransactions : transactions.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Unique Customers',
      value: analytics ? analytics.uniqueCustomers : uniqueCustomers,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Average Transaction',
      value: analytics ? formatCurrency(analytics.averageTransactionValue, baseCurrency) : formatCurrency(0, baseCurrency),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <AnalyticsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            bgColor={card.bgColor}
            iconColor={card.iconColor}
          />
        ))}
      </div>
      {analytics && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> All revenue figures are converted to {baseCurrency} using current exchange rates for consistent reporting.
          </p>
        </div>
      )}
    </div>
  );
}; 