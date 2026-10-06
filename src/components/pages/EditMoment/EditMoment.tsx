'use client';
import {
  useBottomSheetStore,
  useImageEditorStore,
  useUserStore,
} from '@/store';
import { Button } from '@/components/ui/Button/Button';
import ArrowNarrowIcon from '@/../public/assets/icons/arrow-narrow.svg';
import { FormEvent, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';
import RiveComponent from '@rive-app/react-canvas';
import { useSearchParams } from 'next/navigation';
import { useMoments } from '@/api/hooks/useMoments';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'use-intl';
import { useBackButton } from '@/hooks/useBackButton';
import xss from 'xss';
import { ImageByKey } from '@/components/ui/ImageByKey/ImageByKey';
import { useToast } from '@/hooks/useToast';
import { useTranslations } from 'next-intl';

export const EditMoment = () => {
  const { imageUrl, resetEditor, setImageUrl } = useImageEditorStore();
  const { close } = useBottomSheetStore();
  const searchParams = useSearchParams();
  const momentId = searchParams.get('id');
  const userId = useUserStore((state) => state.user?.id);
  const userTgId = useUserStore((state) => state.user?.telegramId);
  const { push } = useRouter();
  const t = useTranslations();

  const locale = useLocale();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!userId) {
      push('/feed');
      return;
    }
  }, [userId, push]);

  const { moment, updateMoment } = useMoments({
    userTgId: Number(userTgId),
    userId: userId as string,
    momentId: momentId as string,
  });

  useEffect(() => {
    if (moment.data) {
      setText(moment.data.description);
      setImageUrl(moment.data.media.key);
    }
  }, [moment.data, setImageUrl]);

  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleFocus = () => setFocused(true);

  useBackButton({ withoutHide: true });

  const handleBlur = () => {
    if (!text.trim()) {
      setFocused(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText.length > 2500) {
      showError({
        message: t('MomentActionBottomSheet.validationError', {
          min: 3,
          max: 2500,
        }),
      });
      return;
    }
    setIsSubmitLoading(true);

    if (momentId && moment.data) {
      const sanitizedText = xss(trimmedText);
      updateMoment.mutate(
        {
          id: momentId,
          data: {
            description: sanitizedText,
            lang: locale,
            mediaId: moment.data.media.id,
            isDraft: false,
          },
        },
        {
          onSuccess: () => {
            close();
            push(`/moment/feed?id=${momentId}&userTgId=${userTgId}`);
            showSuccess({
              message: t('MomentActionBottomSheet.items.Edit.edited'),
            });
            resetEditor();
          },
          onError: (e) => {
            console.log(e);
            setIsSubmitLoading(false);
          },
          onSettled: () => {
            setIsSubmitLoading(false);
          },
        },
      );
    }
  };

  if (moment.isPending) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (moment.isError) {
    return (
      <div className='p-4 text-center text-red-500'>
        Error loading moment. Please try again.
      </div>
    );
  }

  if ((isSubmitLoading || updateMoment.isPending) && imageUrl) {
    return (
      <section
        style={{
          height: '100dvh',
        }}
        className='flex w-screen flex-col px-4 pb-4'
      >
        {momentId ? (
          <ImageByKey imgKey={imageUrl} />
        ) : (
          <img
            className='fixed top-0 left-0 -z-10 h-screen w-screen bg-black object-cover blur'
            src={imageUrl}
            alt=''
          />
        )}
        <div
          style={{
            background: `linear-gradient(179.89deg, rgba(0, 0, 0, 0) 55.03%, rgba(0, 0, 0, 0.02) 58.53%, rgba(0, 0, 0, 0.09) 64.79%, rgba(0, 0, 0, 0.22) 72.29%, #262626 90.13%),
                linear-gradient(180.02deg, rgba(0, 0, 0, 0.413) -6.67%, rgba(0, 0, 0, 0) 20.11%),
                linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`,
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          }}
          className='fixed top-0 left-0 z-10 h-screen w-screen'
        >
          <RiveComponent src='/assets/loading.riv' />
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex h-screen w-screen flex-col px-4 pb-4'
    >
      <h2 className='mt-[76px] mb-6 text-center text-[28px] font-medium'>
        Момент
      </h2>

      {imageUrl && (
        <div className='mb-10 flex justify-center'>
          {momentId ? (
            <ImageByKey
              width='144px'
              height='257px'
              className='rounded-2xl object-cover'
              imgKey={imageUrl}
            />
          ) : (
            <img
              width='144px'
              height='257px'
              className='rounded-2xl object-cover'
              src={imageUrl}
              alt=''
            />
          )}
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
          placeholder='Описание фото'
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2500}
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

      <Button
        type='submit'
        className='mt-auto w-full'
        variant='default'
        size='large'
      >
        Сохранить
      </Button>
    </form>
  );
};
