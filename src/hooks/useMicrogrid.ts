import { useContext } from 'react';
// Import the context and its type from the provider file
import { MicrogridContext, MicrogridContextType } from '@/components/microgrid/MicrogridProvider'; 

/**
 * Hook to access microgrid context
 */
export const useMicrogrid = (): MicrogridContextType => {
  const context = useContext(MicrogridContext);
  if (context === undefined) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  return context;
}; 