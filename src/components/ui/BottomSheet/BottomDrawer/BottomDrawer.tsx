'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface BottomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function BottomDrawer({
  open,
  onOpenChange,
  children,
}: BottomDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/40' />
        <Dialog.Content
          className={cn(
            'fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white shadow-lg',
            'animate-in fade-in slide-in-from-bottom-10 duration-300',
          )}
        >
          <div className='p-4'>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
