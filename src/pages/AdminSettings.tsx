import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Bell, Lock, Globe, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    siteName: "StudyMate AI",
    siteURL: "https://studymateai.com",
    supportEmail: "support@studymateai.com",
    maintenanceMode: false,
    maxUploadSize: 50,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
    dailyReports: true,
    backupEnabled: true,
    backupFrequency: "daily",
  });

  const [saved, setSaved] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<string | null>(null);
  const [bucketLoading, setBucketLoading] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/30 rounded text-green-700 dark:text-green-400 flex items-center gap-2"
          >
            <span>✓ Settings saved successfully!</span>
          </motion.div>
        )}

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </h2>

            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Storage</label>
                  <p className="text-sm text-muted-foreground mb-2">Ensure Supabase storage bucket <strong>study-materials</strong> exists for file uploads.</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        setBucketLoading(true);
                        setBucketStatus(null);
                        try {
                          const r = await fetch('/api/create-supabase-bucket', { method: 'POST' });
                          const j = await r.json();
                          if (r.ok && j.success) setBucketStatus('Bucket created or already exists');
                          else setBucketStatus('Failed: ' + JSON.stringify(j.error));
                        } catch (err: any) {
                          setBucketStatus('Error: ' + (err.message || String(err)));
                        } finally {
                          setBucketLoading(false);
                        }
                      }}
                      disabled={bucketLoading}
                    >
                      {bucketLoading ? 'Working...' : 'Ensure study-materials bucket'}
                    </Button>
                    <Button variant="outline" onClick={() => setBucketStatus(null)}>Clear</Button>
                  </div>
                  {bucketStatus && <p className="text-sm mt-2">{bucketStatus}</p>}
                </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                  placeholder="StudyMate AI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Site URL</label>
                <Input
                  value={settings.siteURL}
                  onChange={(e) => updateSetting("siteURL", e.target.value)}
                  placeholder="https://studymateai.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Support Email</label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateSetting("supportEmail", e.target.value)}
                  placeholder="support@studymateai.com"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Prevent users from accessing the platform
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSetting("maintenanceMode", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upload & Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Upload & Performance
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Upload File Size (MB)
                </label>
                <Input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => updateSetting("maxUploadSize", parseInt(e.target.value))}
                  min="1"
                  max="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                  min="5"
                  max="1440"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => updateSetting("smsNotifications", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Daily Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Get daily summary reports
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyReports}
                  onChange={(e) => updateSetting("dailyReports", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Backup & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Backup & Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Automated Backups</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup database and files
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.backupEnabled}
                  onChange={(e) => updateSetting("backupEnabled", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              {settings.backupEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => updateSetting("backupFrequency", e.target.value)}
                    className="w-full px-4 py-2 rounded border border-border bg-background"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-sm">
                  <span className="font-medium">Last Backup:</span> Feb 15, 2024 at 2:30 AM UTC
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Force Backup Now
                </Button>
                <Button variant="outline" className="flex-1">
                  View Backups
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-destructive/30 bg-destructive/5">
            <h2 className="text-xl font-bold mb-6 text-destructive">Danger Zone</h2>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-destructive border-destructive/30">
                Reset All Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive border-destructive/30">
                Clear Cache
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive border-destructive/30">
                Delete All User Data (Irreversible)
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
