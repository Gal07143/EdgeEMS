import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EVChargerDevice, OCPPStatus } from '@/types/energy'; // Use the extended type
import { Badge } from '@/components/ui/badge';
import { BatteryCharging, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

// Mock data for EV Chargers (replace with actual data fetching later)
const mockChargers: EVChargerDevice[] = [
  {
    id: 'evc-001',
    name: 'Main Entrance Charger 1',
    type: 'ev_charger',
    status: 'online',
    last_seen: new Date(Date.now() - 60000).toISOString(),
    connectorType: 'Type 2',
    chargeLevel: 2,
    maxPowerKw: 22,
    ocppStatus: 'Available',
    currentSession: undefined,
    location: 'Parking Lot A',
  },
  {
    id: 'evc-002',
    name: 'Staff Parking Charger',
    type: 'ev_charger',
    status: 'online',
    last_seen: new Date().toISOString(),
    connectorType: 'CCS',
    chargeLevel: 3,
    maxPowerKw: 50,
    ocppStatus: 'Charging',
    currentSession: {
      sessionId: 'sess-123',
      startTime: new Date(Date.now() - 30 * 60000).toISOString(), // Started 30 mins ago
      energyConsumedKwh: 15.5,
      currentState: 'Charging',
      vehicleId: 'Tesla Model Y'
    },
    location: 'Basement Level 2',
  },
  {
    id: 'evc-003',
    name: 'Visitor Parking Fast Charger',
    type: 'ev_charger',
    status: 'error',
    last_seen: new Date(Date.now() - 5 * 60000).toISOString(),
    connectorType: 'CHAdeMO',
    chargeLevel: 3,
    maxPowerKw: 60,
    ocppStatus: 'Faulted',
    location: 'Parking Lot B',
  },
  {
    id: 'evc-004',
    name: 'Loading Bay Charger',
    type: 'ev_charger',
    status: 'offline',
    last_seen: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    connectorType: 'Type 1',
    chargeLevel: 2,
    maxPowerKw: 7.4,
    ocppStatus: 'Unavailable',
    location: 'Loading Bay',
  },
];

// Helper to get badge variant based on OCPP status
const getStatusBadgeVariant = (status?: OCPPStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Charging':
      return 'default';
    case 'Available':
      return 'secondary'; // Use secondary for available (like success)
    case 'Faulted':
    case 'Unavailable':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper to get icon based on OCPP status
const getStatusIcon = (status?: OCPPStatus): React.ReactNode => {
  switch (status) {
    case 'Charging':
      return <BatteryCharging className="h-4 w-4 text-blue-500" />;
    case 'Available':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Faulted':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'Unavailable':
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-400" />;
  }
};

// Define props type explicitly to avoid issues with implicit 'key'
interface EVChargerCardProps {
  charger: EVChargerDevice;
}

const EVChargerCard: React.FC<EVChargerCardProps> = ({ charger }) => {
  // Ensure Card components are used correctly
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {charger.name}
        </CardTitle>
        {getStatusIcon(charger.ocppStatus)}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">ID: {charger.id}</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant={getStatusBadgeVariant(charger.ocppStatus)}>
              {charger.ocppStatus || 'Unknown'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span>Level {charger.chargeLevel} ({charger.connectorType})</span>
          </div>
          <div className="flex justify-between">
            <span>Max Power:</span>
            <span>{charger.maxPowerKw} kW</span>
          </div>
          {charger.location && (
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{charger.location}</span>
            </div>
          )}
          {charger.currentSession && (
            <div className="mt-2 border-t pt-2">
              <p className="text-xs font-semibold mb-1">Active Session:</p>
              <div className="flex justify-between text-xs">
                <span>Vehicle:</span>
                <span>{charger.currentSession.vehicleId || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Consumed:</span>
                <span>{charger.currentSession.energyConsumedKwh.toFixed(1)} kWh</span>
              </div>
               <div className="flex justify-between text-xs">
                <span>State:</span>
                 <span className="font-medium">{charger.currentSession.currentState}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EVChargersPage: React.FC = () => {
  // TODO: Replace mockChargers with actual data fetching (e.g., from DeviceContext or API)
  const chargers = mockChargers;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">EV Charging Stations</h1>
      
      {chargers.length === 0 ? (
        <p>No EV chargers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {chargers.map((charger) => (
            // Pass key here for React list reconciliation, but it's not a prop of EVChargerCard
            <EVChargerCard key={charger.id} charger={charger} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default EVChargersPage; 