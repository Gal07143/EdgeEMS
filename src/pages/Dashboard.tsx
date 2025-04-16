import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevices } from '@/contexts/DeviceContext';
import { useMicrogrid } from '@/hooks/useMicrogrid';
import { toast } from 'react-hot-toast';
import {
  RefreshCw, 
  Sun, 
  BatteryCharging, 
  Activity, 
} from 'lucide-react';
import { SummaryGaugeCard } from '@/components/dashboard/SummaryGaugeCard';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { ConsumptionBarChart } from '@/components/dashboard/ConsumptionBarChart';
import { DeviceStatusList } from '@/components/dashboard/DeviceStatusList';
import { EnergyDevice } from '@/types/energy';

// Define types for chart data (can be moved to a types file later)
interface ChartDataPoint {
  name: string; pv?: number; load?: number; grid?: number; battery?: number;
}
interface BarChartDataPoint {
  name: string; consumption?: number; generation?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { devices, loading: devicesLoading, error: devicesError } = useDevices();
  const { 
    isLoading: microgridLoading, 
    error: microgridError, 
    refreshMetrics, 
    gridStatus,
    solarPower,
    batteryLevel,
  } = useMicrogrid();

  const isLoading = microgridLoading || devicesLoading;
  const error = microgridError || 
                (devicesError ? 
                  (typeof devicesError === 'object' && devicesError !== null && 'message' in devicesError ? (devicesError as Error).message : String(devicesError)) 
                  : null) ||
                null;

  const batteryStatus = useMemo(() => {
    const battery = devices?.find((d: EnergyDevice) => d.type === 'battery');
    if (battery?.status === 'online') {
      const hour = new Date().getHours();
      return hour % 2 === 0 ? 'charging' : 'discharging';
    } 
    return 'idle';
  }, [devices]);

  // --- State for Chart Data ---
  const [overviewChartData, setOverviewChartData] = useState<ChartDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataPoint[]>([]);

  // --- Simulate fetching/processing chart data --- 
  useEffect(() => {
    // In a real app, fetch data based on selected time range, etc.
    // Using static placeholder data for simulation:
    const overviewPlaceholder: ChartDataPoint[] = [
      { name: '00:00', pv: 0.1, load: 1.5, grid: 1.4, battery: 0 },
      { name: '03:00', pv: 0.0, load: 1.2, grid: 1.2, battery: 0 },
      { name: '06:00', pv: 0.5, load: 1.8, grid: 1.3, battery: -0.2 },
      { name: '09:00', pv: 4.2, load: 2.5, grid: 0.0, battery: -1.7 },
      { name: '12:00', pv: 8.5, load: 2.1, grid: -2.0, battery: -4.4 }, 
      { name: '15:00', pv: 6.1, load: 3.0, grid: -1.0, battery: -2.1 },
      { name: '18:00', pv: 1.5, load: 3.5, grid: 1.0, battery: 1.0 }, 
      { name: '21:00', pv: 0.2, load: 2.8, grid: 1.5, battery: 1.1 },
    ];
    const barPlaceholder: BarChartDataPoint[] = [
      { name: '00h', consumption: 1.5, generation: 0.1 },
      { name: '04h', consumption: 1.2, generation: 0.0 },
      { name: '08h', consumption: 2.0, generation: 3.5 },
      { name: '12h', consumption: 2.5, generation: 8.8 },
      { name: '16h', consumption: 3.1, generation: 5.5 },
      { name: '20h', consumption: 2.8, generation: 0.5 },
    ];
    
    setOverviewChartData(overviewPlaceholder);
    setBarChartData(barPlaceholder);

    // Dependency array is empty, so this runs once on mount.
    // Later, add dependencies if fetching depends on other state (e.g., date range).
  }, []); 

  const handleRefresh = async () => {
    try {
      await refreshMetrics();
      toast.success('Dashboard refreshed successfully');
    } catch (err) {
      toast.error(`Failed to refresh: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (isLoading) return <div className="p-6">Loading dashboard data...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div className="col-span-1 grid grid-rows-3 gap-4">
          <SummaryGaugeCard 
            title="Grid Status"
            icon={<Activity className="h-5 w-5" />}
            value={gridStatus}
            status={gridStatus}
            statusColor={gridStatus === 'connected' ? 'text-green-500' : 'text-red-500'}
          />
          <SummaryGaugeCard 
            title="Solar Power"
            icon={<Sun className="h-5 w-5" />}
            value={solarPower.toFixed(1)}
            unit="kW"
            description="Current Generation"
            gaugeLevel={(solarPower / 10) * 100}
          />
          <SummaryGaugeCard 
            title="Battery Level"
            icon={<BatteryCharging className="h-5 w-5" />}
            value={batteryLevel}
            unit="%"
            status={batteryStatus}
            statusColor={batteryStatus === 'charging' ? 'text-blue-500' : batteryStatus === 'discharging' ? 'text-yellow-500' : 'text-gray-500'}
            gaugeLevel={batteryLevel}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 h-[450px]">
           <OverviewChart data={overviewChartData}/> 
        </div>

        <div className="h-[300px]"> 
          <ConsumptionBarChart data={barChartData} /> 
        </div>

        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 h-[300px]">
           <DeviceStatusList devices={devices || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
