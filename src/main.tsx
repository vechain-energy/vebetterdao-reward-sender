import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import App from './App.tsx';
import './index.css';
import { NETWORK } from './config';

// Only try to define ethereum if we're in a browser context
if (typeof window !== 'undefined' && !window.hasOwnProperty('ethereum')) {
  try {
    Object.defineProperty(window, 'ethereum', {
      value: undefined,
      configurable: true,
      writable: true
    });
  } catch (error) {
    console.warn('Could not set ethereum property:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DAppKitProvider
      nodeUrl={NETWORK.NODE_URL}
      genesis={NETWORK.GENESIS}
      usePersistence={true}
      logLevel="DEBUG"
      themeMode="LIGHT"
      language="en"
      allowedWallets={['veworld', 'sync2']}
    >
      <App />
    </DAppKitProvider>
  </StrictMode>
);