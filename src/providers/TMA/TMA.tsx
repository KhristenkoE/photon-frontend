'use client';

import { useEffect } from 'react';
import { useTMA } from './useTMA';

export function TMAProvider({ children }: { children: React.ReactNode }) {
  const { initTMA, isTMAInitialized } = useTMA();

  useEffect(() => {
    initTMA();
  }, [initTMA]);

  return isTMAInitialized ? children : null;
}
