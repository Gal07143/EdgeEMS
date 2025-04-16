// src/config/registerMaps.ts

// --- Type Definitions (can be shared from a types file if needed) ---

export type DeviceMapType = 'bms' | 'pv_inverter' | 'meter' | 'ev_charger'; // Extend as needed

export interface RegisterDefinition {
  // Standardized internal name for the data point (e.g., 'voltage', 'soc')
  name: string; 
  // Modbus register address
  register: number; 
  // Holding or Input register
  type: 'holding' | 'input'; 
  // Data type on the device
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'boolean' | 'string'; 
  // Optional: unit of measurement (e.g., 'V', '%', 'kWh')
  unit?: string; 
  // Optional: Scaling factor to apply (value = register_value * scale)
  scale?: number; 
   // Optional: Register count (for multi-register values like float32 or strings)
  length?: number; // Defaults to 1 or based on dataType
  // Optional: Indicates if the register is writable
  writable?: boolean; 
  // Optional: Human-readable description
  description?: string; 
}

export interface DeviceRegisterMap {
  // Used for quick lookup (e.g., 'bms', 'pv_inverter')
  deviceType: DeviceMapType; 
  // Manufacturer name (case-insensitive matching recommended)
  manufacturer: string; 
  // Model identifier (case-insensitive matching recommended)
  model: string; 
  // Array of register definitions for this specific device model
  registers: RegisterDefinition[]; 
}

// --- Registry Storage --- 

// Store maps in a way that allows lookup by manufacturer/model
// Key could be `${manufacturer.toLowerCase()}:${model.toLowerCase()}`
const registerMapRegistry = new Map<string, DeviceRegisterMap>();

// --- Example Maps --- 

const genericPVRegisterMap: DeviceRegisterMap = {
  deviceType: 'pv_inverter',
  manufacturer: 'GenericSolarTech', // Example Manufacturer
  model: 'INV-5000', // Example Model
  registers: [
    { name: 'ac_voltage', register: 3000, type: 'input', dataType: 'float32', length: 2, unit: 'V', scale: 1, description: 'AC Voltage Phase A/L1' },
    { name: 'ac_current', register: 3002, type: 'input', dataType: 'float32', length: 2, unit: 'A', scale: 1, description: 'AC Current Phase A/L1' },
    { name: 'ac_power', register: 3004, type: 'input', dataType: 'float32', length: 2, unit: 'W', scale: 1, description: 'AC Active Power Total' },
    { name: 'frequency', register: 3006, type: 'input', dataType: 'float32', length: 2, unit: 'Hz', scale: 1, description: 'Grid Frequency' },
    { name: 'dc_voltage_mppt1', register: 3010, type: 'input', dataType: 'float32', length: 2, unit: 'V', scale: 1, description: 'DC Voltage MPPT 1' },
    { name: 'dc_current_mppt1', register: 3012, type: 'input', dataType: 'float32', length: 2, unit: 'A', scale: 1, description: 'DC Current MPPT 1' },
    { name: 'temperature', register: 3020, type: 'input', dataType: 'int16', length: 1, unit: '°C', scale: 0.1, description: 'Inverter Internal Temp' },
    { name: 'status', register: 3030, type: 'input', dataType: 'uint16', length: 1, description: 'Inverter Status Code' }
    // Add writable registers if applicable, e.g., power curtailment
    // { name: 'power_limit_percent', register: 4100, type: 'holding', dataType: 'uint16', length: 1, unit: '%', scale: 1, writable: true, description: 'Set Active Power Limit (%)' }
  ]
};

