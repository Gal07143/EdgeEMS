import React, { useState } from 'react';
import { Activity, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSite } from '@/contexts/SiteContext';
import { useAlertSubscription } from '@/hooks/useAlertSubscription';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  siteName: string;
}

const DashboardHeader = ({ siteName }: DashboardHeaderProps) => {
  const [newAlert, setNewAlert] = useState(false);

  // 👇 Enable realtime toast and badge
  useAlertSubscription((alert) => {
    toast.warning(`🔔 ${alert.title}`, {
      description: alert.message,
    });
    setNewAlert(true);

    // Optional: auto-hide indicator after 10 seconds
    setTimeout(() => setNewAlert(false), 10000);
  });

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{siteName} Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and control of your energy system
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-muted-foreground" />
            {newAlert && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>

          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            <span className="font-medium">System Status: Operational</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;
