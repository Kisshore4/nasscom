import { useState, useEffect } from 'react';

interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  sessionTimeout: number;
}

interface RedactionSettings {
  defaultRedactionLevel: string;
  defaultConsentLevel: string;
  autoDeleteOriginals: boolean;
  retentionPeriod: number;
}

interface NotificationSettings {
  processingComplete: boolean;
  systemAlerts: boolean;
  securityUpdates: boolean;
  weeklyReports: boolean;
}

interface SystemInfo {
  version: string;
  lastUpdate: string;
  serverStatus: string;
  storageUsed: string;
  storageTotal: string;
}

interface SettingsData {
  profile: ProfileSettings;
  security: SecuritySettings;
  redaction: RedactionSettings;
  notifications: NotificationSettings;
  system: SystemInfo;
}

export const useSettings = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const settingsData = await response.json();
      setData(settingsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<SettingsData>) => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:8000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();
      
      // Update local data
      if (data) {
        const newData = { ...data };
        Object.keys(updatedSettings).forEach(category => {
          if (category in newData) {
            newData[category as keyof SettingsData] = {
              ...newData[category as keyof SettingsData],
              ...updatedSettings[category as keyof SettingsData]
            } as any;
          }
        });
        setData(newData);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { 
    data, 
    loading, 
    error, 
    saving,
    refetch: fetchSettings, 
    updateSettings 
  };
};
