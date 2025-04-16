
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export type TelemetryMetric = 'power' | 'energy' | 'voltage' | 'current' | 'temperature';

interface LiveTelemetryChartProps {
  data: Array<{
    timestamp: string;
    value: number;
  }>;
  metric: TelemetryMetric;
  color?: string;
  height?: number;
}

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  data,
  metric,
  color = '#3b82f6',
  height = 300
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUnit = (metric: TelemetryMetric) => {
    switch (metric) {
      case 'power':
        return 'kW';
      case 'energy':
        return 'kWh';
      case 'voltage':
        return 'V';
      case 'current':
        return 'A';
      case 'temperature':
        return '°C';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime} 
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value} ${getUnit(metric)}`, metric]}
            labelFormatter={(label) => formatTime(label as string)}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            activeDot={{ r: 6 }}
            isAnimationActive={false}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveTelemetryChart;
