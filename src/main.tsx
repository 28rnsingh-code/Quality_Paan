import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';
import './index.css';

// Catch and suppress HMR WebSocket connection errors in the developer log
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.toLowerCase().includes('websocket') || 
      event.message.toLowerCase().includes('vite')
    )) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason) {
      const msg = reason.message || String(reason);
      if (
        msg.toLowerCase().includes('websocket') || 
        msg.toLowerCase().includes('vite')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }
  }, true);
}

import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);

