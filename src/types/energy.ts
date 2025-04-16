export type DeviceType = 'solar' | 'battery' | 'inverter' | 'meter' | 'ev_charger' | 'load' | 'grid' | 'generator' | 'wind' | 'other';

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error' | 'maintenance';

// Interface for Modbus connection parameters
export interface ModbusConnectionConfig {
  host: string; // IP address or hostname
  port: number; // TCP port (e.g., 502) or Serial Port config
  unitId: number; // Modbus Slave/Unit ID
  // Add RTU specific settings if needed (baudRate, parity, etc.)
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity?: number;
  firmware?: string;
  description?: string;
  manufacturer?: string; // To match against register maps
  model?: string; // To match against register maps
  installation_date?: string;
  last_maintenance?: string;
  site_id?: string;
  // Removed ip_address, mac_address as they are specific to connection type
  last_seen?: string;
  serial_number?: string;
  // Optional Modbus configuration if device uses Modbus
  modbusConfig?: ModbusConnectionConfig; 
}

export interface ConsumptionData {
  timestamp: string;
  value: number;
  unit: string;
}

export interface DeviceState {
  power: number;
  energy: number;
  voltage: number;
  current: number;
  frequency: number;
  temperature: number;
  state_of_charge?: number;
  state_of_health?: number;
}

