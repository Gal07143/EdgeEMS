import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Activity, Gauge, BarChart3, Factory, Lightbulb, AlertTriangle, 
  Book, Bell, Database, FileText, Users, Globe, LineChart,
  Layers, Plug, Settings, ChevronRight, ChevronDown, Home,
  LayoutDashboard, Clock, Leaf, DollarSign, Cpu, Binary, Grid,
  Workflow, Building2, PieChart, Terminal, BarChartHorizontal
} from 'lucide-react';

interface SidebarNavProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: { label: string; href: string; icon: React.ReactNode }[];
  }[];
}

const SidebarItem = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  isCollapsed, 
  hasChildren, 
  isOpen,
  onClick 
}: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        isCollapsed && "justify-center px-2"
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!isCollapsed && hasChildren && (
        <div className="ml-auto">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </Link>
  );
};

const SidebarNav: React.FC<SidebarNavProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    equipment: true,
    energy: true,
    meters: false,
    spaces: false,
    monitoring: false,
    fdd: false,
    knowledge: false,
    data: false,
    reporting: false,
    users: false,
    visualization: false,
    planning: false,
    integration: false
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections: SidebarSection[] = [
    {
      title: "Main",
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        { 
          label: "Dashboard", 
          href: "/dashboard", 
          icon: <Home className="h-4 w-4" /> 
        }
      ]
    },
    {
      title: "Equipment",
      icon: <Cpu className="h-4 w-4" />,
      items: [
        { 
          label: "Equipment", 
          href: "/equipment", 
          icon: <Factory className="h-4 w-4" />,
          children: [
            { label: "Status Monitor", href: "/equipment/status", icon: <Activity className="h-4 w-4" /> },
            { label: "Efficiency", href: "/equipment/efficiency", icon: <Gauge className="h-4 w-4" /> },
            { label: "Load Monitoring", href: "/equipment/load", icon: <BarChart3 className="h-4 w-4" /> },
            { label: "Carbon Emissions", href: "/equipment/emissions", icon: <Leaf className="h-4 w-4" /> },
            { label: "Cost Analysis", href: "/equipment/cost", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Energy Usage", href: "/equipment/energy-usage", icon: <Lightbulb className="h-4 w-4" /> }
          ] 
        }
      ]
    },
    {
      title: "Energy",
      icon: <Lightbulb className="h-4 w-4" />,
      items: [
        { 
          label: "Energy Management", 
          href: "/energy-management", 
          icon: <Lightbulb className="h-4 w-4" />,
          children: [
            { label: "Categories", href: "/energy-management/categories", icon: <Layers className="h-4 w-4" /> },
            { label: "Consumption", href: "/energy-management/consumption", icon: <BarChart3 className="h-4 w-4" /> },
            { label: "Cost Analysis", href: "/energy-management/cost", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Efficiency", href: "/energy-management/efficiency", icon: <Gauge className="h-4 w-4" /> },
            { label: "Savings", href: "/energy-management/savings", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Forecasting", href: "/energy-management/forecasting", icon: <LineChart className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Metering",
      icon: <Gauge className="h-4 w-4" />,
      items: [
        { 
          label: "Meter Management", 
          href: "/meters", 
          icon: <Gauge className="h-4 w-4" />,
          children: [
            { label: "Real-time Readings", href: "/meters/readings", icon: <Activity className="h-4 w-4" /> },
            { label: "Comparisons", href: "/meters/comparison", icon: <BarChartHorizontal className="h-4 w-4" /> },
            { label: "Energy Tracking", href: "/meters/energy", icon: <LineChart className="h-4 w-4" /> },
            { label: "Cost Analysis", href: "/meters/cost", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Submeter Balance", href: "/meters/submeter", icon: <PieChart className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Spaces",
      icon: <Building2 className="h-4 w-4" />,
      items: [
        { 
          label: "Space Management", 
          href: "/spaces", 
          icon: <Building2 className="h-4 w-4" />,
          children: [
            { label: "Energy Categories", href: "/spaces/categories", icon: <Layers className="h-4 w-4" /> },
            { label: "Carbon Emissions", href: "/spaces/emissions", icon: <Leaf className="h-4 w-4" /> },
            { label: "Cost Analysis", href: "/spaces/cost", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Efficiency", href: "/spaces/efficiency", icon: <Gauge className="h-4 w-4" /> },
            { label: "Load Monitoring", href: "/spaces/load", icon: <Activity className="h-4 w-4" /> },
            { label: "Statistics", href: "/spaces/statistics", icon: <BarChart3 className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Environment",
      icon: <Leaf className="h-4 w-4" />,
      items: [
        { 
          label: "Environmental", 
          href: "/environmental", 
          icon: <Leaf className="h-4 w-4" />,
          children: [
            { label: "Monitoring", href: "/environmental/monitoring", icon: <Activity className="h-4 w-4" /> },
            { label: "Carbon Tracking", href: "/environmental/carbon", icon: <Leaf className="h-4 w-4" /> },
            { label: "Production", href: "/environmental/production", icon: <Factory className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "System",
      icon: <Settings className="h-4 w-4" />,
      items: [
        { 
          label: "Fault Detection", 
          href: "/fdd", 
          icon: <AlertTriangle className="h-4 w-4" />,
          children: [
            { label: "Detection", href: "/fdd/detection", icon: <AlertTriangle className="h-4 w-4" /> },
            { label: "Diagnostics", href: "/fdd/diagnostics", icon: <Cpu className="h-4 w-4" /> }
          ]
        },
        { 
          label: "Knowledge Base", 
          href: "/knowledge", 
          icon: <Book className="h-4 w-4" />,
          children: [
            { label: "System Docs", href: "/knowledge/system", icon: <FileText className="h-4 w-4" /> },
            { label: "Equipment Docs", href: "/knowledge/equipment", icon: <Cpu className="h-4 w-4" /> },
            { label: "Troubleshooting", href: "/knowledge/troubleshooting", icon: <Terminal className="h-4 w-4" /> }
          ]
        },
        { 
          label: "Alerts", 
          href: "/alerts", 
          icon: <Bell className="h-4 w-4" />
        },
        { 
          label: "Data Processing", 
          href: "/data", 
          icon: <Database className="h-4 w-4" />,
          children: [
            { label: "Cleaning", href: "/data/cleaning", icon: <Database className="h-4 w-4" /> },
            { label: "Normalization", href: "/data/normalization", icon: <Binary className="h-4 w-4" /> },
            { label: "Aggregation", href: "/data/aggregation", icon: <Layers className="h-4 w-4" /> },
            { label: "Historical", href: "/data/historical", icon: <Clock className="h-4 w-4" /> }
          ]
        },
        { 
          label: "Reports", 
          href: "/reports", 
          icon: <FileText className="h-4 w-4" />,
          children: [
            { label: "Custom Reports", href: "/reports/custom", icon: <FileText className="h-4 w-4" /> },
            { label: "Statistics", href: "/reports/statistics", icon: <BarChart3 className="h-4 w-4" /> },
            { label: "Trends", href: "/reports/trends", icon: <LineChart className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Administration",
      icon: <Users className="h-4 w-4" />,
      items: [
        { 
          label: "Users", 
          href: "/users", 
          icon: <Users className="h-4 w-4" />,
          children: [
            { label: "Authentication", href: "/users/auth", icon: <Users className="h-4 w-4" /> },
            { label: "Roles & Access", href: "/users/roles", icon: <Layers className="h-4 w-4" /> },
            { label: "API Keys", href: "/users/api-keys", icon: <Key className="h-4 w-4" /> }
          ]
        },
        { 
          label: "Languages", 
          href: "/languages", 
          icon: <Globe className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Visualization",
      icon: <BarChart3 className="h-4 w-4" />,
      items: [
        { 
          label: "Visualizations", 
          href: "/visualizations", 
          icon: <BarChart3 className="h-4 w-4" />,
          children: [
            { label: "Energy Flow", href: "/visualizations/energy-flow", icon: <Activity className="h-4 w-4" /> },
            { label: "Distribution", href: "/visualizations/distribution", icon: <Grid className="h-4 w-4" /> },
            { label: "Dashboards", href: "/visualizations/dashboards", icon: <LayoutDashboard className="h-4 w-4" /> },
            { label: "Monitoring", href: "/visualizations/monitoring", icon: <Activity className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Optimization",
      icon: <LineChart className="h-4 w-4" />,
      items: [
        { 
          label: "Planning", 
          href: "/planning", 
          icon: <LineChart className="h-4 w-4" />,
          children: [
            { label: "Energy Planning", href: "/planning/energy", icon: <Lightbulb className="h-4 w-4" /> },
            { label: "Production", href: "/planning/production", icon: <Factory className="h-4 w-4" /> },
            { label: "Efficiency", href: "/planning/efficiency", icon: <Gauge className="h-4 w-4" /> },
            { label: "Cost", href: "/planning/cost", icon: <DollarSign className="h-4 w-4" /> }
          ]
        }
      ]
    },
    {
      title: "Integration",
      icon: <Plug className="h-4 w-4" />,
      items: [
        { 
          label: "Integrations", 
          href: "/integrations", 
          icon: <Plug className="h-4 w-4" />,
          children: [
            { label: "Modbus TCP", href: "/integrations/modbus", icon: <Terminal className="h-4 w-4" /> },
            { label: "MQTT", href: "/integrations/mqtt", icon: <Bell className="h-4 w-4" /> },
            { label: "API", href: "/integrations/api", icon: <Database className="h-4 w-4" /> },
            { label: "Workflows", href: "/integrations/workflows", icon: <Workflow className="h-4 w-4" /> }
          ]
        }
      ]
    }
  ];

  return (
    <div className={cn(
      "flex flex-col gap-1 py-2 h-full overflow-y-auto scrollbar-thin",
      isCollapsed ? "w-14" : "w-64"
    )}>
      {sections.map((section) => (
        <div key={section.title} className="px-2">
          {!isCollapsed && (
            <h3 className="flex items-center gap-2 mb-1 px-2 text-xs font-medium text-muted-foreground">
              {section.icon}
              {section.title}
            </h3>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <Fragment key={item.href}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={location.pathname === item.href || 
                    location.pathname.startsWith(`${item.href}/`)}
                  isCollapsed={isCollapsed}
                  hasChildren={!!item.children && item.children.length > 0}
                  isOpen={openSections[item.label.toLowerCase().replace(' ', '-')]}
                  onClick={() => {
                    if (item.children && item.children.length) {
                      toggleSection(item.label.toLowerCase().replace(' ', '-'));
                    }
                  }}
                />
                {!isCollapsed && 
                  item.children && 
                  item.children.length > 0 && 
                  openSections[item.label.toLowerCase().replace(' ', '-')] && (
                  <div className="ml-4 mt-1 space-y-1 border-l pl-2 border-border/30">
                    {item.children.map((child) => (
                      <SidebarItem
                        key={child.href}
                        icon={child.icon}
                        label={child.label}
                        href={child.href}
                        isActive={location.pathname === child.href}
                        isCollapsed={false}
                      />
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarNav;

function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
