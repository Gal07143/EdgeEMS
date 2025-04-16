import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";

interface SummaryGaugeCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  gaugeLevel?: number;
  status?: string;
  statusColor?: string;
  className?: string;
  gaugeMax?: number;
}

export const SummaryGaugeCard: React.FC<SummaryGaugeCardProps> = ({
  icon,
  title,
  value,
  unit,
  description,
  gaugeLevel = 0,
  status,
  statusColor = 'text-muted-foreground',
  className,
  gaugeMax = 100
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const validGaugeMax = gaugeMax === 0 ? 100 : gaugeMax;
  const percentage = Math.max(0, Math.min(100, (gaugeLevel / validGaugeMax) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground"> 
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col items-center justify-center pt-0 pb-4 px-4">
        <div className="relative w-32 h-32 my-2">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
              stroke="hsl(var(--muted))"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
              stroke="hsl(var(--primary))"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-xs text-muted-foreground -mt-1">{unit}</span>}
          </div>
        </div>
        
        {(status || description) && (
          <p className={cn("text-xs text-center mt-1 font-medium", status ? statusColor : 'text-muted-foreground')}>
            {status || description} 
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 