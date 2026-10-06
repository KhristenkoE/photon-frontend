import { BottomSheet } from 'react-spring-bottom-sheet';
import CancelIcon from '@/../public/assets/icons/cancel.svg';
import { PropsWithChildren } from 'react';
import { useBottomSheetStore } from '@/store';
import { ChevronLeft } from 'lucide-react';
import { ListItemTheme } from '@/components/ui/BottomSheet';
import { cn } from '@/lib/utils';

export const AppBottomSheet = ({ children }: PropsWithChildren) => {
  const { isOpen, history, back, close, keyboardVisible } =
    useBottomSheetStore();
  const current = history[history.length - 1];

  return (
    <BottomSheet
      className={cn(isOpen && 'open', 'app-bottom-sheet mx-1.5', {
        'app-bottom-sheet-comments': current?.type === ListItemTheme.COMMENTS,
        'app-bottom-sheet-comments-keyboard': keyboardVisible,
      })}
      open={isOpen}
      onDismiss={close}
    >
      <div className='min-h-[50px]'>
        {history.length > 1 && (
          <button
            onClick={back}
            className='absolute left-4 flex h-8 w-8 items-center justify-center text-[#8A8A8E]'
          >
            <ChevronLeft />
          </button>
        )}
        <h2 className='text-h40 absolute z-[var(--feed-ui-z-index)] flex w-full justify-center bg-[var(--background-color)] pt-[6px] pb-[20px] text-center font-semibold'>
          {current?.title}
        </h2>
        <button
          onMouseDown={close}
          className='absolute top-[22px] right-4 z-[var(--feed-ui-z-index)] flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#8A8A8E]'
        >
          <CancelIcon width='24px' height='24px' />
        </button>
      </div>
      {children}
    </BottomSheet>
  );
};
