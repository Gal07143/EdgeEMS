import { EVChargerDevice } from '@/types/energy'; // Assuming EVChargerDevice type exists
import { readDeviceDataPoint } from '@/adapters/modbusAdapter'; // Import the NEW adapter functions

// --- Interfaces & Types for DLM ---

// Simplified state for an active charging session relevant to DLM
interface ActiveChargerSession {
  deviceId: string;
  connectorId: number; // Usually 1 for single connector chargers
  currentPowerKw: number; // Current charging power from MeterValues
  maxPowerKw: number; // Max power the charger hardware supports
  currentProfileLimitKw?: number | null; // The limit set by the last ChargingProfile
  status: string; // Last known OCPP status (e.g., 'Charging', 'SuspendedEV')
}

// Structure for the SetChargingProfile command payload (simplified)
// Ref: Based on OCPP 1.6/2.0.1 SetChargingProfile structure
interface OcppChargingProfile {
  chargingProfileId: number;
  stackLevel: number;
  chargingProfilePurpose: 'ChargePointMaxProfile' | 'TxDefaultProfile' | 'TxProfile';
  chargingProfileKind: 'Absolute' | 'Recurring' | 'Relative';
  chargingSchedule: {
    chargingRateUnit: 'W' | 'A'; // Watts or Amps
    chargingSchedulePeriod: { startPeriod: number; limit: number }[]; // Seconds from start, limit in W or A
    duration?: number; // Optional: duration in seconds
    startSchedule?: string; // Optional: ISO 8601 start time
    minChargingRate?: number; // Optional: minimum rate
  };
  transactionId?: string; // Optional: for TxProfile
}

// --- Placeholder Data Fetching Functions (Partially Replaced) ---

// Simulates fetching the site's grid import limit 
const getSiteMaxGridImportKw = (): number => {
  return 50.0; // Example: Site has a 50 kW import limit
};

// Simulates fetching the state of all active EV chargers
const getActiveChargerSessions = (): ActiveChargerSession[] => {
  // In reality, fetch from device context, telemetry cache, or CSMS database
  // Example: Two cars currently charging
  return [
    {
      deviceId: 'charger-001',
      connectorId: 1,
      currentPowerKw: 7.2,
      maxPowerKw: 11.0, 
      currentProfileLimitKw: null, // No limit set yet
      status: 'Charging',
    },
    {
      deviceId: 'charger-002',
      connectorId: 1,
      currentPowerKw: 6.8,
      maxPowerKw: 7.4,
      currentProfileLimitKw: null,
      status: 'Charging',
    },
     {
      deviceId: 'charger-003',
      connectorId: 1,
      currentPowerKw: 0,
      maxPowerKw: 22.0,
      currentProfileLimitKw: null,
      status: 'Available', // Not charging, should not be limited unless preparing
    },
  ];
};

// --- Placeholder Command Sending Function ---

// Simulates sending the SetChargingProfile OCPP command to a specific charger
const sendChargingProfile = (
  deviceId: string,
  connectorId: number,
  profile: OcppChargingProfile
): Promise<{ success: boolean; message?: string }> => {
  console.log(`DLM: Sending Charging Profile to ${deviceId} (Connector ${connectorId}):`);
  console.log(`  Profile ID: ${profile.chargingProfileId}`);
  console.log(`  Purpose: ${profile.chargingProfilePurpose}, Kind: ${profile.chargingProfileKind}`);
  console.log(`  Schedule: ${JSON.stringify(profile.chargingSchedule)}`);
  
  // Simulate network delay and success/failure
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success for now
      resolve({ success: true }); 
      // Example failure: resolve({ success: false, message: 'Charger unresponsive' });
    }, 150); // 150ms delay
  });
};

// --- Core DLM Logic ---

let dlmCycleCounter = 0; // Simple counter for unique profile IDs

/**
 * Runs a single cycle of the Dynamic Load Management logic.
 * Fetches current site/charger states, calculates limits, and sends profiles.
 */
