import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';

// --- Lazy load page components ---
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Devices = React.lazy(() => import('@/pages/devices'));
const Equipment = React.lazy(() => import('@/pages/equipment/Equipment'));
const StatusMonitor = React.lazy(() => import('@/pages/equipment/StatusMonitor'));
const EquipmentEfficiency = React.lazy(() => import('@/pages/equipment/Efficiency'));
const EquipmentLoadMonitoring = React.lazy(() => import('@/pages/equipment/LoadMonitoring'));
const EquipmentEmissions = React.lazy(() => import('@/pages/equipment/Emissions'));
const EquipmentCostAnalysis = React.lazy(() => import('@/pages/equipment/CostAnalysis'));
const EquipmentEnergyUsage = React.lazy(() => import('@/pages/equipment/EnergyUsage'));

const Analytics = React.lazy(() => import('@/pages/Analytics'));
const Settings = React.lazy(() => import('@/pages/settings'));

// Energy Management Pages
const EnergyManagement = React.lazy(() => import('@/pages/energy-management/EnergyManagement'));
const EnergyConsumption = React.lazy(() => import('@/pages/energy-management/Consumption'));
const EnergyCategories = React.lazy(() => import('@/pages/energy-management/Categories'));
const EnergyCostAnalysis = React.lazy(() => import('@/pages/energy-management/CostAnalysis'));
const EnergyEfficiency = React.lazy(() => import('@/pages/energy-management/Efficiency'));
const EnergySavings = React.lazy(() => import('@/pages/energy-management/Savings'));
const EnergyForecasting = React.lazy(() => import('@/pages/energy-management/Forecasting'));

// Meter Management Pages
const MeterManagement = React.lazy(() => import('@/pages/meters/Meters'));
const MeterReadings = React.lazy(() => import('@/pages/meters/MeterReadings'));
const MeterComparison = React.lazy(() => import('@/pages/meters/Comparison'));
const MeterEnergyTracking = React.lazy(() => import('@/pages/meters/EnergyTracking'));
const MeterCostAnalysis = React.lazy(() => import('@/pages/meters/CostAnalysis'));
const MeterSubmeterBalance = React.lazy(() => import('@/pages/meters/SubmeterBalance'));

// Space Management Pages
const Spaces = React.lazy(() => import('@/pages/spaces/Spaces'));
const SpaceEfficiency = React.lazy(() => import('@/pages/spaces/SpaceEfficiency'));
const SpaceCategories = React.lazy(() => import('@/pages/spaces/Categories'));
const SpaceEmissions = React.lazy(() => import('@/pages/spaces/Emissions'));
const SpaceCostAnalysis = React.lazy(() => import('@/pages/spaces/CostAnalysis'));
const SpaceLoadMonitoring = React.lazy(() => import('@/pages/spaces/LoadMonitoring'));
const SpaceStatistics = React.lazy(() => import('@/pages/spaces/Statistics'));

// Environmental Monitoring Pages
const Environmental = React.lazy(() => import('@/pages/environmental/Environmental'));
const CarbonTracking = React.lazy(() => import('@/pages/environmental/CarbonTracking'));
const EnvironmentalMonitoring = React.lazy(() => import('@/pages/environmental/Monitoring'));
const EnvironmentalProduction = React.lazy(() => import('@/pages/environmental/Production'));

// FDD
const FDD = React.lazy(() => import('@/pages/fdd/Fdd'));
const FDDDetection = React.lazy(() => import('@/pages/fdd/Detection'));
const FDDDiagnostics = React.lazy(() => import('@/pages/fdd/Diagnostics'));
// Knowledge Base
const KnowledgeBase = React.lazy(() => import('@/pages/knowledge/KnowledgeBase'));
const KnowledgeSystemDocs = React.lazy(() => import('@/pages/knowledge/System'));
const KnowledgeEquipmentDocs = React.lazy(() => import('@/pages/knowledge/Equipment'));
const KnowledgeTroubleshooting = React.lazy(() => import('@/pages/knowledge/Troubleshooting'));
// Alerts
const Alerts = React.lazy(() => import('@/pages/alerts/Alerts'));
// Data Processing
const DataProcessing = React.lazy(() => import('@/pages/data/DataProcessing'));
const DataCleaning = React.lazy(() => import('@/pages/data/Cleaning'));
const DataNormalization = React.lazy(() => import('@/pages/data/Normalization'));
const DataAggregation = React.lazy(() => import('@/pages/data/Aggregation'));
const DataHistorical = React.lazy(() => import('@/pages/data/Historical'));
// Reports
const Reports = React.lazy(() => import('@/pages/reports/Reports'));
const CustomReports = React.lazy(() => import('@/pages/reports/Custom'));

// --- EV Chargers --- Lazy load
const EVChargersPage = React.lazy(() => import('@/pages/devices/EVChargersPage'));
// --- Battery Details --- Lazy load
const BatteryDetailsPage = React.lazy(() => import('@/pages/devices/BatteryDetailsPage'));

// --- End Lazy Load ---

// Suspense wrapper remains the same
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center h-full flex-1">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }
  >
    <Component />
  </React.Suspense>
);

