import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BatteryDevice, BatteryBMSData, BatteryCellData, BMSAlert } from '@/types/energy';
import { Badge } from '@/components/ui/badge';
import { BatteryCharging, ThermometerSun, AlertTriangle, Gauge, Activity, List, Wifi } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Mock data for a single battery device (replace with actual data fetching)
const mockBattery: BatteryDevice = {
  id: 'bat-001',
  name: 'Main Backup Battery',
  type: 'battery',
  status: 'online',
  location: 'Utility Room',
  manufacturer: 'Tesla',
  model: 'Powerwall 2',
  installation_date: '2023-05-15T00:00:00Z',
  last_seen: new Date().toISOString(),
  chemistry: 'NMC',
  nominalCapacityKwh: 13.5,
  nominalVoltage: 400,
  bmsData: {
    stateOfCharge: 78.5,
    stateOfHealth: 98.2,
    cycleCount: 450,
    packVoltage: 402.1,
    packCurrent: -5.2, // Discharging
    averageTemperature: 28.5,
    minCellVoltage: 3.98,
    maxCellVoltage: 4.01,
    minCellTemperature: 26.8,
    maxCellTemperature: 29.1,
    balancingStatus: 'Inactive',
    communicationProtocol: 'CANbus',
    cellData: [
      { cellId: 1, voltage: 4.00, temperature: 28.0, balanceStatus: 'Idle' },
      { cellId: 2, voltage: 4.01, temperature: 28.2, balanceStatus: 'Idle' },
      { cellId: 3, voltage: 3.99, temperature: 27.9, balanceStatus: 'Idle' },
      // Add more cells as needed...
      { cellId: 16, voltage: 3.98, temperature: 28.5, balanceStatus: 'Idle' },
    ],
    activeAlerts: [
      { 
        code: 'UNDER_TEMPERATURE', 
        description: 'Cell temperature slightly below optimal range during previous night.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
        severity: 'info',
        cellId: 5 
      },
    ],
  }
};

// Helper component for BMS Alerts
const BMSAlertDisplay: React.FC<{ alert: BMSAlert }> = ({ alert }) => {
  const getSeverityVariant = (severity: 'critical' | 'warning' | 'info'): 'destructive' | 'secondary' | 'outline' => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
    }
  };
  return (
    <div className="text-xs p-2 border rounded mb-1 flex items-start gap-2">
      <AlertTriangle className={`h-4 w-4 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
      <div>
        <Badge variant={getSeverityVariant(alert.severity)} className="mb-1">{alert.severity.toUpperCase()}</Badge>
        <p className="font-medium">{alert.code}{alert.cellId ? ` (Cell ${alert.cellId})` : ''}</p>
        {alert.description && <p className="text-muted-foreground">{alert.description}</p>}
        <p className="text-muted-foreground text-[10px]">{new Date(alert.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

// Helper component for Cell Data Table
const BMSTable: React.FC<{ title: string; data: Array<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> }> = ({ title, data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm border-b pb-1 last:border-b-0">
            <span className="flex items-center gap-2 text-muted-foreground">
              {item.icon}
              {item.label}
            </span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const BatteryDetailsPage: React.FC = () => {
  // In a real app, use useParams to get batteryId and fetch data
  // const { batteryId } = useParams<{ batteryId: string }>();
  // const { data: battery, isLoading, error } = useFetchBatteryDetails(batteryId);
  
  // Using mock data for now
  const battery = mockBattery;
  const bms = battery.bmsData;

  if (!battery) {
    // Handle loading or error state
    return <div>Loading battery details...</div>; // Or show an error message
  }

  const generalData = [
    { label: 'Name', value: battery.name },
    { label: 'ID', value: battery.id },
    { label: 'Status', value: <Badge variant={battery.status === 'online' ? 'secondary' : battery.status === 'error' ? 'destructive' : 'outline'}>{battery.status}</Badge> },
    { label: 'Location', value: battery.location || 'N/A' },
    { label: 'Manufacturer', value: battery.manufacturer || 'N/A' },
    { label: 'Model', value: battery.model || 'N/A' },
    { label: 'Chemistry', value: battery.chemistry || 'N/A' },
    { label: 'Nominal Capacity', value: `${battery.nominalCapacityKwh} kWh` },
    { label: 'Nominal Voltage', value: battery.nominalVoltage ? `${battery.nominalVoltage} V` : 'N/A' },
    { label: 'Install Date', value: battery.installation_date ? new Date(battery.installation_date).toLocaleDateString() : 'N/A' },
    { label: 'Last Seen', value: battery.last_seen ? new Date(battery.last_seen).toLocaleString() : 'N/A' },
  ];

  const bmsOverviewData = bms ? [
    { label: 'State of Health', value: bms.stateOfHealth ? `${bms.stateOfHealth.toFixed(1)}%` : 'N/A', icon: <Gauge className="h-4 w-4"/> },
    { label: 'Cycle Count', value: bms.cycleCount ?? 'N/A', icon: <Activity className="h-4 w-4"/> },
    { label: 'Pack Voltage', value: bms.packVoltage ? `${bms.packVoltage.toFixed(1)} V` : 'N/A', icon: <Activity className="h-4 w-4" /> },
    { label: 'Pack Current', value: bms.packCurrent ? `${bms.packCurrent.toFixed(1)} A` : 'N/A', icon: <BatteryCharging className="h-4 w-4" /> },
    { label: 'Avg Temp', value: bms.averageTemperature ? `${bms.averageTemperature.toFixed(1)} °C` : 'N/A', icon: <ThermometerSun className="h-4 w-4" /> },
    { label: 'Cell Volt Range', value: (bms.minCellVoltage && bms.maxCellVoltage) ? `${bms.minCellVoltage.toFixed(2)} - ${bms.maxCellVoltage.toFixed(2)} V` : 'N/A', icon: <List className="h-4 w-4" /> },
    { label: 'Cell Temp Range', value: (bms.minCellTemperature && bms.maxCellTemperature) ? `${bms.minCellTemperature.toFixed(1)} - ${bms.maxCellTemperature.toFixed(1)} °C` : 'N/A', icon: <ThermometerSun className="h-4 w-4" /> },
    { label: 'Balancing', value: <Badge variant={bms.balancingStatus === 'Active' ? 'default' : 'outline'}>{bms.balancingStatus || 'N/A'}</Badge>, icon: <Activity className="h-4 w-4" /> },
    { label: 'Protocol', value: bms.communicationProtocol || 'N/A', icon: <Wifi className="h-4 w-4" /> },
  ] : [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Battery Details: {battery.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Info Card */}
        <div className="lg:col-span-1">
          <BMSTable title="General Information" data={generalData} />
        </div>

        {/* BMS Overview & SOC Card */}
        <div className="lg:col-span-2 space-y-6">
          {bms && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><BatteryCharging className="h-5 w-5"/> State of Charge</CardTitle>
                <CardDescription>Current battery charge level</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold mb-2">{bms.stateOfCharge.toFixed(1)}%</div>
                  <Progress value={bms.stateOfCharge} className="w-full h-3" />
              </CardContent>
            </Card>
          )}
          {bms && <BMSTable title="BMS Overview" data={bmsOverviewData} />}
        </div>
      </div>

      {/* BMS Alerts Card */}
      {bms?.activeAlerts && bms.activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> Active BMS Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {bms.activeAlerts.map((alert, index) => (
              <BMSAlertDisplay key={index} alert={alert} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Optional: Add Cell Details Table/Visualization here */}
      {/* {bms?.cellData && <CellDataTable cellData={bms.cellData} />} */}

    </div>
  );
};

export default BatteryDetailsPage; 