export const runDlmCycle = async () => {
  dlmCycleCounter++;
  console.log(`\n--- Running DLM Cycle ${dlmCycleCounter} ---`);

  // 1. Get Inputs
  const siteMaxGridImportKw = getSiteMaxGridImportKw();
  
  // Read current site load from main meter using the NEW adapter function
  let currentSiteLoadKw = 0; 
  try {
    // Use standard name 'active_power_total' defined in the map
    const meterReadResult = await readDeviceDataPoint('meter-main', 'active_power_total'); 
    if (meterReadResult.success && typeof meterReadResult.value === 'number') {
      currentSiteLoadKw = meterReadResult.value / 1000; // Adapter handles scaling, value is in W, convert to kW
    } else {
      console.error(`DLM Error: Failed to read site load from meter-main. ${meterReadResult.error || 'Unknown error'}`);
    }
  } catch (error) {
      console.error("DLM Exception: Error reading site load:", error);
  }

  const activeSessions = getActiveChargerSessions();

  // Filter for sessions that are actually charging or preparing (eligible for limiting)
  const chargingSessions = activeSessions.filter(
    (s) => s.status === 'Charging' || s.status === 'Preparing'
  );
  
  if (chargingSessions.length === 0) {
      console.log("DLM: No active charging sessions requiring management.");
      return; 
  }

  // 2. Calculate Available Power for EV Charging
  const currentEvChargingLoadKw = chargingSessions.reduce((sum, s) => sum + s.currentPowerKw, 0);
  // IMPORTANT: Site load read from meter (30001) likely INCLUDES current EV charging load.
  // So, available power = Site Limit - (Total Metered Load - EV Charging Load)
  // Or simpler: Available Power = Site Limit - Base Load (where Base Load = Total Metered Load - EV Charging Load)
  const baseSiteLoadKw = currentSiteLoadKw - currentEvChargingLoadKw;
  const availableForEvKw = siteMaxGridImportKw - baseSiteLoadKw; 
  
  console.log(`DLM Inputs: Site Limit=${siteMaxGridImportKw}kW, Metered Load=${currentSiteLoadKw.toFixed(2)}kW, Current EV Load=${currentEvChargingLoadKw.toFixed(2)}kW`);
  console.log(`DLM Calculation: Base Site Load = ${baseSiteLoadKw.toFixed(2)}kW`);
  console.log(`DLM Calculation: Power Available for EVs = ${availableForEvKw.toFixed(2)}kW`);

  // 3. Distribute Available Power (Proportional Strategy based on Max Power)
  if (availableForEvKw <= 0) {
      console.warn(`DLM Warning: No power available for EV charging or site overloaded. Setting EV limits to minimum.`);
      // Setting limit to 0 might stop charging completely, 1.4kW (~6A) is often minimum
      // Depending on policy, might want to stop sessions instead via RemoteStopTransaction
  }
  
  // Calculate total max potential power of active chargers
  const totalMaxPowerCapabilityKw = chargingSessions.reduce((sum, s) => sum + s.maxPowerKw, 0);
  
  console.log(`DLM Strategy: Proportional distribution based on total max capability of ${totalMaxPowerCapabilityKw.toFixed(2)}kW`);

  // 4. Generate and Send Charging Profiles
  for (const session of chargingSessions) {
    let targetPowerKw = 0;
    if (availableForEvKw > 0 && totalMaxPowerCapabilityKw > 0) {
        // Calculate proportional share
        const proportion = session.maxPowerKw / totalMaxPowerCapabilityKw;
        targetPowerKw = availableForEvKw * proportion;
    } else {
        // If no power available, set to minimum (or zero if policy dictates)
        targetPowerKw = 1.4; // Minimum practical charging power ~6A
    }
    
    // Clamp the target power to the charger's hardware max limit AND ensure minimum if power is available
    const clampedTargetKw = Math.min(session.maxPowerKw, targetPowerKw);
    const finalLimitKw = availableForEvKw > 0 ? Math.max(1.4, clampedTargetKw) : 0; // Ensure minimum only if power available, else 0?
    
    const finalLimitWatts = Math.round(finalLimitKw * 1000);

    // Construct the OCPP Charging Profile (Absolute limit for immediate effect)
    const profile: OcppChargingProfile = {
      chargingProfileId: dlmCycleCounter * 100 + session.connectorId, // Simple unique ID
      stackLevel: 1, // Higher levels override lower ones
      chargingProfilePurpose: 'ChargePointMaxProfile', // Sets an overall limit for the charge point/connector
      chargingProfileKind: 'Absolute', // Limit is absolute value, not relative
      chargingSchedule: {
        chargingRateUnit: 'W', // Use Watts for precision
        chargingSchedulePeriod: [
          { startPeriod: 0, limit: finalLimitWatts } // Apply immediately
        ],
        // duration: 3600 // Optional: Make the profile valid for 1 hour
      }
    };

    try {
        console.log(`DLM Action: Setting limit for ${session.deviceId} to ${finalLimitKw.toFixed(2)}kW (${finalLimitWatts}W)`);
        const result = await sendChargingProfile(session.deviceId, session.connectorId, profile);
        if (!result.success) {
            console.error(`DLM Error: Failed to set profile for ${session.deviceId} - ${result.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`DLM Exception: Error sending profile to ${session.deviceId}:`, error);
    }
  }
  console.log(`--- DLM Cycle ${dlmCycleCounter} Complete ---`);
};

// --- Optional: Run DLM periodically ---

// let dlmInterval: NodeJS.Timeout | null = null;

// export const startDlmService = (intervalSeconds: number = 15) => {
//   if (dlmInterval) {
//     console.warn("DLM Service already running.");
//     return;
//   }
//   console.log(`Starting DLM Service with ${intervalSeconds}s interval.`);
//   dlmInterval = setInterval(runDlmCycle, intervalSeconds * 1000);
//   runDlmCycle(); // Run immediately on start
// };

// export const stopDlmService = () => {
//   if (dlmInterval) {
//     console.log("Stopping DLM Service.");
//     clearInterval(dlmInterval);
//     dlmInterval = null;
//   } else {
//     console.log("DLM Service not running.");
//   }
// }; 