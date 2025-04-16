
import { Device } from '@/types/device';
import { EnergyDevice } from '@/types/energy';

export const getDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  try {
    // In a real implementation, this would fetch a device from an API
    return {
      id,
      name: `Device ${id}`,
      type: 'solar',
      status: 'online',
      capacity: 10000,
      firmware: 'v1.0.0',
      description: 'Solar panel array'
    };
  } catch (error) {
    console.error('Error fetching device:', error);
    return null;
  }
};

export const getAllDevices = async (): Promise<EnergyDevice[]> => {
  try {
    // In a real implementation, this would fetch devices from an API
    return [
      {
        id: '1',
        name: 'Solar Panel Array',
        type: 'solar',
        status: 'online',
        capacity: 10000,
        firmware: 'v1.0.0',
        description: 'Solar panel array'
      },
      {
        id: '2',
        name: 'Battery Storage',
        type: 'battery',
        status: 'online',
        capacity: 5000,
        firmware: 'v1.0.0',
        description: 'Battery storage system'
      }
    ];
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};
