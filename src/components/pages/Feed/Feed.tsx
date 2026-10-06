'use client';

import { Overlay } from './components/Overlay';
import { Posts } from './components/Posts';
import { TopNavigation } from './components/TopNavigation';
import { WithNavigation } from '@/hoc/WithNavigation';
import { useEffect, useMemo, useState } from 'react';
import {
  useInfiniteFriendsPosts,
  useInfinitePosts,
} from '@/api/hooks/usePosts';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { usePostsStore } from '@/store/postsStore/postsStore';
import { throttle } from 'lodash';
import type { Swiper as SwiperType } from 'swiper';
import { showInterstitialAd } from '@/utils/showInterstitialAd';
import { AD_INTERVAL } from '@/api/constants';

function FeedComponent() {
  const [isFeed, setIsFeed] = useState(true);

  const launchParams = retrieveLaunchParams();
  // TODO: improve
  const lang =
    launchParams.tgWebAppData?.user?.language_code === 'ru' ? 'ru' : 'en';

  const {
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(lang ?? 'en');

  const {
    isPending: isPendingFriends,
    isError: isErrorFriends,
    error: errorFriends,
    fetchNextPage: fetchNextPageFriends,
    hasNextPage: hasNextPageFriends,
    isFetchingNextPage: isFetchingNextPageFriends,
  } = useInfiniteFriendsPosts(lang ?? 'en');

  const {
    posts,
    hasAdBeenShown,
    markAdAsShown,
    friendsPosts,
    setCurrentIndex,
    currentIndex,
    currentIndexFriends,
    resetInitialized,
    noFriends,
  } = usePostsStore();

  const throttledFetchNextPage = useMemo(() => {
    return throttle(() => {
      void fetchNextPage();
    }, 1000);
  }, [fetchNextPage]);

  const throttledFetchNextFriendsPage = useMemo(() => {
    return throttle(() => {
      void fetchNextPageFriends();
    }, 1000);
  }, [fetchNextPageFriends]);

  const handleSlideChange = (swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setCurrentIndex(index, isFeed);

    const isAdSlide = (index + 1) % AD_INTERVAL === 0;
    if (isAdSlide && !hasAdBeenShown(index, isFeed)) {
      showInterstitialAd();
      markAdAsShown(index, isFeed);
    }

    if (isFeed) {
      if (index >= posts.length - 2 && hasNextPage && !isFetchingNextPage) {
        resetInitialized(isFeed);
        throttledFetchNextPage();
      }
    } else {
      if (
        index >= friendsPosts.length - 2 &&
        hasNextPageFriends &&
        !isFetchingNextPageFriends
      ) {
        resetInitialized(isFeed);
        throttledFetchNextFriendsPage();
      }
    }
  };

  useEffect(() => {
    if (
      !isFeed &&
      currentIndexFriends >= friendsPosts.length - 2 &&
      hasNextPageFriends &&
      !isFetchingNextPageFriends
    ) {
      resetInitialized(isFeed);
      throttledFetchNextFriendsPage();
    }
  }, [isFeed]);

  return (
    <div className='h-screen-height relative bg-[#252525] pb-[var(--feed-padding-bottom)]'>
      <TopNavigation isFeed={isFeed} setIsFeed={setIsFeed} />
      {isFeed && (
        <Posts
          posts={posts}
          currentIndex={currentIndex}
          throttledFetchNextPage={throttledFetchNextPage}
          isPending={isPending}
          isError={isError}
          error={error}
          handleSlideChange={handleSlideChange}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
        />
      )}
      {!isFeed && (
        <Posts
          noFriends={noFriends}
          posts={friendsPosts}
          currentIndex={currentIndexFriends}
          throttledFetchNextPage={throttledFetchNextPage}
          isPending={isPendingFriends}
          isError={isErrorFriends}
          error={errorFriends}
          handleSlideChange={handleSlideChange}
          isFetchingNextPage={isFetchingNextPageFriends}
          hasNextPage={hasNextPageFriends}
        />
      )}
      <Overlay />
    </div>
  );
}

export const Feed = WithNavigation(FeedComponent, 'light');
