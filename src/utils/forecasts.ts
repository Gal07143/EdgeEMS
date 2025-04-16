// src/utils/forecasts.ts

export interface ForecastPoint {
  timestamp: string; // ISO 8601 timestamp for the start of the forecast interval
  solarProduction?: number; // Predicted solar generation in kW for the interval
  loadConsumption?: number; // Predicted load consumption in kW for the interval
  gridPrice?: number; // Predicted grid price (optional, could be separate)
}

// Represents the forecast for a period ahead
export interface EnergyForecast {
  generatedAt: string; // When the forecast was created
  forecastHorizonHours: number; // How many hours ahead the forecast covers
  intervalMinutes: number; // The time resolution of the forecast points (e.g., 60 for hourly)
  points: ForecastPoint[];
}

/**
 * Placeholder function to get energy forecast data.
 * In a real application, this would fetch data from a weather API, internal ML model, etc.
 * 
 * @param hoursAhead Number of hours to forecast.
 * @param intervalMinutes Time resolution of the forecast.
 * @returns A simulated EnergyForecast object.
 */
export const getEnergyForecast = (
  hoursAhead: number = 24,
  intervalMinutes: number = 60
): EnergyForecast => {
  const now = new Date();
  const points: ForecastPoint[] = [];
  const intervals = Math.ceil((hoursAhead * 60) / intervalMinutes);

  for (let i = 0; i < intervals; i++) {
    const forecastTime = new Date(now.getTime() + i * intervalMinutes * 60 * 1000);
    const hour = forecastTime.getHours();

    // Simple simulation: basic sine wave for solar, flat load
    const solar = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 5); // Peak 5kW around noon
    const load = 1.5; // Constant 1.5 kW load

    points.push({
      timestamp: forecastTime.toISOString(),
      solarProduction: parseFloat(solar.toFixed(2)),
      loadConsumption: load,
    });
  }

  return {
    generatedAt: now.toISOString(),
    forecastHorizonHours: hoursAhead,
    intervalMinutes: intervalMinutes,
    points: points,
  };
}; 