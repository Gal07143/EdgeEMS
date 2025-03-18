
// Types for the Energy Management System

export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type AlertType = 'warning' | 'critical' | 'info';
export type UserRole = 'admin' | 'operator' | 'viewer';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string | null;
  capacity: number; // in kW or kWh
  site_id?: string | null;
  firmware?: string | null;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  metrics?: Record<string, number> | null;
  last_updated: string;
  created_at: string;
  created_by?: string | null;
  installation_date?: string | null;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number; // in kW
  energy: number; // in kWh
  voltage?: number | null;
  current?: number | null;
  frequency?: number | null;
  temperature?: number | null;
  state_of_charge?: number | null; // for batteries, in percentage
  created_at: string;
}

export interface Alert {
  id: string;
  device_id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  createdAt: string;
  lastLogin?: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: ThemePreference;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout?: any;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  device_id: string;
  maintenance_type: string;
  description?: string | null;
  scheduled_date?: string | null;
  completed_date?: string | null;
  performed_by?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  parameters?: any;
  created_by: string;
  created_at: string;
  last_run_at?: string | null;
  schedule?: string | null;
  site_id?: string | null;
  is_template: boolean;
}

export interface ReportResult {
  id: string;
  report_id: string;
  result_data: any;
  created_at: string;
  file_url?: string | null;
}

export interface WeatherData {
  id: string;
  site_id: string;
  timestamp: string;
  temperature?: number | null;
  humidity?: number | null;
  wind_speed?: number | null;
  wind_direction?: number | null;
  cloud_cover?: number | null;
  precipitation?: number | null;
  source?: string | null;
  forecast: boolean;
}
