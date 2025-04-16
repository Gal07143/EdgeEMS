// src/utils/tariffs.ts

export type TariffTier = 'peak' | 'off-peak' | 'shoulder' | 'unknown';

export interface TariffPeriod {
  name: TariffTier;
  startTime: string; // Format HH:MM (24-hour clock)
  endTime: string;   // Format HH:MM (24-hour clock) - Note: can span across midnight
  pricePerKwh: number; // Cost in currency units per kWh
}

// Example simple tariff structure
const defaultTariffSchedule: TariffPeriod[] = [
  { name: 'off-peak', startTime: '00:00', endTime: '07:00', pricePerKwh: 0.15 }, 
  { name: 'peak', startTime: '07:00', endTime: '21:00', pricePerKwh: 0.35 }, 
  { name: 'off-peak', startTime: '21:00', endTime: '24:00', pricePerKwh: 0.15 }, 
  // Add more periods for shoulder seasons or weekends if needed
];

/**
 * Placeholder function to get the current electricity tariff information.
 * In a real application, this would fetch data from an API or configuration.
 * 
 * @param date The current date and time.
 * @param schedule Optional: A specific tariff schedule to use.
 * @returns The current TariffPeriod or a default unknown period.
 */
export const getCurrentTariffInfo = (
  date: Date,
  schedule: TariffPeriod[] = defaultTariffSchedule
): TariffPeriod => {
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute; // Total minutes past midnight

  for (const period of schedule) {
    const [startHour, startMinute] = period.startTime.split(':').map(Number);
    const [endHour, endMinute] = period.endTime.split(':').map(Number);
    const periodStartMinutes = startHour * 60 + startMinute;
    let periodEndMinutes = endHour * 60 + endMinute;

    // Handle periods ending at midnight (24:00 becomes 1440 minutes)
    if (endHour === 24 && endMinute === 0) {
        periodEndMinutes = 24 * 60;
    }
    
    // Handle periods that span across midnight (e.g., 21:00 to 07:00)
    if (periodStartMinutes > periodEndMinutes) { 
      // Check if current time is in the first part (e.g., 21:00 to 23:59)
      if (currentTimeMinutes >= periodStartMinutes && currentTimeMinutes < 24 * 60) {
        return period;
      }
      // Check if current time is in the second part (e.g., 00:00 to 07:00)
      if (currentTimeMinutes >= 0 && currentTimeMinutes < periodEndMinutes) {
        return period;
      }
    } else {
      // Standard period within the same day
      if (currentTimeMinutes >= periodStartMinutes && currentTimeMinutes < periodEndMinutes) {
        return period;
      }
    }
  }

  console.warn("Could not determine current tariff period for time:", date.toLocaleTimeString());
  // Return a default/unknown state if no period matches
  return { name: 'unknown', startTime: '00:00', endTime: '24:00', pricePerKwh: 0.25 }; 
}; 