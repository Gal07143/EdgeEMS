import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Equipment {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  type: string;
  lastUpdated: string;
  efficiency: number;
  load: number;
  alerts: number;
}

const mockEquipment: Equipment[] = [
  { 
    id: '1', 
    name: 'Air Handler Unit 1', 
    status: 'online', 
    type: 'HVAC',
    lastUpdated: '2 min ago',
    efficiency: 94,
    load: 72,
    alerts: 0
  },
  { 
    id: '2', 
    name: 'Chiller System B', 
    status: 'warning', 
    type: 'Cooling',
    lastUpdated: '5 min ago',
    efficiency: 78,
    load: 88,
    alerts: 2
  },
  { 
    id: '3', 
    name: 'Boiler Unit 3', 
    status: 'offline', 
    type: 'Heating',
    lastUpdated: '3 hours ago',
    efficiency: 0,
    load: 0,
    alerts: 1
  },
  { 
    id: '4', 
    name: 'Solar Panel Array', 
    status: 'online', 
    type: 'Generation',
    lastUpdated: '1 min ago',
    efficiency: 89,
    load: 65,
    alerts: 0
  },
  { 
    id: '5', 
    name: 'Battery Storage A', 
    status: 'online', 
    type: 'Storage',
    lastUpdated: '2 min ago',
    efficiency: 97,
    load: 45,
    alerts: 0
  },
  { 
    id: '6', 
    name: 'Heat Exchanger Unit 2', 
    status: 'maintenance', 
    type: 'HVAC',
    lastUpdated: '1 day ago',
    efficiency: 50,
    load: 20,
    alerts: 3
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'warning':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'offline':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'maintenance':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    case 'offline':
      return <Info className="h-4 w-4 mr-1" />;
    case 'maintenance':
      return <Clock className="h-4 w-4 mr-1" />;
    default:
      return <Info className="h-4 w-4 mr-1" />;
  }
};

const StatusMonitor = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [filter, setFilter] = useState('all');

  const filteredEquipment = filter === 'all' 
    ? equipment
    : equipment.filter(eq => eq.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Equipment Status Monitor
          </h1>
          <p className="text-muted-foreground">Monitor the real-time status of all equipment</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setEquipment([...mockEquipment])}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="overflow-hidden backdrop-blur-sm bg-card/90 hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={cn("border", getStatusColor(item.status))}>
                  <span className="flex items-center">
                    {getStatusIcon(item.status)}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span>{item.type}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.lastUpdated}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficiency</span>
                    <span className={cn(
                      item.efficiency > 90 ? "text-green-500" : 
                      item.efficiency > 75 ? "text-yellow-500" : 
                      "text-red-500"
                    )}>
                      {item.efficiency}%
                    </span>
                  </div>
                  <Progress 
                    value={item.efficiency} 
                    className={cn(
                      item.efficiency > 90 ? "bg-green-500/20" : 
                      item.efficiency > 75 ? "bg-yellow-500/20" : 
                      "bg-red-500/20"
                    )}
                    variant={
                      item.efficiency > 90 ? "success" : 
                      item.efficiency > 75 ? "warning" : 
                      "danger"
                    }
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Load</span>
                    <span>{item.load}%</span>
                  </div>
                  <Progress value={item.load} />
                </div>
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/equipment/${item.id}`)}
                  >
                    Details
                  </Button>
                  {item.alerts > 0 && (
                    <Badge variant="danger">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {item.alerts} {item.alerts === 1 ? 'Alert' : 'Alerts'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default StatusMonitor;
