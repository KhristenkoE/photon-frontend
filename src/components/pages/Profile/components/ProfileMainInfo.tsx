'use client';

import React from 'react';
import { ProfileTopMenu } from './ProfileTopMenu';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/api';
import { ProfileMainInfoFollows } from './ProfileMainInfoFollows';
import { ProfileMainInfoLoader } from './ProfileMainInfoLoader';
import { useTranslations } from 'next-intl';
import { getUsername } from '@/utils/getUsername';
import { useUserStore } from '@/store/userStore/userStore';

export const ProfileMainInfo = () => {
  const { user: userStore } = useUserStore();
  const router = useRouter();
  const profileId = useParams().profileId as string;

  const me = profileId === `${userStore?.telegramId}` || profileId === 'me';
  const userResponse = useUser({ userId: profileId, me }) || {};
  const user = userResponse.user.data?.data;

  const t = useTranslations('ProfilePage');

  const username = getUsername(user?.username, user?.name, user?.surname);
  const userBio = user?.profile?.bio;

  const getImage = () => {
    const avatar = user?.profile?.avatar;
    if (!avatar?.key && !avatar?.url) return '/assets/icons/avatar-empty.svg';
    const src = avatar.key
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${avatar.key}`
      : avatar.url;
    return src;
  };

  return (
    <div className='ph-no-capture relative flex h-[356px] flex-col justify-end rounded-b-3xl'>
      {userResponse.user.isPending && <ProfileMainInfoLoader />}

      {me && <ProfileTopMenu />}
      {!userResponse.user.isPending && (
        <div className='absolute h-full w-full'>
          <img
            src={getImage() as string}
            className='h-full w-full rounded-b-3xl object-cover after:absolute'
          />

          <div className='absolute top-0 right-0 bottom-0 left-0 rounded-b-3xl bg-gradient-to-b from-black/0 via-black/27 to-black/92'></div>
        </div>
      )}

      {!userResponse.user.isPending && (
        <div className='z-10 flex-col px-4 pb-6'>
          <p className='text-h10 font-bold text-white'>{username}</p>

          {userBio && (
            <div className='text-m10 mt-1.5 line-clamp-5 whitespace-pre-line text-white'>
              {userBio}
            </div>
          )}

          {!userBio && me && (
            <div
              className='text-m10 mt-1.5 text-white/60'
              onClick={() => router.push(window.location.pathname + '/edit')}
            >
              {t('emptyBio')}
            </div>
          )}

          <ProfileMainInfoFollows userId={profileId} me={me} />
        </div>
      )}
    </div>
  );
};
