import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { TelemetryData as TelemetryDataType } from '@/types/telemetry';
// Import EnergyDevice and related types from energy.ts
import { EnergyDevice, DeviceStatus, DeviceType } from '@/types/energy';

// Export these types so they can be used elsewhere
export interface TelemetryData extends TelemetryDataType {}

// Remove the local Device interface definition - use EnergyDevice instead
/*
export interface Device {
  id: string;
  name: string;
  type: string; // This was the incompatible part
  protocol: DeviceProtocol;
  status: DeviceStatus;
  last_seen: string | null;
  mqtt_topic: string;
  http_endpoint?: string;
  ip_address?: string;
  port?: number;
  slave_id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
*/

// Keep DeviceStatus and DeviceProtocol if they are not already in energy.ts or if they differ
// Assuming DeviceStatus is defined in energy.ts and imported above
// export type DeviceStatus = 'online' | 'offline';
// Define DeviceProtocol locally as it's not exported from energy.ts
export type DeviceProtocol = 'mqtt' | 'http' | 'modbus';

export interface DeviceCommand {
  command: string;
  parameters?: Record<string, any>;
  timestamp?: string;
}

interface DeviceContextState {
  devices: EnergyDevice[]; // Use EnergyDevice here
  loading: boolean;
  error: string | null;
  selectedDevice: EnergyDevice | null; // Use EnergyDevice here
  deviceTelemetry: Record<string, TelemetryData[]>;
}

interface DeviceContextOperations {
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<EnergyDevice, 'id'>) => Promise<void>; // Use EnergyDevice here
  updateDevice: (id: string, updates: Partial<EnergyDevice>) => Promise<void>; // Use EnergyDevice here
  deleteDevice: (id: string) => Promise<void>;
  sendCommand: (deviceId: string, command: DeviceCommand) => Promise<void>;
  selectDevice: (device: EnergyDevice | null) => void; // Use EnergyDevice here
  fetchDeviceTelemetry: (deviceId: string) => Promise<void>;
}

// Define the context type
export type DeviceContextType = DeviceContextState & DeviceContextOperations;

// Create the context with a meaningful default value to help with type checking
const DeviceContext = createContext<DeviceContextType | null>(null);

