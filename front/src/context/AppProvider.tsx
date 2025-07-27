'use client';

import React from 'react';
import { TransactionProvider } from './TransactionContext';
import { AnalyticsProvider } from './AnalyticsContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <TransactionProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </TransactionProvider>
  );
} 