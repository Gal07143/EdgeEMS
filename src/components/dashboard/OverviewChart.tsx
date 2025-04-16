import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for the chart data points
interface ChartDataPoint {
  name: string; // Typically time or date
  // Add data keys based on what you want to plot (e.g., power, consumption)
  pv?: number;
  load?: number;
  grid?: number;
  battery?: number;
}

interface OverviewChartProps {
  data: ChartDataPoint[];
  title?: string;
}

// Placeholder data - replace with actual data fetching later
const placeholderData: ChartDataPoint[] = [
  { name: '00:00', pv: 0.1, load: 1.5, grid: 1.4, battery: 0 },
  { name: '03:00', pv: 0.0, load: 1.2, grid: 1.2, battery: 0 },
  { name: '06:00', pv: 0.5, load: 1.8, grid: 1.3, battery: -0.2 },
  { name: '09:00', pv: 4.2, load: 2.5, grid: 0.0, battery: -1.7 },
  { name: '12:00', pv: 8.5, load: 2.1, grid: -2.0, battery: -4.4 }, // Negative grid = export
  { name: '15:00', pv: 6.1, load: 3.0, grid: -1.0, battery: -2.1 },
  { name: '18:00', pv: 1.5, load: 3.5, grid: 1.0, battery: 1.0 }, // Positive battery = charging
  { name: '21:00', pv: 0.2, load: 2.8, grid: 1.5, battery: 1.1 },
];

export const OverviewChart: React.FC<OverviewChartProps> = ({ data = placeholderData, title = "Energy Overview" }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* Add controls like date range picker here later */}
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}kW`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))' 
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="pv" name="Solar" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="load" name="Load" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="grid" name="Grid" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="battery" name="Battery" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 