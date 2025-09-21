import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DashboardStats {
  total_files: number;
  files_today: number;
  total_redactions: number;
  average_processing_time: number;
  last_updated: string;
}

interface ActivityItem {
  id: string;
  type: string;
  filename: string;
  status: string;
  timestamp: string;
  details?: any;
}

interface HistoryItem {
  id: string;
  filename: string;
  file_type: string;
  processing_time: number;
  status: string;
  timestamp: string;
  date: string;
}

interface RealtimeData {
  stats: DashboardStats;
  activities: ActivityItem[];
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const RealtimeContext = createContext<RealtimeData | null>(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats>({
    total_files: 0,
    files_today: 0,
    total_redactions: 0,
    average_processing_time: 0,
    last_updated: new Date().toISOString()
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      
      setStats(data.stats);
      setActivities(data.recent_activity || []);
      setHistory(data.redaction_history || []);
      setError(null);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    try {
      const wsUrl = apiUrl.replace('http', 'ws') + '/ws';
      const websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setError(null);
      };
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'redaction_completed') {
            // Update stats
            if (data.data.stats) {
              setStats(data.data.stats);
            }
            
            // Add new history entry
            if (data.data.history_entry) {
              setHistory(prev => [data.data.history_entry, ...prev]);
            }
            
            // Add new activity
            if (data.data.activity) {
              setActivities(prev => [data.data.activity, ...prev.slice(0, 19)]);
            }
          } else if (data.type === 'activity_update') {
            setActivities(prev => [data.data, ...prev.slice(0, 19)]);
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      };
      
      websocket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setWs(websocket);
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setTimeout(connectWebSocket, 5000);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();
    
    // Connect WebSocket for real-time updates
    connectWebSocket();
    
    // Cleanup WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchDashboardData();
  };

  const value: RealtimeData = {
    stats,
    activities,
    history,
    loading,
    error,
    refreshData
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};