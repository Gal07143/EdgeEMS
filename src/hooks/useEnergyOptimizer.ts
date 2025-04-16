import { useState, useEffect, useCallback } from 'react';
import { useDevices, TelemetryData } from '@/contexts/DeviceContext';
import { EnergyDevice, BatteryDevice, EVChargerDevice, DeviceType } from '@/types/energy'; // Import relevant types and base Device
import { getCurrentTariffInfo, TariffPeriod } from '@/utils/tariffs'; // Import tariff utility
import { getEnergyForecast, EnergyForecast } from '@/utils/forecasts'; // Import forecast utility
import { readDeviceDataPoint, writeDeviceDataPoint } from '@/adapters/modbusAdapter'; // Import the map-driven adapter and write if needed

// --- Type Guards ---
function isBatteryDevice(device: EnergyDevice): device is BatteryDevice {
  return device.type === 'battery' && typeof (device as BatteryDevice).nominalCapacityKwh === 'number';
}

function isEVChargerDevice(device: EnergyDevice): device is EVChargerDevice {
  return device.type === 'ev_charger' && typeof (device as EVChargerDevice).maxPowerKw === 'number';
}
// --- End Type Guards ---

// Define potential optimization goals
export type OptimizationGoal = 'MINIMIZE_COST' | 'MAXIMIZE_SELF_CONSUMPTION' | 'REDUCE_CARBON' | 'GRID_STABILITY';

// Define structure for recommendations
interface ControlAction {
  deviceId: string;
  action: 'CHARGE' | 'DISCHARGE' | 'SET_POWER' | 'SET_SCHEDULE' | 'STANDBY' | 'EXPORT' | 'IMPORT';
  value?: number | string | Record<string, any>; // e.g., power in kW, schedule object
  priority?: number; // Optional priority for conflicting actions
}

// Define state for the optimizer
interface EnergyOptimizerState {
  isLoading: boolean;
  error: string | null;
  optimizationGoal: OptimizationGoal;
  recommendations: ControlAction[]; // Use defined type
  metrics: {
    currentSolarProduction?: number;
    currentLoad?: number;
    currentBatterySoC?: number;
    estimatedSavings?: number;
    selfConsumptionRate?: number;
  };
  lastRunInfo: {
    timestamp: string;
    forecastUsed: EnergyForecast;
    tariffUsed: TariffPeriod | null;
  } | null;
}

const initialState: EnergyOptimizerState = {
  isLoading: false,
  error: null,
  optimizationGoal: 'MAXIMIZE_SELF_CONSUMPTION', // Default goal
  recommendations: [],
  metrics: {},
  lastRunInfo: null,
};

