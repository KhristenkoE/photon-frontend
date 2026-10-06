'use client';

import { MomentPosts } from './components/MomentPosts';
import { MomentTopNavigation } from './components/MomentTopNavigation';
import { WithNavigation } from '@/hoc/WithNavigation';
import { useBackButton } from '@/hooks/useBackButton';
import { useBottomSheetStore, useUserStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Overlay } from '@/components/pages/Feed/components/Overlay';
import { useSearchParams } from 'next/navigation';

function MomentFeedComponent() {
  const { close } = useBottomSheetStore();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const myTgId = useUserStore((state) => state.user?.telegramId);
  const userTgId = searchParams.get('userTgId');

  useBackButton({
    onClick: () => {
      close();
      if (myTgId && userTgId) {
        const url =
          Number(myTgId) === Number(userTgId)
            ? '/profile/me'
            : `/profile/${userTgId}`;
        push(url);
      } else {
        push('/profile/me');
      }
    },
  });

  return (
    <div className='h-screen-height relative bg-[#252525] pb-[var(--feed-padding-bottom)]'>
      <MomentTopNavigation />
      <MomentPosts />
      <Overlay />
    </div>
  );
}

export const MomentFeed = WithNavigation(MomentFeedComponent, 'light');
