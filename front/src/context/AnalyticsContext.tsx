'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AnalyticsContextType, AnalyticsState } from '@/types/analyticsContext';
import { Analytics } from '@/types/analytics';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

// Initial state
const initialState: AnalyticsState = {
  analytics: null,
  loading: false,
  error: null,
};

// Action types
type AnalyticsAction =
  | { type: 'SET_ANALYTICS'; payload: Analytics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer
function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Socket.IO integration
  const { onAnalyticsUpdate } = useSocket();

  useEffect(() => {
    onAnalyticsUpdate((analytics: Analytics) => {
      dispatch({ type: 'SET_ANALYTICS', payload: analytics });
    });
  }, [onAnalyticsUpdate]);

  // Actions
  const setAnalytics = (analytics: Analytics) => {
    dispatch({ type: 'SET_ANALYTICS', payload: analytics });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const analytics = await api.getAnalytics();
      setAnalytics(analytics);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const contextValue: AnalyticsContextType = {
    ...state,
    setAnalytics,
    setLoading,
    setError,
    fetchAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Custom hook to use the context
export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
} 