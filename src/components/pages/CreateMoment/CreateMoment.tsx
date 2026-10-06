'use client';
import {
  useBottomSheetStore,
  useImageEditorStore,
  useUserStore,
} from '@/store';
import ArrowNarrowIcon from '@/../public/assets/icons/arrow-narrow.svg';
import { FormEvent, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';
import { useUploadMedia } from '@/api';
import { useMoments } from '@/api/hooks/useMoments';
import { useLocale } from 'use-intl';
import { useBackButton } from '@/hooks/useBackButton';
import xss from 'xss';
import { Button } from '@/components/ui/Button';
import * as Sentry from '@sentry/nextjs';
import { useToast } from '@/hooks/useToast';
import { useTranslations } from 'next-intl';
import { MomentLoader } from './components/MomentLoader';
import { Switch } from '@/components/ui/Switch';
import { shareStory } from '@telegram-apps/sdk-react';
import { getAppShareUrl } from '@/lib/getAppShareUrl';

export const CreateMoment = () => {
  const { imageUrl, imageFile, resetEditor } = useImageEditorStore();
  const { close } = useBottomSheetStore();
  const userId = useUserStore((state) => state.user?.id);
  const telegramId = useUserStore((state) => state.user?.telegramId);
  const { createMoment } = useMoments({
    userId: userId as string,
    userTgId: telegramId,
    pageSize: 9,
  });
  const uploadMedia = useUploadMedia();
  const locale = useLocale();
  const { showSuccess, showError } = useToast();
  const t = useTranslations('MomentActionBottomSheet');

  const { push } = useRouter();
  useBackButton({ withoutHide: true });
  useEffect(() => {
    if (!userId) {
      push('/feed');
    }
  }, [userId, push]);

  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isShareToTelegramStory, setIsShareToTelegramStory] = useState<
    boolean | undefined
  >();

  useEffect(() => {
    const isShareToTelegramStory = localStorage.getItem(
      'isShareToTelegramStory',
    );
    if (isShareToTelegramStory) {
      setIsShareToTelegramStory(isShareToTelegramStory === 'true');
    } else {
      setIsShareToTelegramStory(true);
    }
  }, []);

  useEffect(() => {
    if (isLoading) postMoment();
  }, [isLoading]);

  const handleFocus = () => setFocused(true);

  const handleBlur = () => {
    if (!text.trim()) {
      setFocused(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const postMoment = async () => {
    if (!imageFile || !userId) return;

    const trimmedText = text.trim();
    if (trimmedText.length > 2500) {
      showError({
        message: t('validationError', {
          min: 3,
          max: 2500,
        }),
      });
      return;
    }

    try {
      const mediaResponse = await uploadMedia.mutateAsync({
        file: imageFile,
        onProgress: (progress) => {
          setUploadProgress(progress.progress);
        },
      });

      const sanitizedText = xss(trimmedText);

      createMoment.mutate(
        {
          userId,
          description: sanitizedText,
          lang: locale,
          mediaId: mediaResponse.data.id,
          isDraft: false,
        },
        {
          onSuccess: (result) => {
            showSuccess({
              message: t('items.Create.created'),
            });

            if (isShareToTelegramStory) {
              localStorage.setItem('isShareToTelegramStory', 'true');
              shareStory(
                `${process.env.NEXT_PUBLIC_IMAGE_URL}/${mediaResponse.data.key}`,
                {
                  text: sanitizedText,
                  widgetLink: getAppShareUrl(telegramId)
                    ? {
                        url: getAppShareUrl(telegramId),
                        name: 'Photon',
                      }
                    : undefined,
                },
              );
            } else {
              localStorage.setItem('isShareToTelegramStory', 'false');
            }

            resetEditor();
            close();
            push(`/moment/feed?id=${result.id}&userTgId=${telegramId}`);
          },
          onError: (error) => {
            console.error('Error creating moment:', error);
            Sentry.captureException(error, {
              tags: { stage: 'createMoment' },
              extra: {
                userId,
                description: sanitizedText,
                locale,
                mediaId: mediaResponse.data.id,
              },
            });
          },
        },
      );
    } catch (e) {
      console.error('Error uploading media or submitting form:', e);
      Sentry.captureException(e, {
        tags: { stage: 'uploadMedia_or_general' },
        extra: {
          userId,
          fileName: imageFile?.name,
          fileType: imageFile?.type,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <MomentLoader
        isPending={uploadMedia.isPending}
        uploadProgress={uploadProgress}
        imageUrl={imageUrl ?? ''}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        paddingBottom: 'calc(var(--safe-content-area-inset-bottom) + 16px)',
      }}
      className='flex h-screen w-screen flex-col px-4'
    >
      <h2 className='mt-[76px] mb-6 text-center text-[28px] font-medium'>
        {t('items.Create.title')}
      </h2>

      {imageUrl && (
        <div className='mb-10 flex justify-center'>
          <img
            width='144px'
            height='257px'
            className='rounded-2xl object-cover'
            src={imageUrl}
            alt=''
          />
        </div>
      )}

      <div className='relative'>
        <textarea
          className={cn(
            'w-full rounded-2xl bg-[#F4F4F4] px-4 py-3 text-[15px]',
            { 'pr-14': focused },
          )}
          name=''
          id=''
          rows={3}
          maxLength={2500}
          placeholder={t('items.Create.description')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {focused && (
          <Button
            onClick={() => setFocused(false)}
            className='absolute right-2 bottom-[13px] h-10! w-10! rounded-xl'
            variant='default'
            type='button'
          >
            <ArrowNarrowIcon />
          </Button>
        )}
      </div>
      {shareStory.isSupported() && isShareToTelegramStory !== undefined ? (
        <div className='mt-4 grid grid-cols-[1fr_max-content] justify-between gap-2'>
          <div className=''>
            <span className='text-l20 mb-[5px] block'>
              {t('items.ShareToTelegramStory.title')}
            </span>
            <p className='text-s20 text-[#A4A4A8]'>
              {t('items.ShareToTelegramStory.description')}
            </p>
          </div>
          <Switch
            checked={isShareToTelegramStory}
            onCheckedChange={() =>
              setIsShareToTelegramStory(!isShareToTelegramStory)
            }
          />
        </div>
      ) : null}

      <Button
        type='submit'
        className='mt-auto w-full'
        variant='default'
        size='large'
        disabled={!imageUrl || isLoading}
      >
        {isLoading ? t('items.Create.publishing') : t('items.Create.publish')}
      </Button>
    </form>
  );
};
