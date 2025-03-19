
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatus {
  category: string;
  status: 'operational' | 'maintenance' | 'issue' | 'critical';
  lastUpdated: string;
  details?: string;
}

interface StatusOverviewProps {
  className?: string;
  animationDelay?: string;
}

// Mock system status data
const initialStatuses: SystemStatus[] = [
  { 
    category: 'Microgrid Controller', 
    status: 'operational', 
    lastUpdated: '2 minutes ago',
    details: 'All systems operational'
  },
  { 
    category: 'Energy Storage', 
    status: 'operational', 
    lastUpdated: '5 minutes ago',
    details: 'Battery at 68% capacity'
  },
  { 
    category: 'Solar Production', 
    status: 'operational', 
    lastUpdated: '2 minutes ago',
    details: 'Producing at 92% efficiency'
  },
  { 
    category: 'Grid Connection', 
    status: 'maintenance', 
    lastUpdated: '15 minutes ago',
    details: 'Scheduled maintenance in progress'
  },
  { 
    category: 'EV Charging', 
    status: 'operational', 
    lastUpdated: '3 minutes ago',
    details: '3/5 charging stations in use'
  },
  { 
    category: 'Building Distribution', 
    status: 'operational', 
    lastUpdated: '7 minutes ago',
    details: 'All circuits normal'
  },
];

const StatusOverview = ({ className, animationDelay }: StatusOverviewProps = {}) => {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate occasional status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of changing a random status
      if (Math.random() < 0.1) {
        const statusOptions: SystemStatus['status'][] = ['operational', 'maintenance', 'issue', 'critical'];
        const randomIndex = Math.floor(Math.random() * statuses.length);
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        setStatuses(prev => 
          prev.map((status, idx) => 
            idx === randomIndex 
              ? { ...status, status: randomStatus, lastUpdated: 'Just now' } 
              : status
          )
        );
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [statuses]);
  
  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle size={16} className="text-energy-green" />;
      case 'maintenance':
        return <Clock size={16} className="text-energy-blue" />;
      case 'issue':
        return <AlertTriangle size={16} className="text-energy-orange" />;
      case 'critical':
        return <AlertTriangle size={16} className="text-energy-red" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-energy-green/10 text-energy-green border-energy-green/20';
      case 'maintenance':
        return 'bg-energy-blue/10 text-energy-blue border-energy-blue/20';
      case 'issue':
        return 'bg-energy-orange/10 text-energy-orange border-energy-orange/20';
      case 'critical':
        return 'bg-energy-red/10 text-energy-red border-energy-red/20';
      default:
        return '';
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <div 
      className={cn("w-full", className)} 
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Shield size={18} className="mr-2 text-primary" />
          <h3 className="font-medium">System Status</h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw size={16} className={`text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3 staggered-fade-in">
        {statuses.map((item, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/50 dark:to-slate-900/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm flex items-center justify-between transition-all hover:shadow-md group"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{item.category}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.details}</div>
            </div>
            
            <div className="flex items-center">
              <div className={cn(
                "py-1 px-2 rounded-full text-xs font-medium flex items-center mr-3",
                getStatusColor(item.status)
              )}>
                {getStatusIcon(item.status)}
                <span className="ml-1.5 capitalize">{item.status}</span>
              </div>
              <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
