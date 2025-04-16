import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useDevices } from '@/hooks/useDevices';
import { EnergyDevice } from '@/types/energy';
import { toast } from 'sonner';

/**
 * Types for microgrid metrics and status
 */
export type GridStatus = 'connected' | 'disconnected' | 'unknown';
export type DeviceType = 'battery' | 'grid' | 'solar' | 'wind' | 'load';

export interface MicrogridMetrics {
  isConnected: boolean;
  totalPower: number;
  batteryLevel: number;
  gridStatus: GridStatus;
  solarPower: number;
  windPower: number;
  loadPower: number;
  efficiency: number;
  lastUpdated: Date;
}

export interface MicrogridState extends MicrogridMetrics {
  isLoading: boolean;
  error: string | null;
}

export interface MicrogridContextType extends MicrogridState {
  refreshMetrics: () => Promise<void>;
  getDeviceMetrics: (type: DeviceType) => {
    count: number;
    totalPower: number;
    averageEfficiency: number;
  };
}

/**
 * Default values for microgrid context
 */
const defaultContext: MicrogridContextType = {
  isConnected: false,
  totalPower: 0,
  batteryLevel: 0,
  gridStatus: 'unknown',
  solarPower: 0,
  windPower: 0,
  loadPower: 0,
  efficiency: 0,
  lastUpdated: new Date(),
  isLoading: false,
  error: null,
  refreshMetrics: async () => {},
  getDeviceMetrics: () => ({ count: 0, totalPower: 0, averageEfficiency: 0 }),
};

export const MicrogridContext = createContext<MicrogridContextType>(defaultContext);

interface MicrogridProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
}

// Helper interface for telemetry data
interface TelemetryData {
  id?: string;
  device_id?: string;
  timestamp?: Date;
  parameter?: string;
  value?: number;
  unit?: string;
  data?: Record<string, any>;
}

/**
 * Provider component for microgrid-related data and state
 * Manages connection status, power metrics, and grid status
 */
