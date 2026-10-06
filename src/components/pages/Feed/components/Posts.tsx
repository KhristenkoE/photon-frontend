'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Post } from './Post/Post';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/virtual';
import { Virtual } from 'swiper/modules';
import { useBottomSheetStore } from '@/store';
import { isAndroidPlatform } from '@/providers/TMA/utils';
import { PostType } from '@/api/types/posts';
import { DebouncedFuncLeading } from 'lodash';
import type { Swiper as SwiperType } from 'swiper';
import { useTranslations } from 'next-intl';

interface PostsProps {
  posts: PostType[];
  currentIndex: number;
  throttledFetchNextPage: DebouncedFuncLeading<() => void>;
  isPending: boolean;
  isError: boolean;
  noFriends?: boolean;
  noFriendsPostsYet?: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  handleSlideChange: (swiper: SwiperType) => void;
  error: Error | null;
}

export const Posts = (props: PostsProps) => {
  const {
    posts,
    currentIndex,
    throttledFetchNextPage,
    isPending,
    isError,
    error,
    handleSlideChange,
    isFetchingNextPage,
    hasNextPage,
    noFriends,
  } = props;
  const swiperRef = useRef<SwiperType | null>(null);
  const { isOpen } = useBottomSheetStore();
  const isAndroid = isAndroidPlatform();
  const t = useTranslations('FeedPost');

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const nextPost = posts?.[currentIndex + 1];

    if (nextPost && nextPost.media.key) {
      const img = new Image();
      img.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${nextPost.media.key}`;
    }
  }, [currentIndex, posts]);

  useEffect(() => {
    if (isAndroid) {
      document.body.style.overscrollBehavior = 'none';
    }

    return () => {
      if (isAndroid) {
        document.body.style.overscrollBehavior = '';
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      throttledFetchNextPage.cancel();
    };
  }, [throttledFetchNextPage]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Initial loading state (only show if no data is loaded yet)
  if (isPending && !posts) return <div>Loading...</div>;
  // Handle error state
  if (isError)
    return <div>Error fetching posts: {error?.message || 'Unknown error'}</div>;

  return noFriends ? (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-[70%] flex-col items-center justify-center gap-[12px]'>
        <p className='text-h30 font-cygre text-center text-white'>
          {t('noFriendsYet')}
        </p>
        <p className='text-m10 font-cygre text-center text-white'>
          {t('inviteFriends')}
        </p>
      </div>
    </div>
  ) : ready ? (
    <Swiper
      modules={[Virtual]}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      threshold={isAndroid ? 5 : 10}
      touchRatio={isAndroid ? 1.5 : 1}
      resistanceRatio={0}
      longSwipesRatio={0.1}
      allowTouchMove={!isOpen}
      direction={'vertical'}
      slidesPerView={1}
      spaceBetween={0}
      className='h-full w-full'
      loop={false}
      virtual
      initialSlide={currentIndex}
      onSlideChangeTransitionEnd={handleSlideChange}
    >
      {posts.map((post, index) => (
        // Render each post within a SwiperSlide using the index as the virtual index
        <SwiperSlide
          key={post.id}
          virtualIndex={index}
          className='h-full w-full'
        >
          {/* Render your actual Post component */}
          {/* Add check: Only render Post content if slide is active/nearby? Swiper Virtual usually handles this */}
          <Post post={post} />
        </SwiperSlide>
      ))}
      {/* Loading indicator shown while fetching subsequent pages */}
      {isFetchingNextPage && (
        <div className='p-4 text-center'>Loading more...</div>
      )}

      {/* End of content message */}
      {!hasNextPage && !isFetchingNextPage && posts && posts.length > 0 && (
        <div className='p-4 text-center text-gray-500'>No more posts.</div>
      )}

      {/* The element that triggers the intersection observer */}
      {/* Assign intersectionRef here. Give it a small height just in case. */}
      {/* <div ref={intersectionRef} className='h-0'></div> */}
    </Swiper>
  ) : null;
};
