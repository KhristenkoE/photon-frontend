'use client';

import { useEffect, useRef, useState } from 'react';
import { Cropper, CropperRef } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css';
import { useBottomSheetStore, useImageEditorStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/i18n/navigation';
import { useMomentListItems } from '@/components/common/Navigation/hooks/useMomentListItems';
import { useBackButton } from '@/hooks/useBackButton';
import { cn } from '@/lib/utils';

export const ImageEditor = () => {
  const {
    imageUrl,
    originalImageUrl,
    originalImageFile,
    setImageUrl,
    setImageFile,
    aspectRatio,
  } = useImageEditorStore();

  const cropperRef = useRef<CropperRef>();
  const momentListItems = useMomentListItems();
  const { open } = useBottomSheetStore();

  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  useBackButton({ withoutHide: true });

  useEffect(() => {
    const src = imageUrl || originalImageUrl;
    if (!src) {
      open(momentListItems);
      push('/profile/me');
      return;
    }

    setIsImageReady(false);

    const img = new Image();
    img.onload = () => setIsImageReady(true);
    img.onerror = () => {
      open(momentListItems);
      push('/profile/me');
    };
    img.src = src;
  }, [imageUrl, originalImageUrl]);

  useEffect(() => {
    if (isLoading) setTimeout(onSubmit, 10);
  }, [isLoading]);

  const onSubmit = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return setIsLoading(false);

    const croppedImageUrl = canvas.toDataURL();
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', {
            type: 'image/jpeg',
          });
          setImageUrl(croppedImageUrl);
          setImageFile(file);
          push('/image');
        } else {
          setIsLoading(false);
          console.error('Error while creating image as blob file');
        }
      },
      'image/jpeg',
      1,
    );
  };

  const reset = () => {
    setImageUrl(originalImageUrl);
    setImageFile(originalImageFile);
    cropperRef.current?.reset();
  };

  if (!imageUrl || !isImageReady) return null;

  return (
    <section
      style={{
        paddingBottom: 'calc(var(--safe-content-area-inset-bottom) + 16px)',
      }}
      className='pt-safe-content-top grid h-screen w-screen grid-rows-[1fr_min-content] bg-black'
    >
      <Cropper
        className={cn(
          isLoading && 'pointer-events-none',
          'h-full w-full self-center',
        )}
        ref={cropperRef}
        src={imageUrl || originalImageUrl}
        onError={() => reset()}
        stencilProps={aspectRatio}
      />
      <div className='mt-8 flex items-center justify-between px-5'>
        <Button disabled={isLoading} onClick={reset} variant='secondary'>
          Сбросить
        </Button>
        <Button isLoading={isLoading} onClick={() => setIsLoading(true)}>
          Готово
        </Button>
      </div>
    </section>
  );
};
