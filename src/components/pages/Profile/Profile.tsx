'use client';
import { ProfileTabs } from '@/components/pages/Profile/components/ProfileTabs';
import { WithNavigation } from '@/hoc/WithNavigation';
import { useNavigationStore } from '@/store';
import { useEffect, useRef } from 'react';
import { ProfileMainInfo } from './components/ProfileMainInfo';
import { useProfileScrollStore } from '@/store/profile/profileScrollStore';
import { useBackButton } from '@/hooks/useBackButton';
import { useParams, useSearchParams } from 'next/navigation';
import { UserMeta, useUser } from '@/api';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import LockIcon from '@/../public/assets/icons/lock.svg';
import { useTranslations } from 'next-intl';

const ProfileComponent = () => {
  const { tgWebAppData } = retrieveLaunchParams();
  const profileId = useParams().profileId as string;
  const me = profileId === `${tgWebAppData?.user?.id}` || profileId === 'me';
  const userResponse = useUser({ userId: profileId, me }) || {};
  const allowedToView = !me
    ? (userResponse?.user?.data?.meta as UserMeta)?.allowedToView
    : true;

  const t = useTranslations('ProfilePage');

  const { open, close } = useNavigationStore();
  const { save, restore, clear } = useProfileScrollStore();
  const searchParams = useSearchParams();
  useBackButton({
    isEnabled: !searchParams.has('fromEdit') && !searchParams.has('fromInvite'),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const lastAction = useRef<'open' | 'close' | null>(null);

  useEffect(() => {
    const savedY = restore();
    if (savedY !== null) {
      scrollRef.current?.scrollTo(0, savedY);
      clear();
    }
    return () => {
      open();
    };
  }, []);

  const onScroll = () => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    save(scrollRef.current.scrollTop);

    let currentScrollTop = scrollEl.scrollTop;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

    if (currentScrollTop < 0) currentScrollTop = 0;
    if (currentScrollTop > maxScroll) currentScrollTop = maxScroll;

    const isScrollingDown = currentScrollTop > lastScrollTop.current;
    const isAtTop = currentScrollTop === 0;
    const isAtBottom = currentScrollTop >= maxScroll - 10;

    if (isAtTop) {
      if (lastAction.current !== 'open') {
        open();
        lastAction.current = 'open';
      }
    } else if (isAtBottom) {
      if (lastAction.current !== 'close') {
        close();
        lastAction.current = 'close';
      }
    } else if (isScrollingDown) {
      if (lastAction.current !== 'close') {
        close();
        lastAction.current = 'close';
      }
    } else {
      if (lastAction.current !== 'open') {
        open();
        lastAction.current = 'open';
      }
    }

    lastScrollTop.current = currentScrollTop;
  };
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className='h-screen-height overflow-y-auto'
    >
      <ProfileMainInfo />
      {userResponse.user.isPending && (
        <div className='flex h-[50vh] items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#A4A4A8] border-t-transparent'></div>
        </div>
      )}

      {allowedToView && !userResponse.user.isPending && (
        <div className='mt-6 px-4 pb-4'>
          <ProfileTabs />
        </div>
      )}

      {!allowedToView && !userResponse.user.isPending && (
        <div className='flex h-[50vh] flex-col items-center justify-center'>
          <LockIcon />
          <p className='text-h40 mt-4'>{t('private.title')}</p>
          <p className='text-l20'>{t('private.text')}</p>
        </div>
      )}
    </div>
  );
};

export const Profile = WithNavigation(ProfileComponent, 'light');