const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ 
  children,
  refreshInterval = 30000, // 30 seconds default
}) => {
  const { devices, deviceTelemetry } = useDevices();
  const [state, setState] = useState<MicrogridState>({
    ...defaultContext,
    isLoading: true,
  });

  // Memoize the telemetry map generation to avoid recalculating it on every render
  // unless deviceTelemetry itself changes.
  const latestTelemetryMap = useMemo(() => {
    const map = new Map<string, TelemetryData>();
    if (!Array.isArray(deviceTelemetry)) {
      return map; // Return empty map if no telemetry
    }

    deviceTelemetry.forEach(telemetry => {
      if (telemetry.device_id) {
        const existing = map.get(telemetry.device_id);
        const currentTimestamp = telemetry.timestamp ? new Date(telemetry.timestamp).getTime() : 0;
        const existingTimestamp = existing?.timestamp ? new Date(existing.timestamp).getTime() : 0;

        // Store only the latest entry for each device_id
        if (!existing || currentTimestamp > existingTimestamp) {
          map.set(telemetry.device_id, telemetry);
        }
      }
    });
    return map;
  }, [deviceTelemetry]); // Only depends on the telemetry data array

  /**
   * Calculate all microgrid metrics based on device data
   */
  const calculateMetrics = useCallback(async () => {
    // Define helper function to get latest telemetry directly using the memoized map
    const getLatestTelemetryForDevice = (deviceId: string): TelemetryData | undefined => {
      return latestTelemetryMap.get(deviceId);
    };

    // Define helper function to calculate metrics for a specific device type
    const calculateMetricsForType = (type: DeviceType): { count: number; totalPower: number; averageEfficiency: number } => {
        const typeDevices = (devices || []).filter((device: EnergyDevice) => device.type === type && device.status === 'online');
        let totalPower = 0;
        let totalEfficiency = 0;

        typeDevices.forEach((device: EnergyDevice) => {
            const telemetry = getLatestTelemetryForDevice(device.id);
            totalPower += telemetry?.data?.power || 0;
            totalEfficiency += telemetry?.data?.efficiency || 0;
        });

        const averageEfficiency = typeDevices.length > 0 ? totalEfficiency / typeDevices.length : 0;

        return {
            count: typeDevices.length,
            totalPower,
            averageEfficiency,
        };
    };

    // --- Main Calculation Logic ---
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const connectedDevices = (devices || []).filter((device: EnergyDevice) => device.status === 'online');
      let totalPower = 0;
      let totalEfficiencySum = 0;

      connectedDevices.forEach((device: EnergyDevice) => {
        const telemetry = getLatestTelemetryForDevice(device.id);
        totalPower += telemetry?.data?.power || 0;
        totalEfficiencySum += telemetry?.data?.efficiency || 0;
      });

      const batteryMetrics = calculateMetricsForType('battery');
      const solarMetrics = calculateMetricsForType('solar');
      const windMetrics = calculateMetricsForType('wind');
      const loadMetrics = calculateMetricsForType('load');

      const gridDevices = connectedDevices.filter((device: EnergyDevice) => device.type === 'grid');
      const gridStatus = gridDevices.length > 0
        ? gridDevices.some(device => {
            const telemetry = getLatestTelemetryForDevice(device.id);
            return telemetry?.data?.gridConnected;
          })
          ? 'connected'
          : 'disconnected'
        : 'unknown';

      const overallEfficiency = connectedDevices.length > 0 ? 
        (totalEfficiencySum / connectedDevices.length) : 0;

      setState({
        isConnected: connectedDevices.length > 0,
        totalPower,
        batteryLevel: batteryMetrics.totalPower, // Assuming battery power represents level for now
        gridStatus,
        solarPower: solarMetrics.totalPower,
        windPower: windMetrics.totalPower,
        loadPower: loadMetrics.totalPower,
        efficiency: overallEfficiency,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate metrics';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
    // Depend directly on the data, not intermediate functions
  }, [devices, latestTelemetryMap]);

  /**
   * Get metrics for a specific device type
   * This function now needs to replicate the logic or use the main state
   * For simplicity, let's make it depend on the calculated state.
   * Note: This means getDeviceMetrics will only be up-to-date after calculateMetrics runs.
   */
  const getDeviceMetrics = useCallback((type: DeviceType) => {
    // Re-calculate on demand or pull from state? Pulling from state is simpler here.
    // We need to add these specific metrics to the state if we want to pull them directly.
    // For now, let's return placeholders or recalculate (less efficient).
    // Recalculating for simplicity, but ideally, memoize this if used frequently.
     const typeDevices = (devices || []).filter((device: EnergyDevice) => device.type === type && device.status === 'online');
     let totalPower = 0;
     let totalEfficiency = 0;

     typeDevices.forEach((device: EnergyDevice) => {
         const telemetry = latestTelemetryMap.get(device.id);
         totalPower += telemetry?.data?.power || 0;
         totalEfficiency += telemetry?.data?.efficiency || 0;
     });

     const averageEfficiency = typeDevices.length > 0 ? totalEfficiency / typeDevices.length : 0;

     return {
         count: typeDevices.length,
         totalPower,
         averageEfficiency,
     };

  }, [devices, latestTelemetryMap]);

  // Initial metrics calculation
  useEffect(() => {
    // console.log("Effect: Initial calculateMetrics");
    calculateMetrics();
    // Depend on the data used by calculateMetrics, not the function itself
  }, [devices, latestTelemetryMap]);

  // Set up refresh interval
  useEffect(() => {
    // console.log("Effect: Setting interval");
    const interval = setInterval(() => {
      // console.log("Interval: Firing calculateMetrics");
      calculateMetrics();
    }, refreshInterval);
    return () => {
      // console.log("Effect Cleanup: Clearing interval");
      clearInterval(interval);
    };
    // Depend on the data used by calculateMetrics and the interval itself
  }, [devices, latestTelemetryMap, refreshInterval]);

  return (
    <MicrogridContext.Provider value={{
      ...state,
      refreshMetrics: calculateMetrics,
      getDeviceMetrics,
    }}>
      {children} 
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
