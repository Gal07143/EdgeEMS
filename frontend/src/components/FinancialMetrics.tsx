import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface FinancialMetricsProps {
  deviceId: string;
}

interface ROICalculation {
  device_id: string;
  base_cost: number;
  optimal_cost: number;
  savings: number;
  investment: number;
  roi_percent: number;
  payback_period_years: number;
}

interface Tariff {
  id: string;
  name: string;
  provider: string;
  type: string;
  rates: Record<string, number>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ deviceId }) => {
  const [roiData, setRoiData] = useState<ROICalculation | null>(null);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<string>('');
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTariffs();
  }, []);

  useEffect(() => {
    if (selectedTariff) {
      calculateROI();
    }
  }, [selectedTariff, horizonHours]);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/optimization/tariffs');
      const data = await response.json();
      setTariffs(data);
      if (data.length > 0) {
        setSelectedTariff(data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch tariffs');
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/optimization/roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: deviceId,
          horizon_hours: horizonHours,
          tariff_id: selectedTariff
        })
      });
      const data = await response.json();
      setRoiData(data);
    } catch (err) {
      setError('Failed to calculate ROI');
    } finally {
      setLoading(false);
    }
  };

  const renderROIMetrics = () => {
    if (!roiData) return null;

    const costData = [
      { name: 'Base Cost', value: roiData.base_cost },
      { name: 'Optimal Cost', value: roiData.optimal_cost },
      { name: 'Savings', value: roiData.savings }
    ];

    const pieData = [
      { name: 'Investment', value: roiData.investment },
      { name: 'Savings', value: roiData.savings }
    ];

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Comparison
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment vs. Savings
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ROI Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Return on Investment
                  </Typography>
                  <Typography variant="h4" color={roiData.roi_percent >= 0 ? 'primary' : 'error'}>
                    {roiData.roi_percent.toFixed(2)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Payback Period
                  </Typography>
                  <Typography variant="h4">
                    {roiData.payback_period_years.toFixed(1)} years
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Annual Savings
                  </Typography>
                  <Typography variant="h4">
                    ${(roiData.savings * 365 / horizonHours).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Financial Analysis
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tariff</InputLabel>
              <Select
                value={selectedTariff}
                onChange={(e) => setSelectedTariff(e.target.value)}
                disabled={loading}
              >
                {tariffs.map((tariff) => (
                  <MenuItem key={tariff.id} value={tariff.id}>
                    {tariff.name} ({tariff.provider})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Forecast Horizon (hours)"
              type="number"
              value={horizonHours}
              onChange={(e) => setHorizonHours(Number(e.target.value))}
              disabled={loading}
              inputProps={{ min: 1, max: 168 }}
            />
          </Grid>
        </Grid>
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          renderROIMetrics()
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialMetrics; 