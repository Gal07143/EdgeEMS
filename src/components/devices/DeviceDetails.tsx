import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartLegend, AreaChart, LineChart } from '@/components/ui/chart';
import { AlertTriangle, Activity, Battery, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Device, TelemetryData } from '@/types/device';
import { MLService, MLServiceConfig } from '@/services/mlService';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceDetailsProps {
  deviceId: string;
}

const sampleTelemetryData = [
  { id: "1", device_id: "demo-device", timestamp: '2023-04-14T08:00:00', measurement: 'power', value: 45, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "2", device_id: "demo-device", timestamp: '2023-04-14T09:00:00', measurement: 'power', value: 52, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "3", device_id: "demo-device", timestamp: '2023-04-14T10:00:00', measurement: 'power', value: 58, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "4", device_id: "demo-device", timestamp: '2023-04-14T11:00:00', measurement: 'power', value: 63, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "5", device_id: "demo-device", timestamp: '2023-04-14T12:00:00', measurement: 'power', value: 72, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "6", device_id: "demo-device", timestamp: '2023-04-14T13:00:00', measurement: 'power', value: 68, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "7", device_id: "demo-device", timestamp: '2023-04-14T14:00:00', measurement: 'power', value: 65, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { id: "8", device_id: "demo-device", timestamp: '2023-04-14T15:00:00', measurement: 'power', value: 61, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
];

const sampleDevice: Device = {
  id: 'demo-device',
  name: 'Smart Meter',
  type: 'meter',
  status: 'online',
  manufacturer: 'EnergyTech',
  model: 'PowerMeter Pro',
  location: 'Main Building',
  last_seen: '2023-04-14T15:30:00',
  lastSeen: '2023-04-14T15:30:00', // Added both versions for compatibility
  firmware: 'v2.1.5',
  firmware_version: 'v2.1.5', // Added both versions for compatibility
  capacity: 100,
  description: 'Main power meter for building A',
  created_at: '2023-01-01T00:00:00',
  updated_at: '2023-04-14T15:30:00',
  protocol: 'MQTT'
};

// Define Prediction and Anomaly types for clarity
interface PredictionPoint {
  timestamp: string | Date;
  prediction: number;
}

interface AnomalyPoint extends TelemetryData {
  anomalyScore: number;
  confidence: number;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ deviceId }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [mlService, setMlService] = useState<MLService | null>(null);
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState<string | null>(null);

  // Config (assuming one service handles both for now, might need splitting)
  const mlConfig: MLServiceConfig = {
    modelPath: `/models/${deviceId}-model`, // Example path
    inputShape: [24, 1], // Example shape (adjust based on actual model)
    outputShape: [1, 1], // Example shape
    featureNames: ['value'], // Example features
    modelType: 'onnx' // Example type
  };

  // Fetch device data
  useEffect(() => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setDevice(sampleDevice);
      setTelemetry(sampleTelemetryData); // Use sample data for now
      setLoading(false);
    }, 500);
  }, [deviceId]);

  // Initialize ML service
  useEffect(() => {
    let service: MLService | null = null;
    const initML = async () => {
      try {
        console.log("Initializing ML Service for", deviceId);
        service = new MLService(mlConfig);
        await service.initialize();
        setMlService(service);
        console.log("ML Service Initialized");
      } catch (error) {
        console.error('Error initializing ML service:', error);
        setMlError(error instanceof Error ? error.message : 'Failed to initialize ML service');
        setMlService(null); // Ensure service is null on error
      }
    };

    initML();

    // Cleanup function
    return () => {
      service?.dispose();
      console.log('Cleaning up ML service for', deviceId);
    };
  }, [deviceId]); // Re-init if deviceId changes

  // Run predictions and anomaly detection when service and data are ready
  useEffect(() => {
    if (mlService && telemetry.length > 0) {
      const runMLTasks = async () => {
        setMlLoading(true);
        setMlError(null);
        try {
          // --- Predictions --- 
          // Create future timestamps (e.g., next 6 hours)
          const lastTimestamp = new Date(telemetry[telemetry.length - 1].timestamp);
          const futureTimestamps = Array.from({ length: 6 }, (_, i) => 
            new Date(lastTimestamp.getTime() + (i + 1) * 60 * 60 * 1000).toISOString()
          );
          
          // Prepare input data (e.g., last 24h values)
          const predictionInput = telemetry.slice(-24).map(t => t.value); // Adjust as needed
          const predictedValues = await mlService.predictBehavior(predictionInput, futureTimestamps.length);
          
          const newPredictions: PredictionPoint[] = futureTimestamps.map((ts, i) => ({
            timestamp: ts,
            prediction: predictedValues[i] ?? 0 // Use predicted value or default
          }));
          setPredictions(newPredictions);
          console.log("Predictions generated:", newPredictions);

          // --- Anomaly Detection --- 
          // Run detection on recent telemetry
          const anomalyInput = telemetry.slice(-10); // Example: check last 10 points
          const detectedAnomalies: AnomalyPoint[] = [];
          for (const point of anomalyInput) {
              // Ideally, batch this if service supports it
              const result = await mlService.detectAnomalies([point.value]); // Pass relevant features
              if (result.anomalyScore > 0.7) { // Example threshold
                 detectedAnomalies.push({
                    ...point,
                    anomalyScore: result.anomalyScore,
                    confidence: result.confidence
                 });
              }
          }
          setAnomalies(detectedAnomalies);
          console.log("Anomalies detected:", detectedAnomalies);

        } catch (error) {
          console.error('Error running ML tasks:', error);
          setMlError(error instanceof Error ? error.message : 'Failed to run ML tasks');
          setPredictions([]);
          setAnomalies([]);
        } finally {
          setMlLoading(false);
        }
      };
      runMLTasks();
    }
  }, [mlService, telemetry]); // Rerun if service or telemetry changes

  if (loading || !device) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ); // Show skeleton loaders
  }

  // --- Render Logic --- 
  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{device.name}</CardTitle>
              <Badge variant={device.status === 'online' ? 'success' : 'destructive'}>
                {device.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="text-gray-500">Type:</span> {device.type}</p>
                <p><span className="text-gray-500">Manufacturer:</span> {device.manufacturer}</p>
                <p><span className="text-gray-500">Model:</span> {device.model}</p>
              </div>
              <div>
                <p><span className="text-gray-500">Location:</span> {device.location}</p>
                <p><span className="text-gray-500">Firmware:</span> {device.firmware || device.firmware_version}</p>
                <p><span className="text-gray-500">Last Seen:</span> {new Date(device.lastSeen || device.last_seen || '').toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="telemetry">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="health">Device Health</TabsTrigger>
          </TabsList>
          
          <TabsContent value="telemetry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return format(date, 'HH:mm');
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return format(date, 'PPpp');
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Current Power</p>
                    <p className="text-xl font-bold">{telemetry[telemetry.length - 1]?.value} kW</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Daily Average</p>
                    <p className="text-xl font-bold">
                      {(telemetry.reduce((sum, item) => sum + item.value, 0) / telemetry.length).toFixed(1)} kW
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Peak Power</p>
                    <p className="text-xl font-bold">
                      {Math.max(...telemetry.map(item => item.value))} kW
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Last Reading</p>
                    <p className="text-xl font-bold">
                      {format(new Date(telemetry[telemetry.length - 1]?.timestamp || new Date()), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Energy Forecast</CardTitle>
                {mlLoading && <p className="text-sm text-muted-foreground">Generating forecast...</p>}
                {mlError && <p className="text-sm text-red-500">Error: {mlError}</p>}
              </CardHeader>
              <CardContent>
                {predictions.length > 0 ? (
                  <>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictions}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                          />
                          <YAxis label={{ value: 'Predicted kW', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                             labelFormatter={(value) => format(new Date(value), 'PPpp')}
                             formatter={(value: number) => [`${value.toFixed(1)} kW`, 'Prediction']}
                          />
                          <Line type="monotone" dataKey="prediction" name="Forecast" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">{mlLoading ? 'Loading predictions...' : 'No prediction data available'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detected Anomalies</CardTitle>
                {mlLoading && <p className="text-sm text-muted-foreground">Checking for anomalies...</p>}
                {mlError && <p className="text-sm text-red-500">Error: {mlError}</p>}
              </CardHeader>
              <CardContent>
                {anomalies.length > 0 ? (
                  <div className="space-y-4">
                    {anomalies.map((anomaly) => (
                      <div key={anomaly.id} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border-l-4 border-red-500">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center">
                               <h4 className="font-medium">Anomaly Detected</h4>
                               <span className="text-xs text-muted-foreground">{format(new Date(anomaly.timestamp), 'PPpp')}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              Unusual value of <span className="font-semibold">{anomaly.value} {anomaly.unit}</span> detected for {anomaly.measurement}.
                            </p>
                            <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                               <span>Confidence: <Badge variant="destructive">{(anomaly.confidence * 100).toFixed(0)}%</Badge></span>
                               <span>Score: <Badge variant="secondary">{anomaly.anomalyScore.toFixed(2)}</Badge></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                     <p className="text-muted-foreground">{mlLoading ? 'Checking for anomalies...' : 'No anomalies detected in recent data.'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Connectivity</span>
                      <span className="text-green-500">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Data Quality</span>
                      <span className="text-green-500">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Battery</span>
                      <span className="text-amber-500">Fair</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Uptime</p>
                      <p className="text-xl font-bold">99.8%</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Firmware</p>
                      <p className="text-xl font-bold">{device.firmware || device.firmware_version}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Signal Strength</p>
                      <p className="text-xl font-bold">-67 dBm</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Last Check</p>
                      <p className="text-xl font-bold">2 mins ago</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h4 className="font-medium flex items-center">
                      <Battery className="h-4 w-4 mr-2" />
                      Maintenance Recommendation
                    </h4>
                    <p className="text-sm mt-2">
                      Battery replacement recommended within the next 3 months. Current degradation is at 32%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
};

// Keep only named export
export { DeviceDetails };
