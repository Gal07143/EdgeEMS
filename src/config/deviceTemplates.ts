import { Register, DataType, RegisterType, RegisterTemplate } from '../types/modbus';
import cloneDeep from 'lodash/cloneDeep';

// Define the structure for a device template
interface DeviceTemplate {
    description: string;
    registers: RegisterTemplate[]; // Use RegisterTemplate here
}

// Define some example device templates
export const defaultTemplates: Record<string, DeviceTemplate> = {
    'Generic Inverter': {
        description: 'Generic Inverter',
        registers: [
            { address: 40001, label: 'Voltage L1-N', dataType: DataType.UINT16, registerType: RegisterType.INPUT, unit: 'V', scaleFactor: 0.1 },
            { address: 40002, label: 'Voltage L2-N', dataType: DataType.UINT16, registerType: RegisterType.INPUT, unit: 'V', scaleFactor: 0.1 },
            { address: 40003, label: 'Voltage L3-N', dataType: DataType.UINT16, registerType: RegisterType.INPUT, unit: 'V', scaleFactor: 0.1 },
            { address: 40007, label: 'Frequency', dataType: DataType.UINT16, registerType: RegisterType.INPUT, unit: 'Hz', scaleFactor: 0.01 },
            { address: 40010, label: 'Active Power Total', dataType: DataType.INT16, registerType: RegisterType.INPUT, unit: 'W' },
            { address: 40100, label: 'Operating State', dataType: DataType.UINT16, registerType: RegisterType.INPUT },
            { address: 40200, label: 'Enable Charge', dataType: DataType.BOOLEAN, registerType: RegisterType.HOLDING, writable: true },
            { address: 40201, label: 'Max Charge Power', dataType: DataType.UINT16, registerType: RegisterType.HOLDING, unit: 'W', writable: true },
        ]
    },
    'Simple Sensor': {
        description: 'Simple Sensor',
        registers: [
            { address: 30001, label: 'Temperature', dataType: DataType.FLOAT32, registerType: RegisterType.INPUT, unit: '°C' },
            { address: 30003, label: 'Humidity', dataType: DataType.FLOAT32, registerType: RegisterType.INPUT, unit: '%' },
        ]
    },
    'Basic Actuator': {
        description: 'Basic Actuator',
        registers: [
            { address: 0, label: 'Switch State', dataType: DataType.BOOLEAN, registerType: RegisterType.COIL, writable: true },
            { address: 100, label: 'Set Point', dataType: DataType.INT16, registerType: RegisterType.HOLDING, writable: true, unit: '%', scaleFactor: 10 },
        ]
    }
};

// Function to load a template by key and return a deep copy
export function loadTemplate(templateKey: string): DeviceTemplate | undefined {
    if (!defaultTemplates[templateKey]) {
        console.warn(`Template "${templateKey}" not found.`);
        return undefined;
    }
    // Return a deep copy to prevent modification of the original template
    return cloneDeep(defaultTemplates[templateKey]);
} 