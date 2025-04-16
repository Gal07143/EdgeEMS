
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from '@/components/ui/date-range-picker';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  ArrowUpDown, CalendarIcon, ChevronDown, Download, Filter, Plus, Search
} from 'lucide-react';

interface Meter {
  id: string;
  name: string;
  location: string;
  type: string;
  lastReading: number;
  unit: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: string;
}

const meterData: Meter[] = [
  { 
    id: 'm1',
    name: 'Main Electric Meter',
    location: 'Main Building',
    type: 'Electric',
    lastReading: 45782.4,
    unit: 'kWh',
    status: 'online',
    lastUpdate: '2 min ago'
  },
  { 
    id: 'm2',
    name: 'Solar Generation Meter',
    location: 'Roof',
    type: 'Electric-Gen',
    lastReading: 12845.7,
    unit: 'kWh',
    status: 'online',
    lastUpdate: '2 min ago'
  },
  { 
    id: 'm3',
    name: 'HVAC Submeter',
    location: 'Mechanical Room',
    type: 'Electric',
    lastReading: 15421.8,
    unit: 'kWh',
    status: 'online',
    lastUpdate: '3 min ago'
  },
  { 
    id: 'm4',
    name: 'Natural Gas Meter',
    location: 'Boiler Room',
    type: 'Gas',
    lastReading: 4582.3,
    unit: 'm³',
    status: 'warning',
    status: 'warning',
    lastUpdate: '15 min ago'
  },
  { 
    id: 'm5',
    name: 'Water Main Meter',
    location: 'Utility Room',
    type: 'Water',
    lastReading: 3254.6,
    unit: 'm³',
    status: 'online',
    lastUpdate: '5 min ago'
  },
  { 
    id: 'm6',
    name: 'Office Level 1 Submeter',
    location: '1st Floor',
    type: 'Electric',
    lastReading: 8752.3,
    unit: 'kWh',
    status: 'online',
    lastUpdate: '4 min ago'
  },
  { 
    id: 'm7',
    name: 'Office Level 2 Submeter',
    location: '2nd Floor',
    type: 'Electric',
    lastReading: 7982.1,
    unit: 'kWh',
    status: 'offline',
    lastUpdate: '2 hours ago'
  },
  { 
    id: 'm8',
    name: 'Data Center Meter',
    location: 'Server Room',
    type: 'Electric',
    lastReading: 19842.5,
    unit: 'kWh',
    status: 'online',
    lastUpdate: '1 min ago'
  }
];

