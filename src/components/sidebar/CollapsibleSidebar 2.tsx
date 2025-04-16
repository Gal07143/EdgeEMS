
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import SidebarNav from './SidebarNav';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div
        className={cn(
          "h-full border-r border-border/40 bg-card/10 transition-all duration-300 ease-in-out relative backdrop-blur-sm",
          isCollapsed ? "w-14" : "w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/40 px-3">
          <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
                <path d="M17.64 15 22 10.64" />
                <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a3.18 3.18 0 0 0-4.24 0l-2.83 2.83 11.3 11.3c.8.8 2.13.8 2.94 0l1.45-1.45a2 2 0 0 0 0-2.83L22 12.8l-1.09-1.1" />
                <path d="m12.56 18.48 4.99-5" />
                <path d="m7.99 13.91 4.99-5" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-lg font-semibold">GridWise EMS</span>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent"
            >
              <PanelLeftClose className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>
        <SidebarNav isCollapsed={isCollapsed} />
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
          {isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent"
            >
              <PanelLeftOpen className="h-4 w-4" />
              <span className="sr-only">Expand sidebar</span>
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
