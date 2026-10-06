'use client';
import { ImagePreviewActions } from './components/ImagePreviewActions';
import { useBottomSheetStore, useImageEditorStore } from '@/store';
import { AppBottomSheet } from '@/components/ui/BottomSheet';
import { ListItemType } from '@/components/common/Navigation/types';
import { useMomentListItems } from '@/components/common/Navigation/hooks/useMomentListItems';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useBackButton } from '@/hooks/useBackButton';
import { CameraButton } from '@/components/ui/CameraButton';

export const ImagePreview = () => {
  const { imageUrl } = useImageEditorStore();
  const { close, open, history } = useBottomSheetStore();
  const currentBottomSheetData = history[history.length - 1];
  const momentListItems = useMomentListItems();
  const router = useRouter();
  useBackButton();

  useEffect(() => {
    if (!imageUrl) {
      open(momentListItems);
      router.push('/profile/me');
    }
  }, [imageUrl, router]);

  if (!imageUrl) return null;

  return (
    <section className='bg-black'>
      <AppBottomSheet>
        <ul className='flex flex-col pb-6'>
          {currentBottomSheetData?.list.map((item) => (
            <CameraButton
              cb={close}
              capture={item.id === ListItemType.Camera ? 'environment' : false}
              key={item.id ?? item.title}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </ul>
      </AppBottomSheet>
      {imageUrl ? (
        <img
          className='fixed top-[50%] left-0 -z-10 h-screen w-screen translate-y-[-50%] bg-black object-contain'
          src={imageUrl}
          alt=''
        />
      ) : (
        'No image found.'
      )}
      <ImagePreviewActions />
    </section>
  );
};
