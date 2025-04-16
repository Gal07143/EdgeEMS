import React from 'react';
// Remove Toaster import - it's handled in main.tsx
// import { Toaster } from 'sonner';
// Remove ErrorBoundary import - it's handled in main.tsx
// import { ErrorBoundary } from './components/ErrorBoundary';
import AppRoutes from '@/routes/index';
// Remove AppProviders import - it's handled in main.tsx
// import { AppProviders } from './providers/AppProviders';
import './index.css';

function App() {
  return (
    // Remove ErrorBoundary wrapper
    // <ErrorBoundary>
      // Remove AppProviders wrapper
      // <AppProviders>
        <AppRoutes />
        // Remove Toaster - it's handled in main.tsx
        // <Toaster position="top-right" /> 
      // </AppProviders>
    // </ErrorBoundary>
  );
}

export default App;
