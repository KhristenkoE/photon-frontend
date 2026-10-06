import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';

export function TopNavigation({
  isFeed,
  setIsFeed,
}: {
  isFeed: boolean;
  setIsFeed: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations('Feed');

  return (
    <div className='top-safe-content-top absolute right-0 left-0 z-[var(--feed-ui-z-index)] text-white'>
      <div className='flex items-center justify-between px-[var(--container-x-padding)] py-6'>
        <div className='text-h25 flex items-center gap-2.5'>
          <button
            onClick={() => setIsFeed(true)}
            className={cn('text-shadow-sm', {
              'opacity-60': !isFeed,
            })}
          >
            {t('Feed')}
          </button>
          <button
            onClick={() => setIsFeed(false)}
            className={cn('text-shadow-sm', {
              'opacity-60': isFeed,
            })}
          >
            {t('Friends')}
          </button>
        </div>
        {/*<img*/}
        {/*  className='drop-shadow-lg'*/}
        {/*  src='/assets/icons/search.svg'*/}
        {/*  alt='search'*/}
        {/*/>*/}
      </div>
    </div>
  );
}