// Create the provider component
export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<EnergyDevice[]>([]); // Use EnergyDevice here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<EnergyDevice | null>(null); // Use EnergyDevice here
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, TelemetryData[]>>({});

  // Fetch all devices
  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch data from an API
      // For now, let's simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update Mock data to conform to EnergyDevice and the imported DeviceType
      const mockDevices: EnergyDevice[] = [
        {
          id: '1',
          name: 'Temperature Sensor',
          type: 'other', // Use a valid DeviceType, assume 'sensor' is not defined, use 'other'
          // protocol: 'mqtt', // Assuming protocol is not part of EnergyDevice, remove if necessary
          status: 'online',
          last_seen: new Date().toISOString(),
          // mqtt_topic: 'devices/sensors/temp1', // Assuming not part of EnergyDevice
        },
        {
          id: '2',
          name: 'Smart Meter',
          type: 'meter', // Use a valid DeviceType
          // protocol: 'modbus', // Assuming not part of EnergyDevice
          status: 'offline',
          last_seen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          // mqtt_topic: '', // Assuming not part of EnergyDevice
          ip_address: '192.168.1.100',
          // port: 502, // Assuming not part of EnergyDevice
          // slave_id: 1, // Assuming not part of EnergyDevice
        },
      ];
      
      setDevices(mockDevices);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(errorMessage);
      toast.error('Failed to load devices', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies remain stable

  // Add a new device
  const addDevice = useCallback(async (device: Omit<EnergyDevice, 'id'>) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Generate a random ID
      const newDevice: EnergyDevice = {
        ...device,
        id: Math.random().toString(36).substr(2, 9),
        // created_at: new Date().toISOString(), // Assuming not part of EnergyDevice
        // updated_at: new Date().toISOString(), // Assuming not part of EnergyDevice
      };
      
      setDevices((prev) => [...prev, newDevice]);
      toast.success('Device added successfully', {
        description: `${newDevice.name} has been added to your devices.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add device';
      setError(errorMessage);
      toast.error('Failed to add device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies remain stable

  // Update a device
  const updateDevice = useCallback(async (id: string, updates: Partial<EnergyDevice>) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setDevices((prev) =>
        prev.map((device) =>
          device.id === id
            ? { ...device, ...updates /*, updated_at: new Date().toISOString() */ } // Assuming updated_at not in EnergyDevice
            : device
        )
      );
      
      // If the selected device is being updated, update it too
      if (selectedDevice && selectedDevice.id === id) {
        setSelectedDevice((prev) =>
          prev ? { ...prev, ...updates /*, updated_at: new Date().toISOString() */ } : null
        );
      }
      
      toast.success('Device updated successfully', {
        description: `Your device has been updated.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update device';
      setError(errorMessage);
      toast.error('Failed to update device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]); // Dependency simplified

  // Delete a device
  const deleteDevice = useCallback(async (id: string) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setDevices((prev) => prev.filter((device) => device.id !== id));
      
      // If the selected device is being deleted, clear it
      if (selectedDevice && selectedDevice.id === id) {
        setSelectedDevice(null);
      }
      
      toast.success('Device deleted successfully', {
        description: `The device has been removed.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete device';
      setError(errorMessage);
      toast.error('Failed to delete device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]); // Dependency simplified

  // Send a command to a device
  const sendCommand = useCallback(async (deviceId: string, command: DeviceCommand) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // In a real application, you would send the command to the device
      console.log(`Sending command to device ${deviceId}:`, command);
      
      toast.success('Command sent successfully', {
        description: `Command ${command.command} has been sent to the device.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send command';
      setError(errorMessage);
      toast.error('Failed to send command', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies remain stable

  // Fetch telemetry data for a device (Define BEFORE selectDevice)
  const fetchDeviceTelemetry = useCallback(async (deviceId: string) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Generate mock telemetry data conforming to TelemetryData interface
      const now = new Date();
      const mockTelemetry: TelemetryData[] = Array.from({ length: 24 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        // Example: Creating a single entry per timestamp with 'data' field
        return {
          id: Math.random().toString(36).substr(2, 9), // Mock ID
          device_id: deviceId,
          timestamp: timestamp,
          parameter: 'aggregated_metrics', // Indicate multiple values are in 'data'
          value: null, // Or potentially a primary value like power
          unit: null, // Or unit for the primary value
          data: { // Store the detailed metrics here
            temperature: 20 + Math.random() * 5,
            voltage: 220 + Math.random() * 10,
            current: 5 + Math.random() * 2,
            powerFactor: 0.8 + Math.random() * 0.2,
            frequency: 50 + Math.random() * 0.5,
            vibration: Math.random() * 0.5,
            noiseLevel: 30 + Math.random() * 10,
            errorCount: Math.floor(Math.random() * 5),
            uptime: 3600 * 24 * (1 + Math.random()),
            loadFactor: 0.6 + Math.random() * 0.3,
          }
        };
      });
      
      setDeviceTelemetry((prev) => ({
        ...prev,
        [deviceId]: mockTelemetry,
      }));
      
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch telemetry data';
      setError(errorMessage);
      toast.error('Failed to load telemetry data', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies remain stable

  // Select a device (Define AFTER fetchDeviceTelemetry)
  const selectDevice = useCallback((device: EnergyDevice | null) => { // Use EnergyDevice here
    setSelectedDevice(device);
    if (device) {
      fetchDeviceTelemetry(device.id); // Now fetchDeviceTelemetry is defined
    }
  }, [fetchDeviceTelemetry]); // Dependency updated

  // Load devices when the component mounts
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]); // Depend on stable fetchDevices

  // Provide the context value, memoized for stability
  const contextValue = useMemo(() => ({
    devices, // Now correctly typed as EnergyDevice[]
    loading,
    error,
    selectedDevice, // Now correctly typed as EnergyDevice | null
    deviceTelemetry,
    fetchDevices,
    addDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
    selectDevice,
    fetchDeviceTelemetry,
  }), [
    devices, selectedDevice, deviceTelemetry, // Data dependencies
    fetchDevices, addDevice, updateDevice, deleteDevice, sendCommand, selectDevice, fetchDeviceTelemetry // Stable function dependencies
  ]);

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook to use the device context
// Note: The hook name 'useDevices' might be slightly confusing now as it returns more than just devices.
// Consider renaming if clarity is needed, but keep as is for now.
export const useDevices = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === null) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};

export default DeviceContext;
