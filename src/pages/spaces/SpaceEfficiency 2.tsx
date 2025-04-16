
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { CalendarIcon, ChevronDown, Download, Building2, TrendingUp } from 'lucide-react';

const buildingData = [
  {
    id: 'b1',
    name: 'Headquarters',
    size: 15000,
    occupants: 420,
    efficiency: 92,
    consumption: 78,
    yearBuilt: 2015
  },
  {
    id: 'b2',
    name: 'Manufacturing Plant',
    size: 28000,
    occupants: 210,
    efficiency: 78,
    consumption: 130,
    yearBuilt: 2012
  },
  {
    id: 'b3',
    name: 'Research Center',
    size: 8500,
    occupants: 95,
    efficiency: 88,
    consumption: 65,
    yearBuilt: 2018
  },
  {
    id: 'b4',
    name: 'Distribution Center',
    size: 18000,
    occupants: 45,
    efficiency: 75,
    consumption: 112,
    yearBuilt: 2010
  },
  {
    id: 'b5',
    name: 'Data Center',
    size: 5000,
    occupants: 15,
    efficiency: 81,
    consumption: 210,
    yearBuilt: 2020
  }
];

const floorData = [
  { floor: '1st Floor', consumption: 32, area: 3800, occupancy: 155, equipment: 42 },
  { floor: '2nd Floor', consumption: 28, area: 3800, occupancy: 140, equipment: 38 },
  { floor: '3rd Floor', consumption: 26, area: 3800, occupancy: 125, equipment: 35 },
  { floor: '4th Floor', consumption: 22, area: 3600, occupancy: 0, equipment: 20 }
];

const monthlyData = [
  { month: 'Jan', efficiency: 85, benchmark: 76 },
  { month: 'Feb', efficiency: 87, benchmark: 76 },
  { month: 'Mar', efficiency: 86, benchmark: 77 },
  { month: 'Apr', efficiency: 89, benchmark: 78 },
  { month: 'May', efficiency: 90, benchmark: 79 },
  { month: 'Jun', efficiency: 92, benchmark: 79 },
  { month: 'Jul', efficiency: 91, benchmark: 80 },
  { month: 'Aug', efficiency: 90, benchmark: 79 },
  { month: 'Sep', efficiency: 89, benchmark: 79 },
  { month: 'Oct', efficiency: 88, benchmark: 78 },
  { month: 'Nov', efficiency: 88, benchmark: 77 },
  { month: 'Dec', efficiency: 87, benchmark: 76 }
];

const equipmentData = [
  { category: 'HVAC', count: 32, avgEfficiency: 86, energyUsage: 45 },
  { category: 'Lighting', count: 420, avgEfficiency: 92, energyUsage: 22 },
  { category: 'IT', count: 210, avgEfficiency: 88, energyUsage: 18 },
  { category: 'Kitchen', count: 15, avgEfficiency: 78, energyUsage: 8 },
  { category: 'Other', count: 45, avgEfficiency: 82, energyUsage: 7 }
];

const SpaceEfficiencyPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Space Efficiency Analysis
          </h1>
          <p className="text-muted-foreground">Analyze energy efficiency across different spaces</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="hq">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hq">Headquarters</SelectItem>
              <SelectItem value="mfg">Manufacturing Plant</SelectItem>
              <SelectItem value="rc">Research Center</SelectItem>
              <SelectItem value="dc">Distribution Center</SelectItem>
              <SelectItem value="dt">Data Center</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button variant="ghost" className="px-3 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">2023</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Energy Efficiency Score</CardTitle>
            <CardDescription>Building performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="relative h-20 w-20 mr-4">
                <svg className="h-20 w-20" viewBox="0 0 36 36">
                  <path
                    className="stroke-primary/10"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="text-base font-medium text-center">
                    92%
                  </text>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">A+</div>
                <div className="text-sm text-muted-foreground">Energy rating</div>
                <div className="text-sm text-green-500 mt-1">+5 pts last quarter</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Energy Intensity</CardTitle>
            <CardDescription>Per square meter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">78 kWh/m²</div>
                <div className="text-sm text-muted-foreground">Annual consumption</div>
                <div className="text-sm text-green-500 mt-1">12% below average</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Occupant Density</CardTitle>
            <CardDescription>Space utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                  <path 
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M18 14C19.6569 14 21 15.3431 21 17C21 18.6569 19.6569 20 18 20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M6 8C4.34315 8 3 6.65685 3 5C3 3.34315 4.34315 2 6 2" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M6 14C4.34315 14 3 15.3431 3 17C3 18.6569 4.34315 20 6 20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">28 m²</div>
                <div className="text-sm text-muted-foreground">Per occupant</div>
                <div className="text-sm text-amber-500 mt-1">5% above target</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Space Utilization</CardTitle>
            <CardDescription>Average occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Utilization rate</div>
                <div className="text-sm text-green-500 mt-1">+12% year-over-year</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="buildings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="floors">Floors</TabsTrigger>
          <TabsTrigger value="trends">Efficiency Trends</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buildings" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Building Efficiency Comparison</CardTitle>
              <CardDescription>Analysis across all facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={buildingData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} orientation="left" stroke="#10b981" />
                    <YAxis yAxisId="right" tick={{ fontSize: 12 }} orientation="right" stroke="#3b82f6" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="efficiency" 
                      name="Efficiency Score (%)" 
                      fill="#10b981" 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="consumption" 
                      name="Energy Intensity (kWh/m²)" 
                      fill="#3b82f6" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Building Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building Name</TableHead>
                      <TableHead className="text-right">Size (m²)</TableHead>
                      <TableHead className="text-right">Occupants</TableHead>
                      <TableHead className="text-right">Efficiency Score</TableHead>
                      <TableHead className="text-right">Energy Intensity</TableHead>
                      <TableHead className="text-right">Year Built</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buildingData.map((building) => (
                      <TableRow key={building.id}>
                        <TableCell className="font-medium">{building.name}</TableCell>
                        <TableCell className="text-right">{building.size.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{building.occupants}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            building.efficiency >= 90 ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            building.efficiency >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }>
                            {building.efficiency}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{building.consumption} kWh/m²</TableCell>
                        <TableCell className="text-right">{building.yearBuilt}</TableCell>
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
        
        <TabsContent value="floors" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Headquarters - Floor Analysis</CardTitle>
              <CardDescription>Energy consumption by floor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={floorData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="floor" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="consumption" name="Energy Use (kWh/m²)" fill="#3b82f6" />
                    <Bar dataKey="occupancy" name="Occupancy" fill="#10b981" />
                    <Bar dataKey="equipment" name="Equipment Count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Floor Space Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {floorData.map((floor, index) => (
                    <div key={index} className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{floor.floor}</h3>
                        <div className="flex items-center">
                          <Badge className="mr-2">
                            {floor.area} m²
                          </Badge>
                          {floor.occupancy > 0 ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              Occupied
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              Vacant
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Occupancy
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-base font-medium">
                              {floor.occupancy} people
                            </div>
                            <div className="text-sm">
                              {Math.round(floor.area / (floor.occupancy || 1))} m²/person
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Energy Use
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-base font-medium">
                              {floor.consumption} kWh/m²
                            </div>
                            <div className="text-sm">
                              {floor.equipment} devices
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Space Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Workspaces', value: 60 },
                          { name: 'Meeting Rooms', value: 15 },
                          { name: 'Common Areas', value: 10 },
                          { name: 'Storage', value: 5 },
                          { name: 'Utilities', value: 10 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#ec4899" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 15, 15, 0.8)',
                          borderColor: 'rgba(82, 82, 82, 0.2)',
                          borderRadius: '6px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Efficiency Trend Analysis</CardTitle>
              <CardDescription>Monthly efficiency score vs. industry benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[50, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      name="Headquarters Efficiency" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      name="Industry Benchmark" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Seasonal Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Summer (Jun-Aug)</h3>
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        +15%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cooling load increases energy intensity by 15% during summer months.
                      Peak demand typically occurs between 1-4 PM.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Winter (Dec-Feb)</h3>
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        +12%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Heating requirements increase energy consumption by 12% during 
                      winter months. Morning hours show highest demand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Occupancy Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Weekday vs Weekend</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        -42%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Weekend energy consumption reduced by 42% compared to weekdays 
                      due to lower occupancy. Further optimization possible.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Occupancy Correlation</h3>
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        0.78
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strong correlation (r=0.78) between occupancy levels and energy 
                      consumption. Occupant behavior influences 35% of variations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Efficiency Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">2022 vs 2023</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        +8.5%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Building efficiency score improved by 8.5% year-over-year due to
                      HVAC optimization and lighting retrofits.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">ROI Analysis</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        2.3 years
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Energy efficiency investments show an average payback period of 
                      2.3 years, with lighting upgrades performing best (1.5 years).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="equipment" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Equipment Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={equipmentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Equipment Count" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="energyUsage" name="Energy Usage (%)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Equipment Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-right">Efficiency</TableHead>
                        <TableHead className="text-right">Energy Usage</TableHead>
                        <TableHead className="text-right">Potential Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              item.avgEfficiency >= 90 ? "bg-green-500/10 text-green-500 border-green-500/20" :
                              item.avgEfficiency >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                              "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }>
                              {item.avgEfficiency}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{item.energyUsage}%</TableCell>
                          <TableCell className="text-right">
                            {(100 - item.avgEfficiency) / 5 > 1 ? 
                              `${((100 - item.avgEfficiency) / 5 * item.energyUsage / 100).toFixed(1)}%` : 
                              'Minimal'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Suggested Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">HVAC Schedule Adjustment</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        8% savings
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Optimize HVAC operating schedules based on occupancy patterns. 
                      Potential energy savings of 8% with minimal capital investment.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Lighting Control Upgrade</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        12% savings
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Implement occupancy-based lighting controls and daylight harvesting.
                      Estimated 12% reduction in lighting energy consumption.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">IT Equipment Power Management</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        5% savings
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure aggressive power management settings for IT equipment.
                      Potential 5% reduction in overall building electricity use.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceEfficiencyPage;
