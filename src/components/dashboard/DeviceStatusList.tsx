import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnergyDevice } from '@/types/energy'; // Assuming this type includes name, status, id, etc.
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from 'lucide-react'; // Use CheckCircle and XCircle

interface DeviceStatusListProps {
  devices: EnergyDevice[];
  title?: string;
}

export const DeviceStatusList: React.FC<DeviceStatusListProps> = ({ 
  devices = [], 
  title = "Device Status"
}) => {

  const getStatusVariant = (status: string | undefined): "success" | "destructive" | "secondary" => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'success';
      case 'offline':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* Maybe add a link/button to the full devices page later */}
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {devices.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No devices found.</p>
        ) : (
          <ul className="space-y-3">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  {/* Icon based on status */} 
                  {device.status === 'online' ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />}
                  <span className="font-medium text-sm truncate">{device.name || device.id}</span>
                </div>
                <Badge variant={getStatusVariant(device.status)} className="capitalize text-xs">
                  {device.status || 'Unknown'}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}; 