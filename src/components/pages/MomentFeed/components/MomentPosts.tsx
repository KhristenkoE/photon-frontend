import React, { useEffect, useMemo, useRef } from 'react';
import { MomentPostItem } from '@/components/pages/MomentFeed/components/MomentPostItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/virtual';
import { Virtual } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useMoments } from '@/api/hooks/useMoments';
import { useMomentStore, useUserStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

export const MomentPosts = () => {
  const { lastDeletedMomentId, setLastDeletedMomentId } = useMomentStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const myTgId = useUserStore((state) => state.user?.telegramId);
  const initialMomentId = searchParams.get('id');
  const userTgId = searchParams.get('userTgId');

  const swiperRef = useRef<SwiperType | null>(null);

  const {
    query: {
      data,
      isPending,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isError,
      error,
    },
  } = useMoments(
    userTgId
      ? {
          userTgId: +userTgId,
          pageSize: 9,
        }
      : undefined,
  );

  const allMoments = useMemo(
    () => data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [data],
  );

  const handleSlideChange = (swiper: SwiperType) => {
    const buffer = 2;
    if (
      swiper.activeIndex >= allMoments.length - 1 - buffer &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }

    updateCurrentUrl();
  };

  useEffect(() => {
    if (!lastDeletedMomentId) return;

    const currentIndex = swiperRef.current?.activeIndex ?? 0;
    const nextIndex =
      currentIndex < allMoments.length - 1
        ? currentIndex + 1
        : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < allMoments.length) {
      updateCurrentUrl();
    } else {
      const url =
        Number(myTgId) === Number(userTgId)
          ? '/profile/me'
          : `/profile/${userTgId}`;
      router.push(url);
    }

    setLastDeletedMomentId(null);
  }, [lastDeletedMomentId, allMoments.length, router]);

  const updateCurrentUrl = () => {
    if (swiperRef.current === null) return;
    const currentMoment = allMoments[swiperRef.current.activeIndex];
    if (currentMoment) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('id', currentMoment.id);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    }
  };

  // Initial loading state
  if (isPending && !data) return <div>Loading...</div>;

  // Handle error state
  if (isError || !userTgId) {
    return (
      <div>Error loading moments: {error?.message || 'Unknown error'}</div>
    );
  }

  // Find initial slide index based on momentId
  const initialSlide = initialMomentId
    ? allMoments.findIndex((moment) => moment.id === initialMomentId)
    : 0;

  return (
    <Swiper
      modules={[Virtual]}
      direction={'vertical'}
      slidesPerView={1}
      spaceBetween={0}
      className='h-full w-full'
      virtual
      initialSlide={initialSlide}
      onSlideChange={handleSlideChange}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
    >
      {allMoments.map((moment, index) => (
        <SwiperSlide
          key={moment.id}
          virtualIndex={index}
          className='h-full w-full'
        >
          <MomentPostItem moment={moment} />
        </SwiperSlide>
      ))}

      {isFetchingNextPage && (
        <div className='flex h-full items-center justify-center'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black' />
        </div>
      )}
    </Swiper>
  );
};
