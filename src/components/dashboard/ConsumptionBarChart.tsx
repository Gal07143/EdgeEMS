import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for the chart data points
interface BarChartDataPoint {
  name: string; // e.g., Hour of the day, or Day of the week
  // Add data keys for consumption/generation
  consumption?: number;
  generation?: number;
}

interface ConsumptionBarChartProps {
  data: BarChartDataPoint[];
  title?: string;
}

// Placeholder data - replace with actual data fetching later
const placeholderData: BarChartDataPoint[] = [
  { name: '00h', consumption: 1.5, generation: 0.1 },
  { name: '04h', consumption: 1.2, generation: 0.0 },
  { name: '08h', consumption: 2.0, generation: 3.5 },
  { name: '12h', consumption: 2.5, generation: 8.8 },
  { name: '16h', consumption: 3.1, generation: 5.5 },
  { name: '20h', consumption: 2.8, generation: 0.5 },
];

export const ConsumptionBarChart: React.FC<ConsumptionBarChartProps> = ({ data = placeholderData, title = "Hourly Energy Summary" }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              cursor={{ fill: 'hsl(var(--muted-foreground) / 0.1)' }} // Add subtle hover effect
            />
            <Legend />
            {/* Use different fill colors */}
            <Bar dataKey="consumption" name="Consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="generation" name="Generation" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 