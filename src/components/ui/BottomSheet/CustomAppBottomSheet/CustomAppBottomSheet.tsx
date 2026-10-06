import { PropsWithChildren, useEffect } from 'react';
import { useBottomSheetStore } from '@/store';
import { createPortal } from 'react-dom';

export const CustomAppBottomSheet = ({ children }: PropsWithChildren) => {
  const { isOpen, close } = useBottomSheetStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 bg-black/30'>
      <div className='absolute inset-0' onClick={close} />
      <div className='absolute right-0 bottom-0 left-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl'>
        {children}
      </div>
    </div>,
    document.body,
  );
};
