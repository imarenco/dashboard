export interface Analytics {
  totalRevenue: number;
  totalTransactions: number;
  uniqueCustomers: number;
  averageTransactionValue: number;
  baseCurrency: string;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
} 