const genericBMSRegisterMap: DeviceRegisterMap = {
  deviceType: 'bms',
  manufacturer: 'SafeCell', // Example Manufacturer
  model: 'BMS-X96', // Example Model
  registers: [
    { name: 'voltage', register: 4000, type: 'holding', dataType: 'float32', length: 2, unit: 'V', scale: 1, description: 'Total Pack Voltage' },
    { name: 'current', register: 4002, type: 'holding', dataType: 'float32', length: 2, unit: 'A', scale: 1, description: 'Pack Current (Charge>0, Discharge<0)' },
    { name: 'soc', register: 4004, type: 'holding', dataType: 'float32', length: 2, unit: '%', scale: 1, description: 'State of Charge' },
    { name: 'soh', register: 4006, type: 'holding', dataType: 'float32', length: 2, unit: '%', scale: 1, description: 'State of Health' },
    { name: 'temperature_avg', register: 4008, type: 'holding', dataType: 'int16', length: 1, unit: '°C', scale: 0.1, description: 'Average Battery Temperature' },
    { name: 'cycle_count', register: 4010, type: 'holding', dataType: 'uint16', length: 1, description: 'Charge/Discharge Cycles' },
    { name: 'status', register: 4012, type: 'holding', dataType: 'uint16', length: 1, description: 'BMS Status/Fault Code' },
    // Writable registers for control
    { name: 'charge_limit_kw', register: 4100, type: 'holding', dataType: 'float32', length: 2, unit: 'kW', scale: 1, writable: true, description: 'Set Max Charge Power' },
    { name: 'discharge_limit_kw', register: 4102, type: 'holding', dataType: 'float32', length: 2, unit: 'kW', scale: 1, writable: true, description: 'Set Max Discharge Power' }
  ]
};

const genericMeterRegisterMap: DeviceRegisterMap = {
  deviceType: 'meter',
  manufacturer: 'GridEye', // Example Manufacturer
  model: 'MTR-3P', // Example Model
  registers: [
      { name: 'voltage_l1', register: 3000, type: 'input', dataType: 'float32', length: 2, unit: 'V' },
      { name: 'voltage_l2', register: 3002, type: 'input', dataType: 'float32', length: 2, unit: 'V' },
      { name: 'voltage_l3', register: 3004, type: 'input', dataType: 'float32', length: 2, unit: 'V' },
      { name: 'current_l1', register: 3010, type: 'input', dataType: 'float32', length: 2, unit: 'A' },
      { name: 'current_l2', register: 3012, type: 'input', dataType: 'float32', length: 2, unit: 'A' },
      { name: 'current_l3', register: 3014, type: 'input', dataType: 'float32', length: 2, unit: 'A' },
      { name: 'active_power_total', register: 3020, type: 'input', dataType: 'float32', length: 2, unit: 'W' },
      { name: 'reactive_power_total', register: 3022, type: 'input', dataType: 'float32', length: 2, unit: 'VAR' },
      { name: 'frequency', register: 3030, type: 'input', dataType: 'float32', length: 2, unit: 'Hz' },
      { name: 'total_import_kwh', register: 3100, type: 'input', dataType: 'uint32', length: 2, unit: 'kWh', scale: 0.001 }, // Example: Wh scaled to kWh
      { name: 'total_export_kwh', register: 3102, type: 'input', dataType: 'uint32', length: 2, unit: 'kWh', scale: 0.001 },
  ]
};

// --- Helper Functions --- 

/**
 * Generates a unique key for the registry.
 * Uses lowercase to ensure case-insensitive matching.
 */
const generateRegistryKey = (manufacturer: string, model: string): string => {
  return `${manufacturer.toLowerCase()}:${model.toLowerCase()}`;
};

/**
 * Adds or updates a device register map in the registry.
 */
export const registerDeviceMap = (map: DeviceRegisterMap): void => {
  const key = generateRegistryKey(map.manufacturer, map.model);
  registerMapRegistry.set(key, map);
  console.log(`Registered map for: ${key}`);
};

/**
 * Retrieves a device register map from the registry.
 */
export const getDeviceRegisterMap = (
  manufacturer: string | undefined,
  model: string | undefined
): DeviceRegisterMap | undefined => {
  if (!manufacturer || !model) {
    return undefined;
  }
  const key = generateRegistryKey(manufacturer, model);
  return registerMapRegistry.get(key);
};

// --- Initialize Registry with Examples ---
registerDeviceMap(genericPVRegisterMap);
registerDeviceMap(genericBMSRegisterMap);
registerDeviceMap(genericMeterRegisterMap);

// --- Utility to find a specific register definition by its standard name ---
export const findRegisterByName = (
    map: DeviceRegisterMap | undefined,
    standardName: string
): RegisterDefinition | undefined => {
    return map?.registers.find(reg => reg.name === standardName);
}; 