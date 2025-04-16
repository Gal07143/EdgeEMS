
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, BatteryCharging, Cable, ChevronRight, LineChart, 
  Lightbulb, MonitorSmartphone, Mountain, Zap
} from 'lucide-react';

interface EnergyManagementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const EnergyManagementCard: React.FC<EnergyManagementCardProps> = ({ 
  title, 
  description, 
  icon,
  path 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="backdrop-blur-sm bg-card/90 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
              {icon}
            </div>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center" 
          onClick={() => navigate(path)}
        >
          View
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const EnergyManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Energy Management
          </h1>
          <p className="text-muted-foreground">
            Monitor, analyze, and optimize your energy usage across all systems
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EnergyManagementCard
          title="Energy Consumption"
          description="Monitor and analyze energy consumption patterns across your facilities"
          icon={<Lightbulb className="h-5 w-5 text-primary" />}
          path="/energy-management/consumption"
        />
        
        <EnergyManagementCard
          title="Energy Categories"
          description="Track energy usage broken down by category and source"
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          path="/energy-management/categories"
        />
        
        <EnergyManagementCard
          title="Cost Analysis"
          description="Analyze energy costs, billing data and identify savings opportunities"
          icon={<LineChart className="h-5 w-5 text-primary" />}
          path="/energy-management/cost"
        />
        
        <EnergyManagementCard
          title="Efficiency Analysis"
          description="Identify efficiency opportunities and track improvement metrics"
          icon={<Zap className="h-5 w-5 text-primary" />}
          path="/energy-management/efficiency"
        />
        
        <EnergyManagementCard
          title="Energy Savings"
          description="Monitor energy conservation measures and track savings"
          icon={<BatteryCharging className="h-5 w-5 text-primary" />}
          path="/energy-management/savings"
        />
        
        <EnergyManagementCard
          title="Energy Forecasting"
          description="Predict future energy needs and optimize production/consumption"
          icon={<Mountain className="h-5 w-5 text-primary" />}
          path="/energy-management/forecasting"
        />
        
        <EnergyManagementCard
          title="Grid Management"
          description="Monitor and manage grid connections and interactions"
          icon={<Cable className="h-5 w-5 text-primary" />}
          path="/energy-management/grid"
        />
        
        <EnergyManagementCard
          title="Energy Monitoring"
          description="Real-time energy monitoring dashboard with alerts"
          icon={<MonitorSmartphone className="h-5 w-5 text-primary" />}
          path="/energy-management/monitoring"
        />
      </div>
    </div>
  );
};

export default EnergyManagement;
