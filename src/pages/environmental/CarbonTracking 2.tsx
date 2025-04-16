
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronDown, Download, Info, Leaf } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const emissionsBySource = [
  { name: 'Electricity', value: 62 },
  { name: 'Natural Gas', value: 18 },
  { name: 'Transportation', value: 12 },
  { name: 'Waste', value: 5 },
  { name: 'Water', value: 3 }
];

const monthlyEmissionsData = [
  { month: 'Jan', emissions: 125, target: 130 },
  { month: 'Feb', emissions: 118, target: 128 },
  { month: 'Mar', emissions: 122, target: 126 },
  { month: 'Apr', emissions: 115, target: 124 },
  { month: 'May', emissions: 120, target: 122 },
  { month: 'Jun', emissions: 130, target: 120 },
  { month: 'Jul', emissions: 142, target: 118 },
  { month: 'Aug', emissions: 135, target: 116 },
  { month: 'Sep', emissions: 125, target: 114 },
  { month: 'Oct', emissions: 116, target: 112 },
  { month: 'Nov', emissions: 110, target: 110 },
  { month: 'Dec', emissions: 105, target: 108 }
];

const facilitiesData = [
  { name: 'Headquarters', emissions: 145, yoy: -5.2, energyIntensity: 124 },
  { name: 'Manufacturing Plant', emissions: 320, yoy: 1.8, energyIntensity: 210 },
  { name: 'Distribution Center', emissions: 105, yoy: -12.4, energyIntensity: 98 },
  { name: 'Research Lab', emissions: 76, yoy: -8.6, energyIntensity: 112 },
  { name: 'Data Center', emissions: 210, yoy: 3.2, energyIntensity: 185 }
];

const offsetData = [
  { month: 'Jan', purchased: 25, generated: 10 },
  { month: 'Feb', purchased: 25, generated: 12 },
  { month: 'Mar', purchased: 25, generated: 15 },
  { month: 'Apr', purchased: 25, generated: 18 },
  { month: 'May', purchased: 30, generated: 22 },
  { month: 'Jun', purchased: 30, generated: 28 },
  { month: 'Jul', purchased: 30, generated: 32 },
  { month: 'Aug', purchased: 30, generated: 30 },
  { month: 'Sep', purchased: 25, generated: 24 },
  { month: 'Oct', purchased: 25, generated: 18 },
  { month: 'Nov', purchased: 25, generated: 14 },
  { month: 'Dec', purchased: 25, generated: 12 }
];

