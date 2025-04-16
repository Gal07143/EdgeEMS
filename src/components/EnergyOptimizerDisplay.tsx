import React from 'react';
import { useEnergyOptimizer, OptimizationGoal } from '@/hooks/useEnergyOptimizer';
import { useDevices } from '@/contexts/DeviceContext'; // To get device names

// Basic styling (inline for simplicity)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '10px',
    fontFamily: 'sans-serif',
    maxWidth: '600px',
  },
  header: {
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  section: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '8px',
  },
  value: {
    fontFamily: 'monospace',
  },
  button: {
    margin: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  recommendationList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  recommendationItem: {
    border: '1px solid #eee',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  loading: {
    fontStyle: 'italic',
  }
};

export const EnergyOptimizerDisplay: React.FC = () => {
  const { 
    isLoading, 
    error, 
    optimizationGoal, 
    recommendations, 
    metrics, 
    runOptimization 
  } = useEnergyOptimizer();
  
  // Get devices context to map device IDs to names for better display
  const { devices } = useDevices();
  const getDeviceName = (id: string) => devices.find(d => d.id === id)?.name || id;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Energy Optimizer Status</h2>

      {/* --- Status & Controls --- */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>Status:</span>
          {isLoading ? <span style={styles.loading}>Optimizing...</span> : <span>Idle</span>}
        </div>
        {error && <div style={styles.error}>Error: {error}</div>}
        
        <div>
          <span style={styles.label}>Current Goal:</span>
          <select value={optimizationGoal} style={{ marginRight: '10px' }} disabled>
            <option value="MAXIMIZE_SELF_CONSUMPTION">Maximize Self-Consumption</option>
            <option value="MINIMIZE_COST">Minimize Cost</option>
            <option value="REDUCE_CARBON">Reduce Carbon</option> 
            <option value="GRID_STABILITY">Grid Stability</option> 
          </select>
          <button onClick={() => runOptimization()} disabled={isLoading} style={styles.button}>
            {isLoading ? 'Running...' : 'Run Optimization Now'}
          </button>
        </div>
      </div>

      {/* --- Metrics --- */}
      <div style={styles.section}>
        <h3>Current Metrics</h3>
        <div><span style={styles.label}>Solar Production:</span> <span style={styles.value}>{metrics.currentSolarProduction?.toFixed(2) ?? 'N/A'} kW</span></div>
        <div><span style={styles.label}>Load:</span> <span style={styles.value}>{metrics.currentLoad?.toFixed(2) ?? 'N/A'} kW</span></div>
        <div><span style={styles.label}>Battery SoC:</span> <span style={styles.value}>{metrics.currentBatterySoC?.toFixed(1) ?? 'N/A'} %</span></div>
        {/* Add other metrics as needed */}
      </div>

      {/* --- Recommendations --- */}
      <div style={styles.section}>
        <h3>Recommendations</h3>
        {recommendations.length > 0 ? (
          <ul style={styles.recommendationList}>
            {recommendations.map((rec, index) => (
              <li key={`${rec.deviceId}-${rec.action}-${index}`} style={styles.recommendationItem}>
                <span style={styles.label}>{rec.action}</span> 
                <span>{getDeviceName(rec.deviceId)}</span>
                {rec.value !== undefined && <span>: <span style={styles.value}>{typeof rec.value === 'object' ? JSON.stringify(rec.value) : rec.value.toString()}</span></span>}
              </li>
            ))}
          </ul>
        ) : (
          <div>No recommendations currently.</div>
        )}
      </div>
    </div>
  );
}; 