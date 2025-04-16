
import { Device } from '@/types/device';

export async function fetchDevices(): Promise<Device[]> {
  // In a real implementation, this would fetch from an API
  return [
    {
      id: '1',
      name: 'Solar Panel Array',
      type: 'solar',
      protocol: 'modbus',
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Battery Storage',
      type: 'battery',
      protocol: 'modbus',
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

export async function fetchDevice(id: string): Promise<Device> {
  // In a real implementation, this would fetch a specific device
  return {
    id,
    name: `Device ${id}`,
    type: 'solar',
    protocol: 'modbus',
    status: 'online',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function fetchDeviceMetrics(deviceId: string, metricType: string): Promise<any[]> {
  // In a real implementation, this would fetch specific metrics
  return Array(24).fill(0).map((_, i) => ({
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    value: Math.random() * 100,
    type: metricType,
    deviceId
  }));
}
