import { BottomSheet } from 'react-spring-bottom-sheet';
import CancelIcon from '../../../../../public/assets/icons/cancel.svg';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>;

export const AppCustomBottomSheet = ({
  children,
  isOpen,
  setIsOpen,
}: Props) => {
  return (
    <BottomSheet
      className={cn(
        isOpen && 'open',
        'app-bottom-sheet custom-content z-10 mx-1.5',
      )}
      open={isOpen}
      onDismiss={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(false)}
        className='absolute top-[22px] right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#8A8A8E]'
      >
        <CancelIcon width='24px' height='24px' />
      </button>

      {children}
    </BottomSheet>
  );
};
