import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Bell, Database, Key, Monitor, RefreshCw, AlertTriangle, Save } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { data, loading, error, saving, refetch, updateSettings } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(data);

  // Update local settings when data changes
  React.useEffect(() => {
    if (data) {
      setLocalSettings(data);
    }
  }, [data]);

  const handleSave = async () => {
    if (!localSettings) return;

    try {
      await updateSettings(localSettings);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const updateLocalSetting = (category: string, key: string, value: any) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      [category]: {
        ...localSettings[category as keyof typeof localSettings],
        [key]: value
      }
    } as any);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-lg text-red-600 mb-4">Error loading settings</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account, security, and system preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={localSettings?.profile?.firstName || ''} 
                    onChange={(e) => updateLocalSetting('profile', 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={localSettings?.profile?.lastName || ''} 
                    onChange={(e) => updateLocalSetting('profile', 'lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={localSettings?.profile?.email || ''} 
                  onChange={(e) => updateLocalSetting('profile', 'email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title" 
                  value={localSettings?.profile?.title || ''} 
                  onChange={(e) => updateLocalSetting('profile', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={localSettings?.profile?.department || 'admin'} 
                  onValueChange={(value) => updateLocalSetting('profile', 'department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="it">IT & Security</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={localSettings?.security?.twoFactorEnabled ? "default" : "secondary"} 
                         className={localSettings?.security?.twoFactorEnabled ? "bg-success" : ""}>
                    {localSettings?.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch 
                    checked={localSettings?.security?.twoFactorEnabled || false}
                    onCheckedChange={(checked) => updateLocalSetting('security', 'twoFactorEnabled', checked)}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications for Logins</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                </div>
                <Switch 
                  checked={localSettings?.security?.emailNotifications || false}
                  onCheckedChange={(checked) => updateLocalSetting('security', 'emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
                <Select 
                  value={localSettings?.security?.sessionTimeout?.toString() || '30'}
                  onValueChange={(value) => updateLocalSetting('security', 'sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Redaction Preferences */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Redaction Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Redaction Level</Label>
                <Select 
                  value={localSettings?.redaction?.defaultRedactionLevel || 'full-pii'}
                  onValueChange={(value) => updateLocalSetting('redaction', 'defaultRedactionLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-pii">Full PII</SelectItem>
                    <SelectItem value="partial-pii">Partial PII</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Consent Level</Label>
                <Select 
                  value={localSettings?.redaction?.defaultConsentLevel || 'extended'}
                  onValueChange={(value) => updateLocalSetting('redaction', 'defaultConsentLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="extended">Extended</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-delete original files</Label>
                  <p className="text-sm text-muted-foreground">Remove original files after successful redaction</p>
                </div>
                <Switch 
                  checked={localSettings?.redaction?.autoDeleteOriginals || false}
                  onCheckedChange={(checked) => updateLocalSetting('redaction', 'autoDeleteOriginals', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Retention period for redacted files</Label>
                  <p className="text-sm text-muted-foreground">How long to keep processed documents</p>
                </div>
                <Select 
                  value={localSettings?.redaction?.retentionPeriod?.toString() || '90'}
                  onValueChange={(value) => updateLocalSetting('redaction', 'retentionPeriod', parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Processing complete</Label>
                <Switch 
                  checked={localSettings?.notifications?.processingComplete || false}
                  onCheckedChange={(checked) => updateLocalSetting('notifications', 'processingComplete', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">System alerts</Label>
                <Switch 
                  checked={localSettings?.notifications?.systemAlerts || false}
                  onCheckedChange={(checked) => updateLocalSetting('notifications', 'systemAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Security updates</Label>
                <Switch 
                  checked={localSettings?.notifications?.securityUpdates || false}
                  onCheckedChange={(checked) => updateLocalSetting('notifications', 'securityUpdates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Weekly reports</Label>
                <Switch 
                  checked={localSettings?.notifications?.weeklyReports || false}
                  onCheckedChange={(checked) => updateLocalSetting('notifications', 'weeklyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-mono">{localSettings?.system?.version || 'v2.1.4'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Update</span>
                <span className="text-sm">{localSettings?.system?.lastUpdate || 'Jan 12, 2024'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Server Status</span>
                <Badge className={localSettings?.system?.serverStatus === 'online' ? "bg-success text-success-foreground" : "bg-destructive"}>
                  {localSettings?.system?.serverStatus === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm">{localSettings?.system?.storageUsed || '0 MB'} / {localSettings?.system?.storageTotal || '100 GB'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Export Settings
              </Button>
              <Button className="w-full" variant="outline">
                Download Audit Log
              </Button>
              <Button className="w-full" variant="outline">
                Contact Support
              </Button>
              <Button className="w-full" variant="destructive">
                Reset All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button variant="outline" onClick={() => setLocalSettings(data)}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;