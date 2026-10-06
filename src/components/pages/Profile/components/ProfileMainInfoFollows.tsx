'use client';

import { UserMeta, useUser } from '@/api';
import { Button } from '@/components/ui/Button';
import { shortenNumber } from '@/lib/numberUtils';
import { useCallback } from 'react';
import { useFollow } from '@/api/hooks/useFollow';
import { useTranslations } from 'next-intl';
import ShareProfileIcon from '@/../public/assets/icons/share-profile.svg';
import { retrieveLaunchParams, shareURL } from '@telegram-apps/sdk-react';
import { useRouter } from '@/i18n/navigation';
import { getAppShareUrl } from '@/lib/getAppShareUrl';
interface Props {
  me?: boolean;
  userId: string;
}

export const ProfileMainInfoFollows = ({ userId, me = false }: Props) => {
  const { tgWebAppData } = retrieveLaunchParams();
  const { user } = useUser({ userId: userId, me });
  const { follow, unfollow } = useFollow({ userId });

  const t = useTranslations('ProfilePage');

  const followers = user?.data?.meta?.followersCount ?? 0;
  const following = user?.data?.meta?.followingCount ?? 0;

  const shortenedSubscribers = shortenNumber(followers);
  const shortenedSubscribes = shortenNumber(following);

  const isFollowing = !me ? (user?.data?.meta as UserMeta)?.isFollowing : false;

  const router = useRouter();
  const shareLink = getAppShareUrl(tgWebAppData?.user?.id);

  const onFollow = useCallback((isFollow: boolean) => {
    if (userId) {
      if (isFollow) {
        follow.mutate();
      } else {
        unfollow.mutate();
      }
    }
  }, []);

  const onShare = () => {
    if (!shareLink) return;
    shareURL(shareLink, t('shareProfileText'));
  };

  return (
    <div className='mt-5 flex gap-4'>
      {me && (
        <Button
          variant={'secondary'}
          size={'small'}
          icon={<ShareProfileIcon />}
          onClick={onShare}
          disabled={!shareLink}
        >
          {t('share')}
        </Button>
      )}
      {!me && (
        <Button
          variant={'primary'}
          size={'small'}
          onClick={() => onFollow(!isFollowing)}
        >
          {isFollowing ? t('unfollow') : t('follow')}
        </Button>
      )}
      <div
        onClick={() => me && router.push(`/friends?tab=followers`)}
        className='text-xs10 flex flex-col text-white/60'
      >
        <span className='text-m10'>
          {shortenedSubscribers?.value
            ? `${shortenedSubscribers.value}${shortenedSubscribers.unit}`
            : followers}
        </span>
        <span>{t('followers')}</span>
      </div>
      <div
        onClick={() => me && router.push(`/friends?tab=follows`)}
        className='text-xs10 flex flex-col text-white/60'
      >
        <span className='text-m10'>
          {shortenedSubscribes?.value
            ? `${shortenedSubscribes.value}${shortenedSubscribes.unit}`
            : following}
        </span>
        <span>{t('following')}</span>
      </div>
    </div>
  );
};