const CarbonTrackingPage = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [facility, setFacility] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Carbon Emissions Tracking
          </h1>
          <p className="text-muted-foreground">Monitor and analyze your organization's carbon footprint</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={facility} onValueChange={setFacility}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              <SelectItem value="hq">Headquarters</SelectItem>
              <SelectItem value="manufacturing">Manufacturing Plant</SelectItem>
              <SelectItem value="distribution">Distribution Center</SelectItem>
              <SelectItem value="lab">Research Lab</SelectItem>
              <SelectItem value="datacenter">Data Center</SelectItem>
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
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Emissions</CardTitle>
            <CardDescription>Annual carbon footprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">856 tonnes</div>
              <div className="ml-2 text-sm text-red-500">+2.4%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">CO₂ equivalent</div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Annual Target:</span>
                <span className="font-medium">820 tonnes</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-medium text-red-500">+36 tonnes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Energy Intensity</CardTitle>
            <CardDescription>Emissions per output unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">24.8 kg</div>
              <div className="ml-2 text-sm text-green-500">-3.2%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">CO₂e per unit</div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Industry Average:</span>
                <span className="font-medium">27.5 kg</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Best in Class:</span>
                <span className="font-medium">18.2 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Carbon Offsets</CardTitle>
            <CardDescription>Monthly average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">45 tonnes</div>
              <div className="ml-2 text-sm text-green-500">+15.4%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">CO₂ offset monthly</div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Purchased Credits:</span>
                <span className="font-medium">320 tonnes</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Renewable Generation:</span>
                <span className="font-medium">220 tonnes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Carbon</CardTitle>
            <CardDescription>After offsets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">316 tonnes</div>
              <div className="ml-2 text-sm text-green-500">-8.3%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Net annual emissions</div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">5-Year Target:</span>
                <span className="font-medium">Net Zero</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Reduction Rate:</span>
                <span className="font-medium text-green-500">-8.3%/year</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert variant="info">
        <Info className="h-4 w-4 mt-0.5" />
        <AlertTitle>Carbon Reduction Progress</AlertTitle>
        <AlertDescription>
          Your organization is making progress towards carbon reduction goals, but emissions are still 
          4.4% above target. Consider increasing renewable energy usage in your data center and manufacturing plant.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Emission Sources</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="offsets">Carbon Offsets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Monthly Carbon Emissions</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === 'year' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTimeRange('year')}
                >
                  Year to Date
                </Button>
                <Button 
                  variant={timeRange === 'last-year' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTimeRange('last-year')}
                >
                  Previous Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyEmissionsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }} 
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
                    <Line 
                      type="monotone" 
                      dataKey="emissions" 
                      name="CO₂ Emissions (tonnes)" 
                      stroke="#ef4444" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Emissions Target" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Previous Year</div>
                      <div className="text-2xl font-semibold mt-1">835 tonnes</div>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Current Year</div>
                      <div className="text-2xl font-semibold mt-1">856 tonnes</div>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Change</div>
                      <div className="text-2xl font-semibold text-red-500 mt-1">+2.4%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-medium mb-2">Contributing Factors</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                        <span>Data center power consumption increased by 15% due to new servers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                        <span>Manufacturing output increased by 8% with corresponding emissions increase</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Solar generation offset increased by 28% following panel expansion</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Headquarters emissions reduced by 5% due to HVAC optimization</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Carbon Reduction Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Solar Panel Expansion</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phase 2 of panel installation complete, generating 35% more renewable energy.
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Completed
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">March 2023</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">HVAC Optimization Program</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI-driven optimization reducing HVAC energy use by 12% at headquarters.
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          In Progress
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">85% Complete</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Manufacturing Process Redesign</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Redesigning production line to reduce energy intensity by estimated 18%.
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          Planned
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">Starting Q3 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Emissions by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emissionsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {emissionsBySource.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 15, 15, 0.8)',
                          borderColor: 'rgba(82, 82, 82, 0.2)',
                          borderRadius: '6px',
                        }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Source Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <h4 className="font-medium">Electricity</h4>
                      </div>
                      <Badge>531 tonnes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Grid electricity accounts for 62% of total emissions. 
                      25% from renewable sources.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <h4 className="font-medium">Natural Gas</h4>
                      </div>
                      <Badge>154 tonnes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Used primarily for heating and certain manufacturing processes.
                      18% of total emissions.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <h4 className="font-medium">Transportation</h4>
                      </div>
                      <Badge>103 tonnes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Company fleet and logistics operations.
                      12% of total emissions.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <h4 className="font-medium">Other Sources</h4>
                      </div>
                      <Badge>68 tonnes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Includes waste management (5%) and water treatment (3%).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Direct vs. Indirect Emissions</CardTitle>
              <CardDescription>Scope 1, 2, and 3 breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Scope 1 (Direct)</h3>
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                      205 tonnes
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Emissions from company-owned sources</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Natural gas combustion</li>
                      <li>Company vehicle fleet</li>
                      <li>Refrigerant leaks</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex-1 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Scope 2 (Indirect)</h3>
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      485 tonnes
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Emissions from purchased energy</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Grid electricity</li>
                      <li>Purchased steam</li>
                      <li>District cooling</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex-1 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Scope 3 (Value Chain)</h3>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      166 tonnes
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Emissions from upstream/downstream activities</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Business travel</li>
                      <li>Employee commuting</li>
                      <li>Waste disposal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facilities" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Emissions by Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={facilitiesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
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
                    <Bar dataKey="emissions" name="CO₂ Emissions (tonnes)" fill="#ef4444" />
                    <Bar dataKey="energyIntensity" name="Energy Intensity" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facilitiesData.map((facility, index) => (
              <Card key={index} className="backdrop-blur-sm bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <CardDescription>Facility emissions profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Total Emissions</span>
                        <span className="text-sm font-medium">{facility.emissions} tonnes</span>
                      </div>
                      <div className="h-2 rounded-full bg-primary/10">
                        <div 
                          className="h-2 rounded-full bg-primary" 
                          style={{ width: `${(facility.emissions / 320) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Energy Intensity</span>
                        <span className="text-sm font-medium">{facility.energyIntensity} kWh/m²</span>
                      </div>
                      <div className="h-2 rounded-full bg-blue-500/10">
                        <div 
                          className="h-2 rounded-full bg-blue-500" 
                          style={{ width: `${(facility.energyIntensity / 210) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Year-over-Year</span>
                        <span className={`text-sm font-medium ${facility.yoy < 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {facility.yoy > 0 ? '+' : ''}{facility.yoy}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2 mt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="offsets" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Carbon Offset Activities</CardTitle>
              <CardDescription>Purchased credits and renewable generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={offsetData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }} 
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
                    <Bar 
                      dataKey="purchased" 
                      name="Purchased Offsets" 
                      stackId="a" 
                      fill="#8b5cf6" 
                    />
                    <Bar 
                      dataKey="generated" 
                      name="Renewable Generation" 
                      stackId="a" 
                      fill="#10b981" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Carbon Offset Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Reforestation Project</h3>
                      <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        180 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supporting reforestation efforts in the Amazon rainforest.
                      Verified by Gold Standard certification.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Project ID: GS-1021-2023</span>
                      <span>Verified: Yes</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Wind Farm Investment</h3>
                      <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        120 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Investment in wind farm development in Iowa.
                      Certified by Climate Action Reserve.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Project ID: CAR-982-2023</span>
                      <span>Verified: Yes</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Clean Cooking Initiative</h3>
                      <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        65 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Providing clean cooking solutions in developing regions.
                      Verified Carbon Standard certification.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Project ID: VCS-475-2023</span>
                      <span>Verified: Yes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Renewable Generation Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Solar Array - Headquarters</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        120 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      350kW roof-mounted solar PV system.
                      Annual generation: 420 MWh.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">Installed: 2021</span>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Solar Carports - Parking</h3>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        75 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      220kW carport-mounted solar PV system.
                      Annual generation: 265 MWh.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">Installed: 2022</span>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Wind Turbine - Manufacturing</h3>
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        25 tonnes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      100kW on-site wind turbine.
                      Annual generation: 110 MWh.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">Installed: 2023</span>
                      <span className="text-xs font-medium text-amber-500">Commissioning</span>
                    </div>
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

export default CarbonTrackingPage;
