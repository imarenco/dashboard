import { useState, useEffect } from "react";
import { Analytics } from "@/types/analytics";
import { api } from "@/lib/api";
import { useSocket } from "./useSocket";

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    totalTransactions: 0,
    uniqueCustomers: 0,
    averageTransactionValue: 0,
  });
  const { onAnalyticsUpdate, offAnalyticsUpdate } = useSocket();

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    onAnalyticsUpdate((analyticsData: Analytics) => {
      setAnalytics(analyticsData);
    });

    return () => {
      offAnalyticsUpdate();
    };
  }, [onAnalyticsUpdate, offAnalyticsUpdate]);

  return {
    analytics,
    refetch: fetchAnalytics,
  };
};
