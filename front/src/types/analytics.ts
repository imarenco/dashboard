export interface Analytics {
  totalRevenue: number;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
} 