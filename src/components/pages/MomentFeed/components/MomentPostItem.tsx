import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageByKey } from '@/components/ui/ImageByKey/ImageByKey';
import { Moment } from '@/api';
import { Actions } from '@/components/pages/Feed/components/Post/Actions/Actions';
import { Information } from '@/components/pages/Feed/components/Post/Information';

interface MomentProps {
  moment: Moment;
}

export function MomentPostItem({ moment }: MomentProps) {
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

  return (
    <div className='relative h-full w-full pb-6 text-white'>
      {/* Background image - lowest z-index */}
      <ImageByKey
        className='absolute inset-0 z-[var(--feed-media-z-index)] h-full w-full mask-b-from-50% mask-b-to-100% object-cover'
        imgKey={moment.media.key}
        alt=''
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
          isFollowing={moment.isFollowing}
          onDescriptionExpand={handleDescriptionExpand}
          animationTransition={animationTransition}
          longDescription={moment.description}
          user={moment.user}
        />

        <Actions
          postUserTelegramId={moment.user.telegramId}
          isLiked={moment.isLiked}
          commentCount={moment.commentCount}
          repostCount={moment.repostCount}
          likeCount={moment.likeCount}
          postId={moment.postId}
        />
      </div>
    </div>
  );
}
