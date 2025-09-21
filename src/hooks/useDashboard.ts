import { useState, useEffect } from 'react';

interface DashboardStats {
  documents_processed: number;
  active_redactions: number;
  protected_files: number;
  avg_processing_time: number;
}

interface ActivityItem {
  file: string;
  action: string;
  time: string;
  status: string;
}

interface SystemAlert {
  message: string;
  type: string;
  urgent: boolean;
  timestamp: string;
}

interface DashboardData {
  stats: DashboardStats;
  recent_activity: ActivityItem[];
  system_alerts: SystemAlert[];
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchDashboardData };
};
