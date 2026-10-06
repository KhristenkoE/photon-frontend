'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

export const TON_CONNECT_MANIFEST_URL =
  process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL || '';

export function TonConnectProvider({ children }: { children: ReactNode }) {
  if (!TON_CONNECT_MANIFEST_URL) return <>{children}</>;

  return (
    <TonConnectUIProvider manifestUrl={TON_CONNECT_MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  );
}
