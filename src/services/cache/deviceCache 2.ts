
import { Device } from '@/types/device';

interface DeviceCache {
  devices: Device[] | null;
  devicesTimestamp: number | null;
  deviceDetails: Record<string, Device>;
  deviceDetailsTimestamp: Record<string, number>;
  deviceMetrics: Record<string, Record<string, any[]>>;
  deviceMetricsTimestamp: Record<string, Record<string, number>>;
}

// Initialize the cache
const cache: DeviceCache = {
  devices: null,
  devicesTimestamp: null,
  deviceDetails: {},
  deviceDetailsTimestamp: {},
  deviceMetrics: {},
  deviceMetricsTimestamp: {}
};

// Cache expiration in milliseconds (10 minutes)
const CACHE_EXPIRY = 10 * 60 * 1000;

export const deviceCache = {
  setDevices(devices: Device[]): void {
    cache.devices = devices;
    cache.devicesTimestamp = Date.now();
  },

  getDevices(): Device[] | null {
    if (
      !cache.devices ||
      !cache.devicesTimestamp ||
      Date.now() - cache.devicesTimestamp > CACHE_EXPIRY
    ) {
      return null;
    }
    return cache.devices;
  },

  setDevice(device: Device): void {
    cache.deviceDetails[device.id] = device;
    cache.deviceDetailsTimestamp[device.id] = Date.now();
    
    // If devices are already in cache, update the corresponding device there too
    if (cache.devices) {
      const index = cache.devices.findIndex(d => d.id === device.id);
      if (index >= 0) {
        cache.devices[index] = device;
      } else {
        cache.devices.push(device);
      }
    }
  },

  getDevice(id: string): Device | null {
    if (
      !cache.deviceDetails[id] ||
      !cache.deviceDetailsTimestamp[id] ||
      Date.now() - cache.deviceDetailsTimestamp[id] > CACHE_EXPIRY
    ) {
      return null;
    }
    return cache.deviceDetails[id];
  },

  setDeviceMetrics(deviceId: string, metricType: string, metrics: any[]): void {
    if (!cache.deviceMetrics[deviceId]) {
      cache.deviceMetrics[deviceId] = {};
      cache.deviceMetricsTimestamp[deviceId] = {};
    }
    
    cache.deviceMetrics[deviceId][metricType] = metrics;
    cache.deviceMetricsTimestamp[deviceId][metricType] = Date.now();
  },

  getDeviceMetrics(deviceId: string, metricType: string): any[] | null {
    if (
      !cache.deviceMetrics[deviceId] ||
      !cache.deviceMetrics[deviceId][metricType] ||
      !cache.deviceMetricsTimestamp[deviceId] ||
      !cache.deviceMetricsTimestamp[deviceId][metricType] ||
      Date.now() - cache.deviceMetricsTimestamp[deviceId][metricType] > CACHE_EXPIRY
    ) {
      return null;
    }
    return cache.deviceMetrics[deviceId][metricType];
  },

  invalidateDevice(id: string): void {
    delete cache.deviceDetails[id];
    delete cache.deviceDetailsTimestamp[id];
    delete cache.deviceMetrics[id];
    delete cache.deviceMetricsTimestamp[id];
    
    // If devices are in cache, remove the corresponding device
    if (cache.devices) {
      cache.devices = cache.devices.filter(d => d.id !== id);
    }
  },

  invalidateDevices(): void {
    cache.devices = null;
    cache.devicesTimestamp = null;
  },

  invalidateDeviceMetrics(deviceId: string, metricType?: string): void {
    if (!metricType) {
      delete cache.deviceMetrics[deviceId];
      delete cache.deviceMetricsTimestamp[deviceId];
    } else if (
      cache.deviceMetrics[deviceId] &&
      cache.deviceMetricsTimestamp[deviceId]
    ) {
      delete cache.deviceMetrics[deviceId][metricType];
      delete cache.deviceMetricsTimestamp[deviceId][metricType];
    }
  },

  getCacheStats(): { 
    devices: boolean; 
    deviceCount: number; 
    detailsCount: number; 
    metricsCount: number 
  } {
    return {
      devices: !!cache.devices,
      deviceCount: cache.devices?.length || 0,
      detailsCount: Object.keys(cache.deviceDetails).length,
      metricsCount: Object.keys(cache.deviceMetrics).reduce((count, deviceId) => {
        return count + Object.keys(cache.deviceMetrics[deviceId]).length;
      }, 0)
    };
  }
};
