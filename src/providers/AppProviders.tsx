import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { DeviceProvider } from '@/contexts/DeviceContext';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="theme-preference">
        <DeviceProvider>
          <MicrogridProvider>
            <EnergyFlowProvider>
              {children}
            </EnergyFlowProvider>
          </MicrogridProvider>
        </DeviceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
