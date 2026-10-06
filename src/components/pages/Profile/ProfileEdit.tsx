'use client';

import CameraPlusIcon from '@/../public/assets/icons/camera-plus.svg';
import CameraIcon from '@/../public/assets/icons/camera.svg';
import LandscapeIcon from '@/../public/assets/icons/landscape.svg';
import { PrivacyType, useUploadMedia, useUserMe } from '@/api';
import { ListItemType } from '@/components/common/Navigation/types';
import { AppBottomSheet } from '@/components/ui/BottomSheet';
import { CameraButton } from '@/components/ui/CameraButton';
import { useRouter as useLocaleRouter } from '@/i18n/navigation';
import { useBottomSheetStore, useImageEditorStore } from '@/store';
import { useForm } from '@tanstack/react-form';
import {
  hideBackButton,
  onBackButtonClick,
  retrieveLaunchParams,
  showBackButton,
} from '@telegram-apps/sdk-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileEditSelect } from './components/ProfileEditSelect/ProfileEditSelect';
import SendCommentButtonIcon from '@/../public/assets/icons/send-comment-button.svg';

export const ProfileEdit = () => {
  const [editBioButtonShow, setEditBioButtonShow] = useState(false);
  const [isProfilePhotoLoading, setIsProfilePhotoLoading] = useState(false);

  const { tgWebAppPlatform } = retrieveLaunchParams();

  const t = useTranslations('ProfilePage');

  const router = useRouter();
  const { push } = useLocaleRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { open, history, close } = useBottomSheetStore();
  const { imageFile, resetEditor } = useImageEditorStore();
  const uploadMedia = useUploadMedia();
  const { user, updateUserProfile } = useUserMe();

  const optionsList = [
    {
      title: t('edit.privacySettings.options.private'),
      value: PrivacyType.PRIVATE,
    },
    {
      title: t('edit.privacySettings.options.friends'),
      value: PrivacyType.FRIENDS,
    },
    {
      title: t('edit.privacySettings.options.public'),
      value: PrivacyType.PUBLIC,
    },
  ];

  const form = useForm({
    defaultValues: {
      bio: user?.data?.data?.profile?.bio ?? '',
      profilePermission:
        user?.data?.data?.profile?.settings?.privacyType ?? PrivacyType.PUBLIC,
      vibelistPermission: PrivacyType.PUBLIC,
      wishlistPermission: PrivacyType.PUBLIC,
      momentPermission: PrivacyType.PUBLIC,
      subscribeConfirmation:
        user?.data?.data?.profile?.settings?.requireFollowVerification ?? true,
    },
  });

  const currentBottomSheetData = history[history.length - 1];

  const getImage = () => {
    const avatar = user?.data?.data?.profile?.avatar;
    if (!avatar?.key && !avatar?.url) return '/assets/icons/avatar-empty.svg';
    const src = avatar.key
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${avatar.key}`
      : avatar.url;

    return src;
  };

  const onFocus = () => setEditBioButtonShow(true);

  const onBlur = () => {
    setTimeout(() => {
      setEditBioButtonShow(false);
    }, 150);
  };

  const onClickEditPhoto = () => {
    const optionsList =
      tgWebAppPlatform === 'android'
        ? [
            {
              id: ListItemType.FromGallery,
              title: t('edit.ava.fromGallery'),
              icon: LandscapeIcon,
            },
          ]
        : [
            {
              id: ListItemType.FromGallery,
              title: t('edit.ava.fromGallery'),
              icon: LandscapeIcon,
            },
            {
              id: ListItemType.Camera,
              title: t('edit.ava.fromCamera'),
              icon: CameraIcon,
            },
          ];

    open({
      title: t('edit.ava.title'),
      list: optionsList,
    });
  };

  const onEditProfile = (value: unknown, field: string) => {
    if (field === 'profilePermission') {
      updateUserProfile.mutate({
        settings: {
          privacyType: value as PrivacyType,
        },
      });
    } else if (field === 'bio') {
      updateUserProfile.mutate({
        profile: {
          bio: value as string,
        },
      });
    } else if (field === 'subscribeConfirmation') {
      updateUserProfile.mutate({
        settings: {
          requireFollowVerification: value as boolean,
        },
      });
    }
  };

  useEffect(() => {
    if (!isProfilePhotoLoading) {
      showBackButton();
    } else {
      hideBackButton();
    }

    const removeListener = onBackButtonClick(() => {
      router.replace(
        `${window.location.pathname.replace('/edit', '')}?fromEdit=true`,
      );
    });

    return () => {
      removeListener();
      hideBackButton();
    };
  }, [isProfilePhotoLoading]);

  useEffect(() => {
    const removeSearchParams = () => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete('profileAvaEdited');

      router.replace(`${pathname}?${nextSearchParams}`);
    };

    const updateProfileAvatar = async () => {
      if (!imageFile) return;

      setIsProfilePhotoLoading(true);

      const mediaResponse = await uploadMedia.mutateAsync({
        file: imageFile,
      });

      await updateUserProfile.mutateAsync({
        profile: {
          avatarId: mediaResponse.data.id,
          avatarKey: mediaResponse.data.key,
        },
      });

      setIsProfilePhotoLoading(false);
      resetEditor();
    };

    if (searchParams.has('profileAvaEdited')) {
      updateProfileAvatar();
      removeSearchParams();
    }
  }, []);

  const onCameraClose = () => {
    close();
    push('/image');
  };

  if (isProfilePhotoLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#A4A4A8] border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='pt-safe-content-top h-[100vh]'>
      <div className='p-6'>
        <div
          className='relative mx-auto h-[108px] w-[120px] rounded-3xl'
          onClick={onClickEditPhoto}
        >
          <img
            src={getImage() as string}
            alt='profile ava'
            className='h-full w-full rounded-3xl object-cover'
          />
          <div className='absolute top-0 right-0 bottom-0 left-0 rounded-3xl bg-gradient-to-b from-black/0 via-black/27 to-black/92'></div>
          <CameraPlusIcon className='absolute top-1/2 left-1/2 h-[32px] w-[32px] -translate-x-1/2 -translate-y-1/2 transform' />
        </div>
      </div>
      <div className='px-4 py-3'>
        <p className='text-l20 text-[#A4A4A8]'>{t('edit.bio.title')}</p>
        <form.Field
          name='bio'
          children={(field) => (
            <div className='flex items-end justify-center gap-[10px] rounded-[16px] bg-[var(--background-color-2)] pt-[12px] pr-[16px] pb-[12px] pl-[16px]'>
              <textarea
                rows={3}
                value={field.state.value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className='font-cygre text-m10 max-h-[118px] w-full resize-none placeholder-(--third-text-color) focus:outline-none'
              />
              <button
                className={editBioButtonShow ? 'visible' : 'invisible'}
                onClick={() => {
                  onEditProfile(form.getFieldValue('bio'), 'bio');
                  onBlur();
                }}
              >
                <SendCommentButtonIcon className='min-w-[40px]' />
              </button>
            </div>
          )}
        />
      </div>
      <div className='text-l20'>
        <div className='flex items-center justify-between py-3.5 pr-3.5 pl-4'>
          <p className='text-l20 text-[#A4A4A8]'>
            {t('edit.privacySettings.title')}
          </p>
        </div>
        <form.Field
          name='profilePermission'
          children={(field) => (
            <ProfileEditSelect
              label={t('edit.privacySettings.profilePermissions')}
              options={optionsList}
              value={field.state.value}
              onChange={(value) => {
                field.handleChange(value);
                onEditProfile(value, field.name);
              }}
            />
          )}
        />
      </div>
      {/* <Button
        variant={'default'}
        size={'large'}
        className={`fixed right-4 left-4 transition-none ${editBioButtonShow ? 'visible' : 'invisible'}`}
        style={{
          bottom: `${isViewportResized ? '16px' : 'calc((var(--screen-height) - var(--tg-viewport-height)) + 16px)'}`,
        }}
        onClick={() => {
          onEditProfile(form.getFieldValue('bio'), 'bio');
        }}
      >
        {t('edit.bio.save')}
      </Button> */}
      <AppBottomSheet>
        <ul className='flex flex-col pb-6'>
          {currentBottomSheetData?.list.map((item) => (
            <CameraButton
              cb={onCameraClose}
              capture={item.id === ListItemType.Camera ? 'environment' : false}
              key={item.id ?? item.title}
              icon={item.icon}
              title={item.title}
              redirectUrl={'profile/me/edit?profileAvaEdited=true'}
              aspectRatio={{
                aspectRatio: 1 / 1,
                minAspectRatio: 1 / 1,
                maxAspectRatio: 1 / 1,
              }}
            />
          ))}
        </ul>
      </AppBottomSheet>
    </div>
  );
};
