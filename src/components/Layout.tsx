import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import { 
  Zap,
  Bell,
  Menu,
  Search,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Button } from './ui/button';
// Comment out SidebarNav import for now
// import SidebarNav from './sidebar/SidebarNav';

export const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Temporarily Commented Out */}
      {/* <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between h-16">
          {!isCollapsed && (
            <Link to="/" className="flex items-center">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-bold text-xl">GridWise</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className={`${isCollapsed ? 'mx-auto' : 'ml-auto'} h-8 w-8 hover:bg-accent`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav isCollapsed={isCollapsed} />
        </div>

      </div> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar - Temporarily Commented Out */}
        {/* <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 h-16 flex items-center">
          <div className="flex justify-between items-center px-4 w-full">
            <div className="relative flex-1 max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600"
                placeholder="Search..."
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-accent">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </div>
          </div>
        </header> */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet /> {/* The actual page content should render here */}
        </main>
      </div>
      
      {/* Toaster might be redundant if also in main.tsx */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "bg-background text-foreground border border-border",
        }}
      />
    </div>
  );
};

export default Layout;
