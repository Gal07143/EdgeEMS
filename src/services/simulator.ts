import { readDeviceDataPoint, writeDeviceDataPoint } from '@/adapters/modbusAdapter';
import { runDlmCycle } from './dlmManager';

const SIMULATION_INTERVAL_MS = 5000; // Update every 5 seconds
const BMS_ID = 'bms-01';
const PV_ID = 'pv-inverter-01';
const METER_ID = 'meter-main';

let simulationInterval: NodeJS.Timeout | null = null;

// Helper to get current time's simulated PV power
const getSimulatedPvPowerW = (): number => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // Simple sine wave based on hour of day
    return Math.max(0, Math.sin((hour + minute/60 - 6) * Math.PI / 12) * 6000); // Peak 6kW
};

/**
 * Updates the simulated state of devices based on time and current values.
 */
const updateSimulation = async () => {
  const now = new Date();

  // --- Simulate PV Inverter ---
  try {
      const pvPowerW = getSimulatedPvPowerW();
      // console.log(`SIM: Would write PV power ${pvPowerW} W (if writable register existed)`);
      // Cannot write via adapter easily unless map allows it.
  } catch (error) {
       console.error("SIM: Error simulating PV state:", error);
  }
  

  // --- Simulate BMS --- 
  try {
    const socResult = await readDeviceDataPoint(BMS_ID, 'soc');
    const chargeLimitResult = await readDeviceDataPoint(BMS_ID, 'charge_limit_kw');
    const dischargeLimitResult = await readDeviceDataPoint(BMS_ID, 'discharge_limit_kw');

    const currentSoc = (socResult.success && typeof socResult.value === 'number') ? socResult.value : 50;
    const chargeLimitKw = (chargeLimitResult.success && typeof chargeLimitResult.value === 'number') ? chargeLimitResult.value : 0;
    const dischargeLimitKw = (dischargeLimitResult.success && typeof dischargeLimitResult.value === 'number') ? dischargeLimitResult.value : 0;
    const netSetpointKw = chargeLimitKw > 0 ? chargeLimitKw : -dischargeLimitKw;
    const netSetpointW = netSetpointKw * 1000;
    
    const capacityWh = 10000; 
    const chargeEfficiency = 0.95;
    const dischargeEfficiency = 0.90;
    let energyChangeWh = 0;
    if (netSetpointW > 0) { energyChangeWh = (netSetpointW * (SIMULATION_INTERVAL_MS / (1000 * 3600))) * chargeEfficiency; }
    else if (netSetpointW < 0) { energyChangeWh = (netSetpointW * (SIMULATION_INTERVAL_MS / (1000 * 3600))) / dischargeEfficiency; }
    const socChange = (energyChangeWh / capacityWh) * 100;
    let newSoc = Math.min(100, Math.max(0, currentSoc + socChange));
    
    // Cannot write SOC via adapter unless map allows.
    // console.log(`SIM: New simulated SOC ${newSoc.toFixed(1)}%`);

  } catch (error) {
      console.error("SIM: Error updating BMS state:", error);
  }
  

  // --- Simulate Main Meter --- 
  try {
      const pvRead = await readDeviceDataPoint(PV_ID, 'ac_power');
      const bmsRead = await readDeviceDataPoint(BMS_ID, 'current');
      const voltageRead = await readDeviceDataPoint(BMS_ID, 'voltage');

      const baseLoadW = 500; 
      const pvGenerationW = (pvRead.success && typeof pvRead.value === 'number') ? pvRead.value : 0;
      const bmsCurrentA = (bmsRead.success && typeof bmsRead.value === 'number') ? bmsRead.value : 0;
      const bmsVoltageV = (voltageRead.success && typeof voltageRead.value === 'number') ? voltageRead.value : 48;
      const bmsPowerW = bmsVoltageV * bmsCurrentA; 
            
      const netSitePowerW = baseLoadW - pvGenerationW + bmsPowerW; 
      
      // Cannot write meter power via adapter unless map allows.
      // console.log(`SIM: New simulated Meter Power ${netSitePowerW} W`);
      
  } catch (error) {
       console.error("SIM: Error simulating Meter state:", error);
  }
 
  // --- Log Current State (Read back via adapter) ---
  // Added try-catch block for safety during logging
  try {
      const pvPower = await readDeviceDataPoint(PV_ID, 'ac_power');
      const soc = await readDeviceDataPoint(BMS_ID, 'soc');
      const meterPower = await readDeviceDataPoint(METER_ID, 'active_power_total');
      console.log(
          `SIM: Updated @ ${now.toLocaleTimeString()} - ` + 
          `PV: ${(pvPower.success && typeof pvPower.value === 'number' ? pvPower.value / 1000 : NaN).toFixed(2)}kW, ` + // Added type check
          `SOC: ${(soc.success && typeof soc.value === 'number' ? soc.value.toFixed(1) : 'N/A')}${soc.unit || ''}, ` + // Added type check
          `Meter: ${(meterPower.success && typeof meterPower.value === 'number' ? meterPower.value / 1000 : NaN).toFixed(2)}kW` // Added type check
      );
  } catch (error) {
      console.error("SIM: Error logging state:", error);
  }

  // --- Trigger DLM Cycle --- 
  try { await runDlmCycle(); } catch (error) { console.error("SIM: Error running DLM cycle:", error); }
};

/**
 * Starts the simulation loop.
 */
export const startSimulation = () => {
  if (simulationInterval) {
    console.warn("Simulation already running.");
    return;
  }
  console.log(`Starting Real-time Simulation (Interval: ${SIMULATION_INTERVAL_MS}ms)...`);
  updateSimulation(); // Run immediately
  simulationInterval = setInterval(updateSimulation, SIMULATION_INTERVAL_MS);
};

/**
 * Stops the simulation loop.
 */
export const stopSimulation = () => {
  if (simulationInterval) {
    console.log("Stopping Real-time Simulation.");
    clearInterval(simulationInterval);
    simulationInterval = null;
  } else {
    console.log("Simulation not running.");
  }
};

// Optional: Auto-start simulation for testing
// startSimulation(); 