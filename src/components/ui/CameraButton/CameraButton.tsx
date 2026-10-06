'use client';
import {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  SVGProps,
} from 'react';
import { useImageEditorStore } from '@/store';
import { AspectRatio } from '@/types/image';

interface CameraInputProps extends PropsWithChildren {
  icon?: FC<SVGProps<SVGSVGElement>>;
  capture?: InputHTMLAttributes<HTMLInputElement>['capture'];
  title?: string;
  aspectRatio?: AspectRatio;
  redirectUrl?: string;
  cb?: () => void;
}

export const CameraButton = ({
  children,
  capture = 'environment',
  icon: Icon,
  title,
  redirectUrl = '/moment/create',
  aspectRatio = {
    aspectRatio: 9 / 16,
    minAspectRatio: 9 / 16,
    maxAspectRatio: 9 / 16,
  },
  cb,
}: CameraInputProps) => {
  const {
    setImageUrl,
    setOriginalImageUrl,
    setOriginalImageFile,
    setImageFile,
    setRedirectUrl,
    setAspectRatio,
  } = useImageEditorStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setAspectRatio(aspectRatio);
      setOriginalImageUrl(imgUrl);
      setOriginalImageFile(file);
      setImageUrl(imgUrl);
      setImageFile(file);
      setRedirectUrl(redirectUrl ?? '');
      cb?.();
    }
  };

  return (
    <label>
      {children ?? (
        <div className='flex items-center gap-3 px-4 py-[14px] text-start'>
          {Icon && <Icon width='24px' height='24px' className='text-black' />}
          <div className='text-l20 text-black'>{title}</div>
        </div>
      )}

      <input
        type='file'
        accept='image/*'
        capture={capture}
        onChange={handleChange}
        style={{ display: 'none' }}
        id='camera-input'
      />
    </label>
  );
};
