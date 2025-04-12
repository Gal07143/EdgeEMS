
import React from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AppStoreProvider } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AppStoreProvider>
            <MicrogridProvider>
              <EnergyFlowProvider>
                <RouterProvider router={router} />
                <Toaster position="top-right" richColors />
              </EnergyFlowProvider>
            </MicrogridProvider>
          </AppStoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