// Define the Site interface to avoid conflicts with site.ts
export interface SiteEnergy {
  id: string;
  name: string;
  address: string;
  timezone: string;
  geo_location?: {
    latitude: number;
    longitude: number;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Add these types for useForecast.ts
export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance: number;
}

export interface ForecastMetrics {
  totalConsumption: number;
  totalGeneration?: number;
  peakLoad: number;
  minLoad: number;
  averageProduction: number;
  selfConsumptionRate: number;
  gridDependenceRate: number;
  netEnergy?: number;
}

// Add EnergyReading interface for useLiveTelemetry
export interface EnergyReading {
  timestamp: string;
  value: number;
  type: string;
  deviceId: string;
  unit: string;
}

// Add SystemRecommendation for usePredictions
export interface SystemRecommendation {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  implemented: boolean;
  savings?: number;
  category?: string;
}

// Add EnergyMetrics for lib/api/energy.ts
export interface EnergyMetrics {
  consumption: number;
  production: number;
  grid_import: number;
  grid_export: number;
  self_consumption: number;
  peak_power: number;
  timestamp: string;
}

// Add ForecastData for lib/api/energy.ts
export interface ForecastData {
  timestamp: string;
  value: number;
  type: string;
  confidence: number;
}

// Import Site type from site.ts for compatibility
import { Site } from './site';
export type { Site };

// --- EV Charger Specific Types Start ---

// Simplified OCPP status examples based on common states
export type OCPPStatus = 'Available' | 'Preparing' | 'Charging' | 'SuspendedEV' | 'SuspendedEVSE' | 'Finishing' | 'Reserved' | 'Unavailable' | 'Faulted';

export interface ChargingSession {
  sessionId: string;
  vehicleId?: string; // Optional identifier for the connected vehicle
  startTime: string; // ISO 8601 timestamp
  endTime?: string; // ISO 8601 timestamp (if ended)
  energyConsumedKwh: number;
  currentState: 'Charging' | 'SuspendedEV' | 'SuspendedEVSE' | 'Finishing' | 'Idle' | 'Unavailable' | 'Faulted'; // Reflects session state, might overlap with OCPPStatus
}

// Extend the base EnergyDevice type for EV Chargers
export interface EVChargerDevice extends EnergyDevice {
  type: 'ev_charger'; // Override type to be specifically 'ev_charger'
  connectorType: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla' | 'Other';
  chargeLevel: 1 | 2 | 3; // Based on Level 1, 2, 3
  maxPowerKw: number; // Maximum charging power in kW
  currentSession?: ChargingSession;
  ocppStatus?: OCPPStatus; // Optional status based on OCPP
}

// --- EV Charger Specific Types End ---

// --- Advanced Battery/BMS Specific Types Start ---

export interface BatteryCellData {
  cellId: string | number;
  voltage?: number; // Volts
  temperature?: number; // Celsius
  balanceStatus?: 'Balancing' | 'Idle' | 'Error';
}

// Example BMS alert codes - specific codes depend heavily on the BMS manufacturer
export type BMSAlertCode = 
  | 'OVER_VOLTAGE' 
  | 'UNDER_VOLTAGE' 
  | 'OVER_TEMPERATURE' 
  | 'UNDER_TEMPERATURE'
  | 'OVER_CURRENT_CHARGE'
  | 'OVER_CURRENT_DISCHARGE'
  | 'CELL_IMBALANCE'
  | 'COMMUNICATION_ERROR'
  | 'INTERNAL_FAULT'
  | 'SHORT_CIRCUIT'
  | 'OTHER';

export interface BMSAlert {
  code: BMSAlertCode;
  description?: string;
  timestamp: string; // ISO 8601 timestamp when the alert occurred
  severity: 'critical' | 'warning' | 'info';
  cellId?: string | number; // Optional: if the alert relates to a specific cell
}

export interface BatteryBMSData {
  stateOfCharge: number; // Percentage (0-100)
  stateOfHealth?: number; // Percentage (0-100), represents battery degradation
  cycleCount?: number; // Number of charge/discharge cycles
  packVoltage?: number; // Volts
  packCurrent?: number; // Amps (positive for charge, negative for discharge)
  averageTemperature?: number; // Celsius
  minCellVoltage?: number; // Volts
  maxCellVoltage?: number; // Volts
  minCellTemperature?: number; // Celsius
  maxCellTemperature?: number; // Celsius
  balancingStatus?: 'Active' | 'Inactive' | 'Error';
  cellData?: BatteryCellData[]; // Optional array for individual cell details
  activeAlerts?: BMSAlert[]; // Array of current BMS alerts/faults
  communicationProtocol?: 'CANbus' | 'Modbus' | 'Other'; // Indicate the protocol used
}

// Extend the base EnergyDevice type for Batteries, including detailed BMS data
export interface BatteryDevice extends EnergyDevice {
  type: 'battery'; // Override type to be specifically 'battery'
  chemistry?: 'Li-ion' | 'LFP' | 'NMC' | 'Lead-Acid' | 'Flow' | 'Other'; // Battery chemistry
  nominalCapacityKwh: number; // Total energy capacity in kWh
  chargeRateKw?: number; // Optional: Maximum charge power in kW
  dischargeRateKw?: number; // Optional: Maximum discharge power in kW
  nominalVoltage?: number; // Nominal pack voltage
  bmsData?: BatteryBMSData; // Embed the detailed BMS data
}

// --- Advanced Battery/BMS Specific Types End ---

// --- Specialized Device Types --- 

// Example: Ensure BatteryDevice can hold Modbus config
export interface BatteryDevice extends EnergyDevice {
  type: 'battery';
  // ... (existing battery properties) ...
  // modbusConfig?: ModbusConnectionConfig; // Inherited from EnergyDevice
}

// Example: Add specialized type for PV Inverters (assuming they are distinct from general 'solar')
export interface PVInverterDevice extends EnergyDevice {
    type: 'inverter'; // Or maybe keep as 'solar' if that's the convention
    peakPowerKw?: number; // Max DC/AC power
    mpptCount?: number;
    // modbusConfig?: ModbusConnectionConfig; // Inherited
}

// Example: Add specialized type for Meters
export interface EnergyMeterDevice extends EnergyDevice {
    type: 'meter';
    phases?: 1 | 3;
    isGridMeter?: boolean; // To identify the main grid connection point
    // modbusConfig?: ModbusConnectionConfig; // Inherited
}
