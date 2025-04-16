import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface BatteryHealthProps {
  deviceId: string;
}

interface HealthMetrics {
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
}

interface HistoricalData {
  timestamp: string;
  state_of_charge: number;
  state_of_health: number;
  temperature: number;
  power: number;
  cycle_count: number;
}

const BatteryHealth: React.FC<BatteryHealthProps> = ({ deviceId }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    fetchHealthMetrics();
    fetchHistoricalData();
  }, [deviceId]);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/battery/${deviceId}/health`);
      const data = await response.json();
      setHealthMetrics(data);
    } catch (err) {
      setError('Failed to fetch battery health metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/battery/${deviceId}/history`);
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderHealthMetrics = () => {
    if (!healthMetrics) return null;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Degradation
              </Typography>
              <Typography variant="h4" color={healthMetrics.degradation_rate > 0.5 ? 'error' : 'primary'}>
                {(healthMetrics.degradation_rate * 100).toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temperature
              </Typography>
              <Typography variant="h4">
                {healthMetrics.temperature.average.toFixed(1)}°C
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg: {healthMetrics.temperature.minimum.toFixed(1)}°C - {healthMetrics.temperature.maximum.toFixed(1)}°C
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cycles
              </Typography>
              <Typography variant="h4">
                {healthMetrics.cycles.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {healthMetrics.cycles.per_day.toFixed(1)} per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderHistoricalChart = () => {
    if (historicalData.length === 0) return null;

    const data = historicalData.map(item => ({
      ...item,
      date: format(parseISO(item.timestamp), 'MM/dd HH:mm')
    }));

    return (
      <Box height={400}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="state_of_charge"
              stroke="#8884d8"
              fill="#8884d8"
              name="State of Charge (%)"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="state_of_health"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="State of Health (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              stroke="#ff7300"
              name="Temperature (°C)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderCycleChart = () => {
    if (historicalData.length === 0) return null;

    const data = historicalData.map(item => ({
      ...item,
      date: format(parseISO(item.timestamp), 'MM/dd HH:mm')
    }));

    return (
      <Box height={400}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cycle_count"
              stroke="#8884d8"
              name="Cycle Count"
            />
            <Line
              type="monotone"
              dataKey="power"
              stroke="#82ca9d"
              name="Power (kW)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Battery Health
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderHealthMetrics()}
            
            <Box mt={3}>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="State of Health" />
                <Tab label="Cycle Analysis" />
              </Tabs>
              
              <Box mt={2}>
                {activeTab === 0 && renderHistoricalChart()}
                {activeTab === 1 && renderCycleChart()}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BatteryHealth; 