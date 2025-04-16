import { getDeviceRegisterMap, findRegisterByName, RegisterDefinition } from "@/config/registerMaps";
// Assuming a way to get the full device config, including manufacturer/model/modbusConfig
// This might come from a context, a service, or be passed directly.
import { EnergyDevice } from "@/types/energy"; 

// Placeholder function to get device config - replace with actual implementation
const getDeviceConfig = (deviceId: string): EnergyDevice | undefined => {
    // Example lookup - replace with actual state management/API call
    const mockDevices: Record<string, EnergyDevice> = {
        'bms-01': { 
            id: 'bms-01', name: 'Main Battery', type: 'battery', status: 'online',
            manufacturer: 'SafeCell', model: 'BMS-X96', 
            modbusConfig: { host: 'localhost', port: 502, unitId: 1 } 
        },
        'pv-inverter-01': {
             id: 'pv-inverter-01', name: 'Roof Solar', type: 'inverter', status: 'online',
             manufacturer: 'GenericSolarTech', model: 'INV-5000',
             modbusConfig: { host: 'localhost', port: 502, unitId: 2 }
        },
        'meter-main': { 
            id: 'meter-main', name: 'Grid Meter', type: 'meter', status: 'online',
             manufacturer: 'GridEye', model: 'MTR-3P',
             modbusConfig: { host: 'localhost', port: 502, unitId: 3 }
        },
    };
    return mockDevices[deviceId];
};

/**
 * Represents the result of reading a standardized data point.
 */
interface DataPointReadResult {
  success: boolean;
  value?: number | string | boolean; // Normalized value after scaling/parsing
  unit?: string;
  error?: string;
}

/**
 * Represents the result of writing a standardized data point.
 */
interface DataPointWriteResult {
  success: boolean;
  error?: string;
}

// --- Simulated Modbus Communication (Low Level) ---
// These functions now represent the raw interaction, driven by register details

const simulatedReadRawRegisters = async (
    deviceId: string, 
    register: number, 
    length: number, 
    registerType: 'holding' | 'input'
): Promise<{success: boolean, data?: Buffer, error?: string}> => {
     console.log(`MODBUS_SIM: Raw READ - Device: ${deviceId}, Addr: ${register}, Len: ${length}, Type: ${registerType}`);
     // TODO: Implement simulation based on simulatedDeviceRegisters if needed for testing
     // For now, return placeholder success with dummy data matching length
     await new Promise(resolve => setTimeout(resolve, 40)); 
     // Create a buffer of the correct size (2 bytes per register length)
     const buffer = Buffer.alloc(length * 2); 
      // Example: fill with dummy pattern - in reality, get from simulatedDeviceRegisters
     buffer.writeUInt16BE(register % 100, 0); // Put something simple based on register
     if (length > 1) buffer.writeUInt16BE((register+1) % 100, 2); // For float32 etc.
     
     return { success: true, data: buffer };
};

const simulatedWriteRawRegister = async (
    deviceId: string, 
    register: number, 
    valueBuffer: Buffer, // Buffer containing data to write
    registerType: 'holding' // Can typically only write holding registers
): Promise<{success: boolean, error?: string}> => {
    console.log(`MODBUS_SIM: Raw WRITE - Device: ${deviceId}, Addr: ${register}, Type: ${registerType}, Data: ${valueBuffer.toString('hex')}`);
     // TODO: Update simulatedDeviceRegisters if needed for testing
     await new Promise(resolve => setTimeout(resolve, 50)); 
    return { success: true };
};

// --- High-Level Adapter Functions --- 

/**
 * Reads a standardized data point (e.g., 'soc', 'ac_power') for a given device.
 * Uses the device config and register maps to perform the correct Modbus read.
 */