export function useEnergyOptimizer() {
  const { devices, deviceTelemetry, loading: devicesLoading, error: devicesError } = useDevices();
  const [optimizerState, setOptimizerState] = useState<EnergyOptimizerState>(initialState);

  // Filter devices using type guards
  const batteries = devices.filter(isBatteryDevice);
  const solarInverters = devices.filter(d => d.type === 'solar');
  const evChargers = devices.filter(isEVChargerDevice);
  const gridConnections = devices.filter(d => d.type === 'grid');
  // Assuming a generic 'load' device type exists for total consumption measurement
  const loads = devices.filter(d => d.type === 'load');

  const runOptimization = useCallback(async () => {
    if (devicesLoading) { 
        console.log("Optimizer skipped: Devices not loaded yet.");
        return;
    }

    setOptimizerState(prev => ({ ...prev, isLoading: true, error: null, recommendations: [] }));

    try {
      const startTime = new Date();
      const forecast: EnergyForecast = getEnergyForecast(); 
      
      // --- Get current system state using the Adapter --- 
      let currentSolarProduction = 0;
      let currentLoad = 0;
      let currentBatterySoC: number | null = null;
      
      // Example: Read Solar Production
      const mainSolarInverterId = solarInverters[0]?.id;
      if (mainSolarInverterId) {
          const solarRead = await readDeviceDataPoint(mainSolarInverterId, 'ac_power'); 
          if (solarRead.success && typeof solarRead.value === 'number') {
              currentSolarProduction = solarRead.value / 1000; // W to kW
          } else { console.warn(`Failed to read solar production: ${solarRead.error}`); }
      }

      // Example: Read Load (Total Active Power from Meter)
      const mainMeterId = 'meter-main'; // Assuming fixed ID for grid meter
      const loadRead = await readDeviceDataPoint(mainMeterId, 'active_power_total'); 
      if (loadRead.success && typeof loadRead.value === 'number') {
          currentLoad = loadRead.value / 1000; // W to kW
          // TODO: Refine load calculation. This value likely INCLUDES EV charging and battery charge/discharge.
          // Base Load = Meter Reading - EV Charging - Battery Charging + Battery Discharging
          // Needs EV power and Battery power readings too.
      } else { console.warn(`Failed to read site load: ${loadRead.error}`); }

      // Example: Read Battery SOC
      const mainBattery = batteries[0];
      let mainBatteryId = mainBattery?.id;
      if (mainBatteryId) {
           const socRead = await readDeviceDataPoint(mainBatteryId, 'soc'); 
           if (socRead.success && typeof socRead.value === 'number') {
               currentBatterySoC = socRead.value; 
           } else { console.warn(`Failed to read battery SOC: ${socRead.error}`); }
      } else {
           console.log("No primary battery found in devices.");
      }
      // --- End State Fetching ---
      
      let calculatedRecommendations: ControlAction[] = [];
      let excessSolar = currentSolarProduction - currentLoad; // Initial calculation - needs refinement based on load definition
      let currentTariff: TariffPeriod | null = getCurrentTariffInfo(startTime);

      console.log(`Current State @ ${startTime.toLocaleTimeString()} - Solar: ${currentSolarProduction.toFixed(2)}kW, Load (Meter): ${currentLoad.toFixed(2)}kW, SoC: ${currentBatterySoC?.toFixed(1)}%, Tariff: ${currentTariff?.name || 'N/A'} (${currentTariff?.pricePerKwh.toFixed(3) || 'N/A'})`);

      const calculatedMetrics = { currentSolarProduction, currentLoad, currentBatterySoC };
      const gridDeviceId = gridConnections[0]?.id || 'grid'; 
      
      // --- Branch logic based on Optimization Goal --- 
      if (optimizerState.optimizationGoal === 'MAXIMIZE_SELF_CONSUMPTION') {
          // ... (Self-consumption logic populating calculatedRecommendations) ...
          setOptimizerState(prev => ({
                ...prev, 
                isLoading: false,
                recommendations: calculatedRecommendations, 
                metrics: { ...prev.metrics, ...calculatedMetrics }, 
                // Include forecastUsed even if not directly used by this strategy
                lastRunInfo: { timestamp: startTime.toISOString(), forecastUsed: forecast, tariffUsed: currentTariff }, 
          })); 
          return;
      } else if (optimizerState.optimizationGoal === 'MINIMIZE_COST') {
          // ... (Cost minimization logic) ...
           setOptimizerState(prev => ({
                ...prev,
                isLoading: false,
                recommendations: calculatedRecommendations,
                metrics: { ...prev.metrics, ...calculatedMetrics },
                lastRunInfo: { timestamp: startTime.toISOString(), forecastUsed: forecast, tariffUsed: currentTariff },
           })); 
           return;
      } else if (optimizerState.optimizationGoal === 'REDUCE_CARBON') {
           // ... (Carbon reduction logic) ...
            setOptimizerState(prev => ({
                ...prev,
                isLoading: false,
                recommendations: calculatedRecommendations,
                metrics: { ...prev.metrics, ...calculatedMetrics },
                lastRunInfo: { timestamp: startTime.toISOString(), forecastUsed: forecast, tariffUsed: currentTariff }, 
            })); 
            return;
      } else if (optimizerState.optimizationGoal === 'GRID_STABILITY') {
           // ... (Grid stability placeholder logic) ...
            setOptimizerState(prev => ({ 
                ...prev,
                isLoading: false,
                recommendations: calculatedRecommendations,
                metrics: { ...prev.metrics, ...calculatedMetrics }, 
                lastRunInfo: { timestamp: startTime.toISOString(), forecastUsed: forecast, tariffUsed: currentTariff },
            })); 
            return;
      } else {
          // ... (unimplemented goal) ...
           calculatedRecommendations = [{ deviceId: 'system', action: 'STANDBY', value: `Goal ${optimizerState.optimizationGoal} not implemented` }];
      }
      
      // --- Default State Update --- 
      setOptimizerState(prev => ({
            ...prev,
            isLoading: false,
            recommendations: calculatedRecommendations,
            metrics: { ...prev.metrics, ...calculatedMetrics },
            lastRunInfo: { timestamp: startTime.toISOString(), forecastUsed: forecast, tariffUsed: currentTariff },
      }));

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Optimization failed';
      console.error("Optimization Error:", err);
      setOptimizerState(prev => ({ ...prev, isLoading: false, error: message }));
    } 
  }, [devices, devicesLoading, optimizerState.optimizationGoal]);

  // useEffect might need adjustment if we are not reacting to deviceTelemetry changes anymore
  useEffect(() => {
    if (!devicesLoading && devices.length > 0) {
        // console.log("Running initial optimization on data load.");
        // runOptimization(); // Decide if initial run is desired, or only on goal change/timer
    }
  }, [devicesLoading, devices]); // Removed runOptimization from deps if not running initially

  const setGoal = (goal: OptimizationGoal) => {
    console.log("Optimization goal changed to:", goal);
    setOptimizerState(prev => ({ ...prev, optimizationGoal: goal }));
    // runOptimization(); // Run immediately on goal change
  };

  return {
    ...optimizerState,
    runOptimization, // Expose manual trigger
    setGoal,        // Expose goal setter
  };
} 