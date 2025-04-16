import React, { useState, useEffect } from 'react';

// Placeholder types (can be refined/imported later)
interface ChargerState {
  id: string;
  status: string;
  currentPowerKw: number;
  limitKw?: number | null;
}

// Basic styling (inline for simplicity)
const styles: { [key: string]: React.CSSProperties } = {
  container: { /* ... same style as EnergyOptimizerDisplay ... */
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '10px',
    fontFamily: 'sans-serif',
    maxWidth: '600px',
  },
  header: { /* ... */ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  section: { /* ... */ marginBottom: '15px' },
  metricRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', padding: '2px 0', borderBottom: '1px dotted #eee' },
  label: { fontWeight: 'bold' },
  value: { fontFamily: 'monospace' },
  chargerList: { listStyle: 'none', padding: 0 },
  chargerItem: { border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '8px', backgroundColor: '#f9f9f9' },
  chargerId: { fontWeight: 'bold', marginBottom: '5px' },
};

export const DlmDashboard: React.FC = () => {
  // --- Placeholder State --- 
  // In a real app, this state would come from the simulator/DLM service via context, websocket, polling, etc.
  const [siteLimitKw, setSiteLimitKw] = useState<number>(50.0);
  const [currentSiteLoadKw, setCurrentSiteLoadKw] = useState<number>(22.5); // Example: 15kW base + 7.5kW EV
  const [currentEvLoadKw, setCurrentEvLoadKw] = useState<number>(7.5);
  const [availableForEvKw, setAvailableForEvKw] = useState<number>(35.0); // 50 - 15
  const [chargingChargers, setChargingChargers] = useState<ChargerState[]>([
    { id: 'charger-001', status: 'Charging', currentPowerKw: 4.0, limitKw: 4.0 },
    { id: 'charger-002', status: 'Charging', currentPowerKw: 3.5, limitKw: 4.0 },
    { id: 'charger-003', status: 'Available', currentPowerKw: 0, limitKw: null },
  ]);

  // TODO: Add useEffect to fetch/subscribe to real state updates

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>DLM Dashboard</h2>

      {/* --- Site Metrics --- */}
      <div style={styles.section}>
        <h3>Site Power Status</h3>
        <div style={styles.metricRow}> <span style={styles.label}>Site Import Limit:</span> <span style={styles.value}>{siteLimitKw.toFixed(1)} kW</span> </div>
        <div style={styles.metricRow}> <span style={styles.label}>Total Site Load (Metered):</span> <span style={styles.value}>{currentSiteLoadKw.toFixed(2)} kW</span> </div>
        <div style={styles.metricRow}> <span style={styles.label}>Current EV Charging Load:</span> <span style={styles.value}>{currentEvLoadKw.toFixed(2)} kW</span> </div>
        <div style={styles.metricRow}> <span style={styles.label}>Available for EV Charging:</span> <span style={styles.value}>{availableForEvKw.toFixed(2)} kW</span> </div>
      </div>

      {/* --- Charger Status --- */}
      <div style={styles.section}>
        <h3>EV Charger Status & Limits</h3>
        {chargingChargers.length > 0 ? (
          <ul style={styles.chargerList}>
            {chargingChargers.map((charger) => (
              <li key={charger.id} style={styles.chargerItem}>
                <div style={styles.chargerId}>{charger.id}</div>
                <div><span style={styles.label}>Status:</span> {charger.status}</div>
                <div><span style={styles.label}>Current Power:</span> <span style={styles.value}>{charger.currentPowerKw.toFixed(2)} kW</span></div>
                <div>
                  <span style={styles.label}>DLM Limit:</span> 
                  <span style={styles.value}> {charger.limitKw !== null && charger.limitKw !== undefined ? `${charger.limitKw.toFixed(2)} kW` : 'N/A'}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No chargers currently active.</div>
        )}
      </div>
      {/* TODO: Add button to trigger manual DLM cycle? */} 
    </div>
  );
}; 