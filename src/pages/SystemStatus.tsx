import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SystemOverview from '@/components/system-status/SystemOverview';
import IntegrationStatus from '@/components/system-status/IntegrationStatus';
import PerformanceMetrics from '@/components/system-status/PerformanceMetrics';
import EventsList from '@/components/system-status/EventsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  AlertTriangle, 
  Settings, 
  Download, 
  HardDrive, 
  ArrowDownToLine, 
  Clock, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { SystemComponent, SystemEvent } from '@/services/systemStatusService';

// Mock system status data
const mockComponents: SystemComponent[] = [
  {
    id: '1',
    name: 'Database Server',
    status: 'healthy',
    type: 'infrastructure',
    lastUpdated: new Date().toISOString(),
    metrics: {
      uptime: '99.998%',
      responseTime: '45ms'
    }
  },
  {
    id: '2',
    name: 'MQTT Broker',
    status: 'healthy',
    type: 'service',
    lastUpdated: new Date().toISOString(),
    metrics: {
      connections: '23',
      messageRate: '250/min'
    }
  },
  {
    id: '3',
    name: 'Energy Prediction Engine',
    status: 'degraded',
    type: 'service',
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    metrics: {
      accuracy: '89%',
      latency: '1.2s'
    }
  },
  {
    id: '4',
    name: 'Modbus Interface',
    status: 'healthy',
    type: 'controller',
    lastUpdated: new Date().toISOString(),
    metrics: {
      devices: '12',
      pollRate: '5s'
    }
  },
  {
    id: '5',
    name: 'Storage Backup',
    status: 'maintenance',
    type: 'storage',
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    metrics: {
      spaceUsed: '68%',
      backupStatus: 'Scheduled'
    }
  },
  {
    id: '6',
    name: 'User Authentication',
    status: 'healthy',
    type: 'security',
    lastUpdated: new Date().toISOString(),
    metrics: {
      activeUsers: '8',
      failedLogins: '2'
    }
  }
];

// Mock system events data
const systemEvents: SystemEvent[] = [
  {
    id: "event-1",
    title: "Database Connection Issue",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: "warning",
    message: "Database connection latency exceeded threshold (150ms)",
    component_id: "db-primary",
    component_name: "Primary Database",
    acknowledged: false
  },
  {
    id: "event-2",
    title: "API Rate Limit Warning",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: "info",
    message: "External API rate limit at 80% of maximum",
    component_id: "api-service",
    component_name: "API Service",
    acknowledged: true
  },
  {
    id: "event-3",
    title: "Storage Space Critical",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: "critical",
    message: "Time series database storage below 10% free space",
    component_id: "tsdb",
    component_name: "Time Series Database",
    acknowledged: false
  }
];

const SystemStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [components, setComponents] = useState<SystemComponent[]>([]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setComponents(mockComponents);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    toast.info('Refreshing system status...');
    
    // Simulate refresh delay
    setTimeout(() => {
      setComponents(mockComponents);
      setIsLoading(false);
      toast.success('System status refreshed');
    }, 1500);
  };
  
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">System Status</h1>
            <p className="text-muted-foreground">
              Monitor the health and performance of all system components
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="default">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <SystemOverview components={components} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="mr-2 h-5 w-5 text-blue-500" />
                    Storage Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Database Storage</span>
                        <span className="text-sm font-medium">68% (34GB/50GB)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Telemetry Archive</span>
                        <span className="text-sm font-medium">42% (210GB/500GB)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Log Storage</span>
                        <span className="text-sm font-medium">91% (9.1GB/10GB)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowDownToLine className="mr-2 h-5 w-5 text-green-500" />
                    Latest Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">System update v2.4.0 installed</p>
                        <p className="text-sm text-muted-foreground">30 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Database maintenance completed</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Security patches applied</p>
                        <p className="text-sm text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-orange-500" />
                    Scheduled Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        Tomorrow
                      </div>
                      <div>
                        <p className="font-medium">Database optimization</p>
                        <p className="text-sm text-muted-foreground">02:00 - 03:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                        Jul 15
                      </div>
                      <div>
                        <p className="font-medium">API Gateway upgrade</p>
                        <p className="text-sm text-muted-foreground">01:00 - 02:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        Jul 20
                      </div>
                      <div>
                        <p className="font-medium">System backup</p>
                        <p className="text-sm text-muted-foreground">03:00 - 04:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <PerformanceMetrics 
              metrics={[
                {
                  id: 'cpu-usage',
                  name: 'CPU Usage',
                  value: 32,
                  unit: '%',
                  status: 'good',
                  trend: 'stable',
                  change: 0,
                  history: Array(24).fill(0).map((_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
                    value: 30 + Math.random() * 10
                  }))
                },
                {
                  id: 'memory-usage',
                  name: 'Memory Usage',
                  value: 58,
                  unit: '%',
                  status: 'good',
                  trend: 'up',
                  change: 5,
                  history: Array(24).fill(0).map((_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
                    value: 50 + Math.random() * 15
                  }))
                },
                {
                  id: 'disk-usage',
                  name: 'Disk Usage',
                  value: 72,
                  unit: '%',
                  status: 'warning',
                  trend: 'up',
                  change: 8,
                  threshold: 80,
                  history: Array(24).fill(0).map((_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
                    value: 65 + Math.random() * 15
                  }))
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="integrations" className="pt-4">
            <IntegrationStatus 
              integrations={[
                {
                  id: 'modbus-gateway',
                  name: 'Modbus Gateway',
                  type: 'modbus',
                  status: 'online',
                  latency: 48,
                  successRate: 99.8,
                  lastSync: new Date(Date.now() - 1200000).toISOString()
                },
                {
                  id: 'mqtt-broker',
                  name: 'MQTT Broker',
                  type: 'mqtt',
                  status: 'online',
                  latency: 32,
                  successRate: 100,
                  lastSync: new Date(Date.now() - 300000).toISOString()
                },
                {
                  id: 'rest-api',
                  name: 'Weather API',
                  type: 'api',
                  status: 'degraded',
                  latency: 257,
                  successRate: 95.5,
                  lastSync: new Date(Date.now() - 900000).toISOString()
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="events" className="pt-4">
            <EventsList 
              events={[
                {
                  id: 'evt-001',
                  title: 'System Update Available',
                  description: 'A new system update v3.5.2 is available for installation',
                  severity: 'info',
                  timestamp: new Date(Date.now() - 8600000).toISOString(),
                  source: 'system',
                  acknowledged: false
                },
                {
                  id: 'evt-002',
                  title: 'Database Backup Completed',
                  description: 'Scheduled database backup completed successfully',
                  severity: 'info',
                  timestamp: new Date(Date.now() - 36000000).toISOString(),
                  source: 'database',
                  acknowledged: true
                },
                {
                  id: 'evt-003',
                  title: 'High CPU Usage Detected',
                  description: 'System CPU usage exceeded 85% for more than 10 minutes',
                  severity: 'warning',
                  timestamp: new Date(Date.now() - 1800000).toISOString(),
                  source: 'monitoring',
                  acknowledged: false
                }
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