const readingsData = [
  { timestamp: '00:00', main: 42, solar: 0, hvac: 18, office: 12, datacenter: 22 },
  { timestamp: '01:00', main: 38, solar: 0, hvac: 15, office: 8, datacenter: 21 },
  { timestamp: '02:00', main: 35, solar: 0, hvac: 14, office: 6, datacenter: 21 },
  { timestamp: '03:00', main: 32, solar: 0, hvac: 12, office: 5, datacenter: 20 },
  { timestamp: '04:00', main: 35, solar: 0, hvac: 14, office: 6, datacenter: 20 },
  { timestamp: '05:00', main: 48, solar: 0, hvac: 20, office: 9, datacenter: 20 },
  { timestamp: '06:00', main: 65, solar: 1, hvac: 28, office: 15, datacenter: 21 },
  { timestamp: '07:00', main: 87, solar: 5, hvac: 35, office: 26, datacenter: 21 },
  { timestamp: '08:00', main: 125, solar: 15, hvac: 45, office: 42, datacenter: 23 },
  { timestamp: '09:00', main: 145, solar: 25, hvac: 48, office: 48, datacenter: 24 },
  { timestamp: '10:00', main: 152, solar: 35, hvac: 50, office: 52, datacenter: 25 },
  { timestamp: '11:00', main: 148, solar: 42, hvac: 48, office: 50, datacenter: 24 },
  { timestamp: '12:00', main: 142, solar: 45, hvac: 45, office: 48, datacenter: 24 },
  { timestamp: '13:00', main: 138, solar: 42, hvac: 44, office: 45, datacenter: 23 },
  { timestamp: '14:00', main: 135, solar: 38, hvac: 42, office: 44, datacenter: 23 },
  { timestamp: '15:00', main: 132, solar: 32, hvac: 40, office: 42, datacenter: 22 },
  { timestamp: '16:00', main: 138, solar: 25, hvac: 42, office: 45, datacenter: 22 },
  { timestamp: '17:00', main: 148, solar: 18, hvac: 48, office: 50, datacenter: 22 },
  { timestamp: '18:00', main: 158, solar: 8, hvac: 52, office: 55, datacenter: 23 },
  { timestamp: '19:00', main: 152, solar: 2, hvac: 50, office: 52, datacenter: 23 },
  { timestamp: '20:00', main: 145, solar: 0, hvac: 48, office: 47, datacenter: 22 },
  { timestamp: '21:00', main: 132, solar: 0, hvac: 45, office: 42, datacenter: 22 },
  { timestamp: '22:00', main: 112, solar: 0, hvac: 40, office: 32, datacenter: 21 },
  { timestamp: '23:00', main: 78, solar: 0, hvac: 32, office: 18, datacenter: 21 }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
    case 'offline':
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Offline</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const MeterReadingsPage = () => {
  const [date, setDate] = useState<DateRange>({
    from: new Date(2023, 3, 1),
    to: new Date(2023, 3, 7)
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeters, setSelectedMeters] = useState<string[]>(['main', 'solar', 'hvac']);

  const filteredMeters = meterData.filter(meter => 
    meter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meter.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meter.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMeter = (meterId: string) => {
    if (selectedMeters.includes(meterId)) {
      setSelectedMeters(selectedMeters.filter(id => id !== meterId));
    } else {
      setSelectedMeters([...selectedMeters, meterId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Meter Readings
          </h1>
          <p className="text-muted-foreground">Monitor real-time meter readings and analyze consumption</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md">
            <Button variant="ghost" className="px-3 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">
                {date.from ? date.from.toLocaleDateString() : 'Select'} - 
                {date.to ? date.to.toLocaleDateString() : 'date'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Meter
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meters by name, location or type..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>
      
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Meter List</TabsTrigger>
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
          <TabsTrigger value="readings">Latest Readings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Meter Name</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Location</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Type</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>Last Reading</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.map((meter) => (
                      <TableRow key={meter.id}>
                        <TableCell className="font-medium">{meter.name}</TableCell>
                        <TableCell>{meter.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{meter.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {meter.lastReading.toLocaleString()} {meter.unit}
                        </TableCell>
                        <TableCell>{getStatusBadge(meter.status)}</TableCell>
                        <TableCell>{meter.lastUpdate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Electricity Consumption Trends</CardTitle>
              <CardDescription>24-hour consumption pattern for selected meters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedMeters.includes('main') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleMeter('main')}
                >
                  Main Electric
                </Badge>
                <Badge 
                  variant={selectedMeters.includes('solar') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleMeter('solar')}
                >
                  Solar Generation
                </Badge>
                <Badge 
                  variant={selectedMeters.includes('hvac') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleMeter('hvac')}
                >
                  HVAC
                </Badge>
                <Badge 
                  variant={selectedMeters.includes('office') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleMeter('office')}
                >
                  Office Floors
                </Badge>
                <Badge 
                  variant={selectedMeters.includes('datacenter') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleMeter('datacenter')}
                >
                  Data Center
                </Badge>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={readingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 12 }}
                      interval={2}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    {selectedMeters.includes('main') && (
                      <Line 
                        type="monotone" 
                        dataKey="main" 
                        name="Main Electric" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {selectedMeters.includes('solar') && (
                      <Line 
                        type="monotone" 
                        dataKey="solar" 
                        name="Solar Generation" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {selectedMeters.includes('hvac') && (
                      <Line 
                        type="monotone" 
                        dataKey="hvac" 
                        name="HVAC" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {selectedMeters.includes('office') && (
                      <Line 
                        type="monotone" 
                        dataKey="office" 
                        name="Office Floors" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {selectedMeters.includes('datacenter') && (
                      <Line 
                        type="monotone" 
                        dataKey="datacenter" 
                        name="Data Center" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Energy Consumption by Source</CardTitle>
              <CardDescription>Stacked area chart showing consumption distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={readingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 12 }}
                      interval={2}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="datacenter" 
                      name="Data Center" 
                      stackId="1"
                      stroke="#ec4899" 
                      fill="#ec4899" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="office" 
                      name="Office Floors" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hvac" 
                      name="HVAC" 
                      stackId="1"
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="solar" 
                      name="Solar (Generated)" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="readings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Main Electric</CardTitle>
                <CardDescription>Total building consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 font-mono">45,782.4 kWh</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Demand:</span>
                  <span className="font-medium">142 kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Usage:</span>
                  <span className="font-medium">1,245 kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">2 min ago</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Solar Generation</CardTitle>
                <CardDescription>Renewable energy produced</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 font-mono">12,845.7 kWh</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Output:</span>
                  <span className="font-medium">35 kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Generation:</span>
                  <span className="font-medium">215 kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">92%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">HVAC Systems</CardTitle>
                <CardDescription>Climate control consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 font-mono">15,421.8 kWh</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Load:</span>
                  <span className="font-medium">48 kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Usage:</span>
                  <span className="font-medium">426 kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Percentage of Total:</span>
                  <span className="font-medium">34%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Data Center</CardTitle>
                <CardDescription>IT infrastructure consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 font-mono">19,842.5 kWh</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Load:</span>
                  <span className="font-medium">22 kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Usage:</span>
                  <span className="font-medium">528 kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PUE:</span>
                  <span className="font-medium">1.42</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Real-time Readings</CardTitle>
              <CardDescription>Last 24 hours of consumption data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Main (kWh)</TableHead>
                      <TableHead className="text-right">Solar (kWh)</TableHead>
                      <TableHead className="text-right">HVAC (kWh)</TableHead>
                      <TableHead className="text-right">Office (kWh)</TableHead>
                      <TableHead className="text-right">Data Center (kWh)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readingsData.slice().reverse().map((reading, index) => (
                      <TableRow key={index}>
                        <TableCell>{reading.timestamp}</TableCell>
                        <TableCell className="text-right font-mono">{reading.main}</TableCell>
                        <TableCell className="text-right font-mono">{reading.solar}</TableCell>
                        <TableCell className="text-right font-mono">{reading.hvac}</TableCell>
                        <TableCell className="text-right font-mono">{reading.office}</TableCell>
                        <TableCell className="text-right font-mono">{reading.datacenter}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeterReadingsPage;