export const readDeviceDataPoint = async (deviceId: string, standardName: string): Promise<DataPointReadResult> => {
    const deviceConfig = getDeviceConfig(deviceId);
    if (!deviceConfig) {
        return { success: false, error: `Device config not found for ${deviceId}` };
    }

    const map = getDeviceRegisterMap(deviceConfig.manufacturer, deviceConfig.model);
    if (!map) {
        return { success: false, error: `Register map not found for ${deviceConfig.manufacturer}:${deviceConfig.model}` };
    }

    const registerDef = findRegisterByName(map, standardName);
    if (!registerDef) {
        return { success: false, error: `Data point '${standardName}' not defined in map for ${deviceConfig.model}` };
    }

    const regLength = registerDef.length || (registerDef.dataType === 'float32' || registerDef.dataType === 'uint32' || registerDef.dataType === 'int32' ? 2 : 1);

    try {
        const readResult = await simulatedReadRawRegisters(deviceId, registerDef.register, regLength, registerDef.type);
        
        if (!readResult.success || !readResult.data) {
            return { success: false, error: readResult.error || 'Failed to read raw Modbus data' };
        }

        // --- Data Type Parsing & Scaling ---
        let parsedValue: number | string | boolean | undefined;
        const scale = registerDef.scale ?? 1;
        const buffer = readResult.data;

        switch (registerDef.dataType) {
            case 'uint16':
                parsedValue = buffer.readUInt16BE(0) * scale;
                break;
            case 'int16':
                parsedValue = buffer.readInt16BE(0) * scale;
                break;
             case 'uint32': // Requires length >= 2
                 if (buffer.length < 4) throw new Error('Buffer too short for uint32');
                 parsedValue = buffer.readUInt32BE(0) * scale;
                 break;
             case 'int32': // Requires length >= 2
                  if (buffer.length < 4) throw new Error('Buffer too short for int32');
                  parsedValue = buffer.readInt32BE(0) * scale;
                  break;
            case 'float32': // Requires length >= 2
                if (buffer.length < 4) throw new Error('Buffer too short for float32');
                parsedValue = buffer.readFloatBE(0) * scale;
                break;
            case 'boolean': // Often stored in a single bit or register
                 parsedValue = buffer.readUInt16BE(0) !== 0;
                 break;
             case 'string': // Requires length to be specified correctly
                  parsedValue = buffer.toString('ascii'); // Or utf8 etc.
                  break;
            default:
                throw new Error(`Unsupported data type: ${registerDef.dataType}`);
        }

        console.log(`MODBUS: Parsed '${standardName}' for ${deviceId}: ${parsedValue} ${registerDef.unit || ''}`);
        return { success: true, value: parsedValue, unit: registerDef.unit };

    } catch (error) {
        console.error(`MODBUS Error reading ${standardName} for ${deviceId}:`, error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};


/**
 * Writes a value to a standardized data point (e.g., 'charge_limit_kw') for a given device.
 * Uses the device config and register maps to perform the correct Modbus write.
 */
export const writeDeviceDataPoint = async (
    deviceId: string, 
    standardName: string, 
    value: number | boolean | string // Value to write (should match expected type)
): Promise<DataPointWriteResult> => {
     const deviceConfig = getDeviceConfig(deviceId);
    if (!deviceConfig) {
        return { success: false, error: `Device config not found for ${deviceId}` };
    }
    // Ensure Modbus config exists if we expect to write via Modbus
    if (!deviceConfig.modbusConfig) {
         return { success: false, error: `Device ${deviceId} has no Modbus configuration for writing.` };
    }

    const map = getDeviceRegisterMap(deviceConfig.manufacturer, deviceConfig.model);
    if (!map) {
        return { success: false, error: `Register map not found for ${deviceConfig.manufacturer}:${deviceConfig.model}` };
    }

    const registerDef = findRegisterByName(map, standardName);
    if (!registerDef) {
        return { success: false, error: `Data point '${standardName}' not defined in map for ${deviceConfig.model}` };
    }

    if (!registerDef.writable) {
        return { success: false, error: `Data point '${standardName}' is not marked as writable in the map.` };
    }
     if (registerDef.type !== 'holding') {
         return { success: false, error: `Cannot write to non-holding register type '${registerDef.type}' for '${standardName}'.` };
     }

    try {
        // --- Value Preparation (Scaling & Buffer Creation) ---
        const scale = registerDef.scale ?? 1;
        const regLength = registerDef.length || (registerDef.dataType === 'float32' || registerDef.dataType === 'uint32' || registerDef.dataType === 'int32' ? 2 : 1);
        const buffer = Buffer.alloc(regLength * 2);
        let valueToWrite = typeof value === 'number' ? value / scale : value;

        switch (registerDef.dataType) {
            case 'uint16':
                if (typeof valueToWrite !== 'number') throw new Error('Invalid value type for uint16');
                buffer.writeUInt16BE(Math.round(valueToWrite), 0);
                break;
            case 'int16':
                 if (typeof valueToWrite !== 'number') throw new Error('Invalid value type for int16');
                 buffer.writeInt16BE(Math.round(valueToWrite), 0);
                 break;
            case 'uint32':
                 if (typeof valueToWrite !== 'number') throw new Error('Invalid value type for uint32');
                 buffer.writeUInt32BE(Math.round(valueToWrite), 0);
                 break;
             case 'int32':
                  if (typeof valueToWrite !== 'number') throw new Error('Invalid value type for int32');
                  buffer.writeInt32BE(Math.round(valueToWrite), 0);
                  break;
            case 'float32':
                 if (typeof valueToWrite !== 'number') throw new Error('Invalid value type for float32');
                 buffer.writeFloatBE(valueToWrite, 0);
                 break;
             case 'boolean':
                  buffer.writeUInt16BE(value ? 1 : 0, 0); // Write 1/0 to register
                  break;
            // String writing would need more specific handling based on encoding and length
            default:
                throw new Error(`Unsupported writable data type: ${registerDef.dataType}`);
        }

        const writeResult = await simulatedWriteRawRegister(deviceId, registerDef.register, buffer, registerDef.type);

        if (!writeResult.success) {
            return { success: false, error: writeResult.error || 'Failed to write raw Modbus data' };
        }
        
        console.log(`MODBUS: Wrote '${standardName}' for ${deviceId} with value: ${value}`);
        return { success: true };

    } catch (error) {
         console.error(`MODBUS Error writing ${standardName} for ${deviceId}:`, error);
         return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};

// Remove old simulated functions if no longer needed
// export const readModbusValue = ... 
// export const writeModbusValue = ...

// Remove old in-memory state if raw simulation handles it
// export const simulatedDeviceRegisters = ...

// Example usage (can be removed later)
// const testModbus = async () => {
//   console.log("\n--- Testing Modbus Adapter ---");
//   const socRead = await readModbusValue('bms-01', 40100);
//   console.log("BMS SOC Read:", socRead);

//   const writeSetpoint = await writeModbusValue('bms-01', 1202, 4000);
//   console.log("BMS Setpoint Write:", writeSetpoint);

//   const readSetpoint = await readModbusValue('bms-01', 1202);
//   console.log("BMS Setpoint Read After Write:", readSetpoint);
  
//   const pvRead = await readModbusValue('pv-inverter-01', 40083);
//   console.log("PV Power Read:", pvRead);
  
//   const badRead = await readModbusValue('non-existent', 1234);
//   console.log("Non-existent Device Read:", badRead);

//   const badRegRead = await readModbusValue('meter-main', 99999);
//   console.log("Non-existent Register Read:", badRegRead);
//   console.log("--- End Modbus Test ---\n");
// };
// testModbus(); 