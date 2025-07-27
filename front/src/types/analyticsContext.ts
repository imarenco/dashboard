import { Analytics } from './analytics';

export interface AnalyticsState {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
}

export interface AnalyticsContextType extends AnalyticsState {
  // Actions
  setAnalytics: (analytics: Analytics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchAnalytics: () => Promise<void>;
} 