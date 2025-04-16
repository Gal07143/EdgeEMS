import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProviders } from './providers/AppProviders';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element. Please check if the element with id "root" exists in your HTML.');
}

// Create the root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <App />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
    <Toaster 
      position="top-right"
      closeButton
      richColors
    />
  </React.StrictMode>,
);
