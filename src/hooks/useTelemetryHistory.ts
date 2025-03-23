
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Use the shared client

export interface TelemetryHistoryItem {
  id: string;
  device_id: string;
  timestamp: string;
  created_at: string;
  message: any;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  state_of_charge?: number;
  [key: string]: any; // Allow for dynamic properties from message
}

export const useTelemetryHistory = (deviceId: string, limitMinutes = 60) => {
  const [data, setData] = useState<TelemetryHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const since = new Date(Date.now() - limitMinutes * 60 * 1000).toISOString();
        
        const { data: historyData, error: supabaseError } = await supabase
          .from('telemetry_log')
          .select('*')
          .eq('device_id', deviceId)
          .gte('created_at', since)
          .order('created_at', { ascending: true });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Process each record to extract telemetry values from message and ensure timestamp field
        const processedData = historyData?.map(record => {
          // Create a base record with timestamp field
          let enhancedRecord: TelemetryHistoryItem = { 
            ...record,
            // Ensure timestamp exists, falling back to other available time fields
            timestamp: record.timestamp || record.received_at || record.created_at
          };
          
          // Process message field if it exists
          if (record.message) {
            if (typeof record.message === 'string') {
              try {
                const parsedMessage = JSON.parse(record.message);
                enhancedRecord = { ...enhancedRecord, ...parsedMessage };
              } catch (e) {
                console.warn('Could not parse message as JSON:', e);
              }
            } else if (typeof record.message === 'object') {
              enhancedRecord = { ...enhancedRecord, ...record.message };
            }
          }
          
          return enhancedRecord;
        }) || [];

        setData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching telemetry history:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry history'));
        setData([]); // Ensure data is empty when there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for updates
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [deviceId, limitMinutes]);

  return { data, loading, error };
};