// --- Define Routes Component --- 
const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Routes */}
        <Route path="dashboard" element={withSuspense(Dashboard)} />
        <Route path="devices/*" element={withSuspense(Devices)} />
        <Route path="analytics" element={withSuspense(Analytics)} />
        <Route path="settings" element={withSuspense(Settings)} />
        <Route path="alerts" element={withSuspense(Alerts)} />

        {/* Equipment Section */}
        <Route path="equipment" element={withSuspense(Equipment)} />
        <Route path="equipment/status" element={withSuspense(StatusMonitor)} />
        <Route path="equipment/efficiency" element={withSuspense(EquipmentEfficiency)} />
        <Route path="equipment/load" element={withSuspense(EquipmentLoadMonitoring)} />
        <Route path="equipment/emissions" element={withSuspense(EquipmentEmissions)} />
        <Route path="equipment/cost" element={withSuspense(EquipmentCostAnalysis)} />
        <Route path="equipment/energy-usage" element={withSuspense(EquipmentEnergyUsage)} />

        {/* Energy Management Section */}
        <Route path="energy-management" element={withSuspense(EnergyManagement)} />
        <Route path="energy-management/consumption" element={withSuspense(EnergyConsumption)} />
        <Route path="energy-management/categories" element={withSuspense(EnergyCategories)} />
        <Route path="energy-management/cost" element={withSuspense(EnergyCostAnalysis)} />
        <Route path="energy-management/efficiency" element={withSuspense(EnergyEfficiency)} />
        <Route path="energy-management/savings" element={withSuspense(EnergySavings)} />
        <Route path="energy-management/forecasting" element={withSuspense(EnergyForecasting)} />

        {/* Metering Section */}
        <Route path="meters" element={withSuspense(MeterManagement)} />
        <Route path="meters/readings" element={withSuspense(MeterReadings)} />
        <Route path="meters/comparison" element={withSuspense(MeterComparison)} />
        <Route path="meters/energy" element={withSuspense(MeterEnergyTracking)} />
        <Route path="meters/cost" element={withSuspense(MeterCostAnalysis)} />
        <Route path="meters/submeter" element={withSuspense(MeterSubmeterBalance)} />

        {/* Spaces Section */}
        <Route path="spaces" element={withSuspense(Spaces)} />
        <Route path="spaces/efficiency" element={withSuspense(SpaceEfficiency)} />
        <Route path="spaces/categories" element={withSuspense(SpaceCategories)} />
        <Route path="spaces/emissions" element={withSuspense(SpaceEmissions)} />
        <Route path="spaces/cost" element={withSuspense(SpaceCostAnalysis)} />
        <Route path="spaces/load" element={withSuspense(SpaceLoadMonitoring)} />
        <Route path="spaces/statistics" element={withSuspense(SpaceStatistics)} />

        {/* Environmental Section */}
        <Route path="environmental" element={withSuspense(Environmental)} />
        <Route path="environmental/carbon" element={withSuspense(CarbonTracking)} />
        <Route path="environmental/monitoring" element={withSuspense(EnvironmentalMonitoring)} />
        <Route path="environmental/production" element={withSuspense(EnvironmentalProduction)} />

        {/* FDD Section */}
        <Route path="fdd" element={withSuspense(FDD)} />
        <Route path="fdd/detection" element={withSuspense(FDDDetection)} />
        <Route path="fdd/diagnostics" element={withSuspense(FDDDiagnostics)} />

        {/* Knowledge Base Section */}
        <Route path="knowledge" element={withSuspense(KnowledgeBase)} />
        <Route path="knowledge/system" element={withSuspense(KnowledgeSystemDocs)} />
        <Route path="knowledge/equipment" element={withSuspense(KnowledgeEquipmentDocs)} />
        <Route path="knowledge/troubleshooting" element={withSuspense(KnowledgeTroubleshooting)} />

        {/* Data Processing Section */}
        <Route path="data" element={withSuspense(DataProcessing)} />
        <Route path="data/cleaning" element={withSuspense(DataCleaning)} />
        <Route path="data/normalization" element={withSuspense(DataNormalization)} />
        <Route path="data/aggregation" element={withSuspense(DataAggregation)} />
        <Route path="data/historical" element={withSuspense(DataHistorical)} />

        {/* Reports Section */}
        <Route path="reports" element={withSuspense(Reports)} />
        <Route path="reports/custom" element={withSuspense(CustomReports)} />
        {/* Add routes for other report types if needed */}

        {/* EV Chargers Route */}
        <Route path="devices/ev-chargers" element={withSuspense(EVChargersPage)} />

        {/* Battery Details Route - Note: Requires dynamic ID handling */}
        <Route path="devices/battery/:batteryId" element={withSuspense(BatteryDetailsPage)} />

        {/* Add routes for Admin section if needed */}
        {/* <Route path="users" element={...} /> */}
        {/* <Route path="languages" element={...} /> */}

        {/* Add routes for Visualization section if needed */}
        {/* <Route path="visualizations" element={...} /> */}
        
        {/* Add routes for Optimization/Planning section if needed */}
        {/* <Route path="planning" element={...} /> */}

        {/* Add routes for Integration section if needed */}
        {/* <Route path="integrations" element={...} /> */}
        
        {/* Consider adding a Not Found route here if needed */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </RouterRoutes>
  );
};

// --- Export the component --- 
export default AppRoutes;
