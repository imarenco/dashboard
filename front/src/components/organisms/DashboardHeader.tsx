import React from 'react';
import Link from 'next/link';
import { SearchBar } from '../molecules/SearchBar';
import { Button } from '../atoms/Button';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm,
  onSearch
}) => {
  return (
    <div className="mb-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time transaction monitoring and analytics</p>
      </div>

      {/* Search and Add Transaction */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          value={searchTerm}
          onChange={onSearch}
          placeholder="Search by customer name..."
        />
        <Link href="/add-transaction">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Transaction
          </Button>
        </Link>
      </div>
    </div>
  );
}; 