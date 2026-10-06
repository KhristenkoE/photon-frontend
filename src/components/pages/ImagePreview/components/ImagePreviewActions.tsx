import FlipBackwardIcon from '@/../public/assets/icons/flip-backward.svg';
import RotateIcon from '@/../public/assets/icons/rotate.svg';
import { Check, Crop } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useBottomSheetStore, useImageEditorStore } from '@/store';
import { useMomentListItems } from '@/components/common/Navigation/hooks/useMomentListItems';
import React, { MouseEvent, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const ImagePreviewActions = () => {
  const { open } = useBottomSheetStore();
  const momentListItems = useMomentListItems();
  const { push } = useRouter();
  const { redirectUrl } = useImageEditorStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading && redirectUrl) {
      push(redirectUrl);
    }
  }, [redirectUrl, isLoading]);

  const onOpen = () => {
    open(momentListItems);
  };

  const onSubmit = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className='fixed bottom-11 left-0 flex w-full items-center gap-8 px-6 text-white'>
      <button
        onClick={onOpen}
        disabled={isLoading}
        className='flex h-11 w-11 items-center justify-center rounded-4xl bg-white/20'
      >
        <FlipBackwardIcon />
      </button>

      <Link
        href='/image/editor'
        className={cn(
          isLoading && 'pointer-events-none',
          'flex h-11 w-11 items-center justify-center rounded-4xl bg-white/20',
        )}
      >
        <Crop />
      </Link>
      <Link
        href='/image/editor'
        className={cn(
          isLoading && 'pointer-events-none',
          'flex h-11 w-11 items-center justify-center rounded-4xl bg-white/20',
        )}
      >
        <RotateIcon />
      </Link>
      <Link
        onClick={onSubmit}
        href={redirectUrl ?? ''}
        className='ms-auto flex h-[78px] w-[78px] items-center justify-center rounded-full bg-white text-black'
      >
        {isLoading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
        ) : (
          <Check width='40px' height='40px' />
        )}
      </Link>
    </div>
  );
};
