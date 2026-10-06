import { useEffect, useMemo } from 'react';
import { MomentsListPlaceholder } from './MomentsListPlaceholder';
import { Link, usePathname } from '@/i18n/navigation';
import { useMoments } from '@/api/hooks/useMoments';
import { useUserStore } from '@/store/userStore/userStore';
import { Moment } from '@/api/types/types';
import { useInView } from 'react-intersection-observer';
import { ImageByKey } from '@/components/ui/ImageByKey/ImageByKey';

export const MomentsList = () => {
  const pathname = usePathname();

  const user = useUserStore((state) => state.user);
  const isMe = pathname === '/profile/me';
  const userTgId = isMe ? user?.telegramId : pathname.split('/')[2];

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  const {
    query: {
      data,
      isPending,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    },
  } = useMoments(
    userTgId
      ? {
          userTgId: +userTgId,
          pageSize: 9,
        }
      : undefined,
  );

  const moments = useMemo(
    () => data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [data],
  );

  // Load more when the last item comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return <MomentsListPlaceholder />;
  }

  if (isError) {
    return (
      <div className='text-center text-red-500'>Error loading moments</div>
    );
  }

  if (moments.length === 0) {
    return <MomentsListPlaceholder />;
  }

  return (
    <div className='h-full'>
      <ul className='grid grid-cols-3 gap-1.5'>
        {moments.map((moment: Moment) => (
          <Link
            href={{
              pathname: '/moment/feed',
              query: { id: moment.id, userTgId: userTgId as string },
            }}
            key={moment.id}
            className='relative w-full'
          >
            <ImageByKey
              className='h-[205px] w-full rounded-2xl object-cover'
              imgKey={moment.media?.key}
              alt={moment.description}
            />

            {/*<div className='absolute bottom-2.5 left-2.5 flex gap-[3px] text-white'>
              <Eye width='14px' height='14px' />
              <span>{moment.viewCount}</span>
            </div>*/}
          </Link>
        ))}
      </ul>

      {/* Loading indicator */}
      <div ref={loadMoreRef} className='h-10 w-full'>
        {isFetchingNextPage && (
          <div className='flex h-full items-center justify-center'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black' />
          </div>
        )}
      </div>
    </div>
  );
};
