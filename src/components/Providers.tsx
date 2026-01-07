'use client';

import { Provider } from 'react-redux';

import { store } from '../lib/store';

import ClientGuard from './ClientGuard';
import UTMCaptureClient from './UTMCaptureClient';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <UTMCaptureClient>
        <ClientGuard>
          {children}
        </ClientGuard>
      </UTMCaptureClient>
    </Provider>
  );
}

