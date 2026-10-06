'use client';

import { ReactNode } from 'react';

// Analytics are disabled in this archive.
export function PostHogProvider({ children }: { children: ReactNode }) {
  return children;
}
