import React from 'react';
import { Card } from '../atoms/Card';
import { AnalyticsCardProps } from '@/types/analytics';

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor
}) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}; 