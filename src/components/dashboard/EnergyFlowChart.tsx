
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock data for energy flow connections
interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'consumption' | 'storage';
  power: number; // in kW
  status: 'active' | 'inactive' | 'warning';
}

interface EnergyConnection {
  from: string;
  to: string;
  value: number; // in kW
  active: boolean;
}

const INITIAL_NODES: EnergyNode[] = [
  { id: 'solar', label: 'Solar Power', type: 'source', power: 75.2, status: 'active' },
  { id: 'wind', label: 'Wind Power', type: 'source', power: 45.8, status: 'active' },
  { id: 'grid', label: 'Grid', type: 'source', power: 32.1, status: 'active' },
  { id: 'battery', label: 'Battery Storage', type: 'storage', power: 120, status: 'active' },
  { id: 'building', label: 'Main Building', type: 'consumption', power: 102.7, status: 'active' },
  { id: 'ev', label: 'EV Charging', type: 'consumption', power: 48.3, status: 'active' },
];

const INITIAL_CONNECTIONS: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 35.2, active: true },
  { from: 'solar', to: 'building', value: 40.0, active: true },
  { from: 'wind', to: 'building', value: 25.8, active: true },
  { from: 'wind', to: 'battery', value: 20, active: true },
  { from: 'grid', to: 'building', value: 32.1, active: true },
  { from: 'battery', to: 'ev', value: 48.3, active: true },
];

const EnergyFlowChart = () => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  
  // Simulating live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => ({
          ...node,
          power: Math.max(0, node.power * (1 + (Math.random() - 0.5) * 0.08)) // +/- 4% change
        }));
      });
      
      setConnections(prevConnections => {
        return prevConnections.map(conn => ({
          ...conn,
          value: Math.max(0, conn.value * (1 + (Math.random() - 0.5) * 0.1)) // +/- 5% change
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // In a real app this would be a much more sophisticated visualization
  // possibly using D3.js or another specialized library
  return (
    <div className="w-full h-full min-h-[300px] p-4 rounded-xl">
      <div className="text-sm font-medium mb-4">Energy Flow Visualization</div>
      <div className="relative w-full h-[260px] overflow-hidden rounded-lg glass-panel grid-pattern">
        {/* Energy Sources */}
        <div className="absolute left-6 top-0 w-[120px] h-full flex flex-col justify-around">
          {nodes.filter(n => n.type === 'source').map(node => (
            <div 
              key={node.id} 
              className={cn(
                "glass-panel p-3 rounded-lg border transition-all",
                node.status === 'active' ? 'border-energy-green/50' : 'border-energy-orange/50'
              )}
            >
              <div className="text-xs font-medium">{node.label}</div>
              <div className="text-sm font-semibold flex items-center gap-1 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  node.status === 'active' ? 'bg-energy-green' : 'bg-energy-orange'
                )}></div>
                {node.power.toFixed(1)} kW
              </div>
            </div>
          ))}
        </div>
        
        {/* Battery Storage */}
        <div className="absolute left-[calc(50%-60px)] top-[calc(50%-50px)]">
          {nodes.filter(n => n.type === 'storage').map(node => (
            <div 
              key={node.id} 
              className="glass-panel p-3 rounded-lg border border-energy-blue/50 w-[120px]"
            >
              <div className="text-xs font-medium">{node.label}</div>
              <div className="text-sm font-semibold flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full animate-pulse bg-energy-blue"></div>
                {node.power.toFixed(1)} kW
              </div>
              <div className="mt-2 bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-energy-blue h-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Energy Consumption */}
        <div className="absolute right-6 top-0 w-[120px] h-full flex flex-col justify-around">
          {nodes.filter(n => n.type === 'consumption').map(node => (
            <div 
              key={node.id} 
              className="glass-panel p-3 rounded-lg border border-energy-purple/50"
            >
              <div className="text-xs font-medium">{node.label}</div>
              <div className="text-sm font-semibold flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full animate-pulse bg-energy-purple"></div>
                {node.power.toFixed(1)} kW
              </div>
            </div>
          ))}
        </div>
        
        {/* Energy flow lines - in a real app these would be SVG paths with animated particles */}
        {connections.map((conn, idx) => {
          // This is a simplified version - a real version would calculate actual path coordinates 
          // based on node positions and use SVG paths with animated gradients
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;
          
          let lineStyle = {};
          let startPoint = '';
          let endPoint = '';
          
          // Extremely simplified positioning logic
          if (fromNode.type === 'source' && toNode.type === 'storage') {
            lineStyle = { left: '126px', top: '80px', width: '80px', height: '2px' };
          } else if (fromNode.type === 'source' && toNode.type === 'consumption') {
            lineStyle = { left: '126px', top: fromNode.id === 'solar' ? '40px' : fromNode.id === 'wind' ? '120px' : '200px', width: '188px', height: '2px' };
          } else if (fromNode.type === 'storage' && toNode.type === 'consumption') {
            lineStyle = { left: '180px', top: '135px', width: '134px', height: '2px', transform: 'rotate(45deg)' };
          }
          
          return (
            <div key={`${conn.from}-${conn.to}`} 
              className="absolute bg-energy-blue overflow-hidden" 
              style={lineStyle}
            >
              <div className="card-shimmer h-full w-full"></div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="glass-panel p-2 rounded-lg border border-energy-green/20">
          <div className="text-xs text-muted-foreground">Generation</div>
          <div className="text-lg font-medium">
            {(nodes.filter(n => n.type === 'source').reduce((sum, node) => sum + node.power, 0)).toFixed(1)} kW
          </div>
        </div>
        <div className="glass-panel p-2 rounded-lg border border-energy-blue/20">
          <div className="text-xs text-muted-foreground">Storage</div>
          <div className="text-lg font-medium">
            {(nodes.find(n => n.id === 'battery')?.power || 0).toFixed(1)} kW
          </div>
        </div>
        <div className="glass-panel p-2 rounded-lg border border-energy-purple/20">
          <div className="text-xs text-muted-foreground">Consumption</div>
          <div className="text-lg font-medium">
            {(nodes.filter(n => n.type === 'consumption').reduce((sum, node) => sum + node.power, 0)).toFixed(1)} kW
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowChart;
