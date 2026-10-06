import { useMutation } from '@tanstack/react-query';
import { mediaService, UploadProgress } from '@/api';
import * as Sentry from '@sentry/react';

const compressImage = async (file: File): Promise<File | undefined> => {
  const imageCompression = (await import('browser-image-compression')).default;

  const abortController = new AbortController();

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.9,
    alwaysKeepResolution: true,
    signal: abortController.signal,
  };
  let compressedFile: Blob | undefined;
  try {
    setTimeout(function () {
      if (!compressedFile) {
        abortController.abort(new Error('Compression timed out'));
      }
    }, 7000);
    compressedFile = await imageCompression(file, options);
    if (!compressedFile) {
      throw new Error('Compression timed out');
    }
    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, '.jpg'), {
      type: 'image/jpeg',
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    Sentry.captureException('Error compressing image', {
      level: 'error',
      extra: { error: error, file },
    });

    if (file.size < 1024 * 1024 * 4) {
      return file;
    }
  }
};

const convertToJpeg = async (file: File): Promise<File | undefined> => {
  // Handle HEIC/HEIF format
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    const heic2any = (await import('heic2any')).default;
    const convertedBlob = (await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8,
    })) as Blob;

    // Just convert to JPEG without additional compression
    return new File([convertedBlob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
      type: 'image/jpeg',
    });
  }

  return compressImage(file);
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: UploadProgress) => void;
    }) => {
      try {
        const convertedFile = await convertToJpeg(file);
        if (!convertedFile) {
          throw new Error('Failed to convert file');
        }
        return mediaService.uploadFile(convertedFile, onProgress);
      } catch (error) {
        console.error('Error converting file:', error);
        Sentry.captureException('Error converting file', {
          level: 'error',
          extra: { error: error, file },
        });
        throw error;
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
