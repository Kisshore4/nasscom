import { useState, useEffect } from 'react';

interface RedactionHistoryItem {
  id: string;
  fileName: string;
  originalSize: string;
  redactedSize: string;
  redactionLevel: string;
  consentLevel: string;
  processedDate: string;
  status: string;
  processingTime: string;
  fileType: string;
}

interface RedactionHistoryData {
  history: RedactionHistoryItem[];
  total_count: number;
}

export const useRedactionHistory = () => {
  const [data, setData] = useState<RedactionHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/redaction-history');
      if (!response.ok) {
        throw new Error('Failed to fetch redaction history');
      }
      const historyData = await response.json();
      setData(historyData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching redaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchHistoryData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchHistoryData };
};
