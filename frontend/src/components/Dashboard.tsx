import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  power_kw: number;
  state_of_charge?: number;
}

interface BatteryState {
  device_id: string;
  state_of_charge: number;
  state_of_health: number;
  temperature: number;
  power: number;
  cycle_count: number;
  remaining_capacity: number;
  health_metrics: {
    degradation_rate: number;
    temperature: {
      average: number;
      maximum: number;
      minimum: number;
    };
    cycles: {
      total: number;
      per_day: number;
    };
  };
}

interface OptimizationResult {
  device_id: string;
  times: string[];
  power_kw: number[];
  state_of_charge: number[];
  consumption_kw: number[];
  production_kw: number[];
  rates: number[];
  objective_value: number;
  success: boolean;
  message: string;
}

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [batteryState, setBatteryState] = useState<BatteryState | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');
  const [powerSetpoint, setPowerSetpoint] = useState<number>(0);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      fetchBatteryState();
      fetchOptimizationResult();
    }
  }, [selectedDevice]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/v1/devices');
      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError('Failed to fetch devices');
    }
  };

  const fetchBatteryState = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/battery/${selectedDevice}/state`);
      const data = await response.json();
      setBatteryState(data);
    } catch (err) {
      setError('Failed to fetch battery state');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptimizationResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/optimization/battery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: selectedDevice,
          horizon_hours: 24
        })
      });
      const data = await response.json();
      setOptimizationResult(data);
    } catch (err) {
      setError('Failed to fetch optimization result');
    } finally {
      setLoading(false);
    }
  };

  const handleControlCommand = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/battery/${selectedDevice}/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          power_kw: powerSetpoint,
          mode: powerSetpoint > 0 ? 'charge' : 'discharge'
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchBatteryState();
      } else {
        setError('Failed to apply control command');
      }
    } catch (err) {
      setError('Failed to apply control command');
    } finally {
      setLoading(false);
    }
  };

  const renderBatteryState = () => {
    if (!batteryState) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Battery State
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">State of Charge</Typography>
              <Typography variant="h4">{batteryState.state_of_charge.toFixed(1)}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">State of Health</Typography>
              <Typography variant="h4">{batteryState.state_of_health.toFixed(1)}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Temperature</Typography>
              <Typography variant="h4">{batteryState.temperature.toFixed(1)}°C</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Power</Typography>
              <Typography variant="h4">{batteryState.power.toFixed(1)} kW</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderOptimizationChart = () => {
    if (!optimizationResult) return null;

    const data = optimizationResult.times.map((time, i) => ({
      time: format(new Date(time), 'HH:mm'),
      power: optimizationResult.power_kw[i],
      consumption: optimizationResult.consumption_kw[i],
      production: optimizationResult.production_kw[i],
      soc: optimizationResult.state_of_charge[i]
    }));

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Optimization Schedule
          </Typography>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="power"
                  stroke="#8884d8"
                  name="Battery Power (kW)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="consumption"
                  stroke="#82ca9d"
                  name="Consumption (kW)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="production"
                  stroke="#ffc658"
                  name="Production (kW)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="soc"
                  stroke="#ff7300"
                  name="State of Charge (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderControlPanel = () => {
    if (!batteryState) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Control Panel
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Control Mode</InputLabel>
                <Select
                  value={controlMode}
                  onChange={(e) => setControlMode(e.target.value as 'auto' | 'manual')}
                >
                  <MenuItem value="auto">Automatic</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {controlMode === 'manual' && (
              <>
                <Grid item xs={12}>
                  <Typography gutterBottom>Power Setpoint (kW)</Typography>
                  <Slider
                    value={powerSetpoint}
                    onChange={(_, value) => setPowerSetpoint(value as number)}
                    min={-batteryState.power}
                    max={batteryState.power}
                    step={0.1}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleControlCommand}
                    disabled={loading}
                  >
                    Apply Command
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Energy Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Device</InputLabel>
            <Select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              {devices.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  {device.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {loading && (
          <Grid item xs={12} display="flex" justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
        
        {selectedDevice && !loading && (
          <>
            <Grid item xs={12} md={6}>
              {renderBatteryState()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderControlPanel()}
            </Grid>
            <Grid item xs={12}>
              {renderOptimizationChart()}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard; 