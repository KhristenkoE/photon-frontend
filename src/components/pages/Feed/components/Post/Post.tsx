'use client';

import { Actions } from './Actions/Actions';
import { Information } from './Information';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PostType } from '@/api/types/posts';
import { LazyImage } from '@/components/pages/Feed/components/Post/LazyImage';
import { useSetViewPost } from '@/api/hooks/usePosts';
import { useTranslations } from 'next-intl';
import { NO_FRIENDS_POST_YET } from '@/store/postsStore/postsStore';

export function Post({ post }: { post: PostType }) {
  const { mutate } = useSetViewPost();
  const t = useTranslations('FeedPost');
  // Just track expansion state, no need for height
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Simplified handler that only cares about expansion state
  const handleDescriptionExpand = (expanded: boolean) => {
    setIsDescriptionExpanded(expanded);
  };

  // Animation transition (same as description)
  const animationTransition = {
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1],
  };

  useEffect(() => {
    mutate(post.id);
  }, []);

  return post.id === NO_FRIENDS_POST_YET ? (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-[70%] flex-col items-center justify-center gap-[12px]'>
        <p className='text-h30 font-cygre text-center text-white'>
          {t('noNewPostsYet')}
        </p>
        <p className='text-m10 font-cygre text-center text-white'>
          {t('checkBackLater')}
        </p>
      </div>
    </div>
  ) : (
    <div className='relative h-full w-full text-white'>
      <LazyImage
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${post.media.key}`}
        alt='Post image'
        className='mask-b-from-50% mask-b-to-100%'
      />
      {/* Fixed height gradient with opacity animation only */}
      <motion.div
        aria-hidden='true'
        initial={{ opacity: 0 }}
        animate={{ opacity: isDescriptionExpanded ? 1 : 0 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Fixed height that's always tall enough (50vh = half the viewport)
          height: '100vh',
          background:
            'linear-gradient(to top, rgba(37, 37, 37, 0.85) 0%, rgba(37, 37, 37, 0.55) 50%, rgba(37, 37, 37, 0.05) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* UI container */}
      <div className='relative z-[var(--feed-ui-z-index)] grid h-full w-full grid-cols-[1fr_32px] items-end gap-1 px-[var(--container-x-padding)] pb-6'>
        <Information
          isFollowing={post.isFollowing}
          onDescriptionExpand={handleDescriptionExpand}
          animationTransition={animationTransition}
          longDescription={post.description}
          user={post.user}
        />
        <Actions
          postUserTelegramId={post.user.telegramId}
          isLiked={post.isLiked}
          commentCount={post.commentCount}
          repostCount={post.repostCount}
          likeCount={post.likeCount}
          postId={post.id}
        />
      </div>
    </div>
  );
}
