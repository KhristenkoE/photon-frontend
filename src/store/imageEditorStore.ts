import { AspectRatio } from '@/types/image';
import { create } from 'zustand';

interface ImageEditorState {
  originalImageUrl: string | null;
  originalImageFile: File | null;
  imageUrl: string | null;
  redirectUrl: string | null;
  aspectRatio: AspectRatio;
  imageFile: File | null;
  setRedirectUrl: (url: string) => void;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setImageFile: (imageUrl: File | null) => void;
  setOriginalImageUrl: (imageUrl: string | null) => void;
  setOriginalImageFile: (imageUrl: File | null) => void;
  resetEditor: () => void;
}

const defaultAspectRatio = {
  aspectRatio: 9 / 16,
  minAspectRatio: 9 / 16,
  maxAspectRatio: 9 / 16,
};

export const useImageEditorStore = create<ImageEditorState>((set, get) => ({
  originalImageUrl: null,
  originalImageFile: null,
  imageUrl: null,
  imageFile: null,
  aspectRatio: defaultAspectRatio,
  redirectUrl: null,

  setRedirectUrl: (url) => {
    set({ redirectUrl: url });
  },

  setAspectRatio: (aspectRatio) => {
    set({ aspectRatio });
  },

  setImageUrl: (image) => {
    set({ imageUrl: image });
  },

  setOriginalImageUrl: (image) => {
    set({ originalImageUrl: image });
  },

  setImageFile: (image) => {
    set({ imageFile: image });
  },

  setOriginalImageFile: (image) => {
    set({ originalImageFile: image });
  },

  resetEditor: () => {
    const originalImage = get().originalImageUrl;
    const imageUrl = get().imageUrl;
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    set({
      imageUrl: null,
      originalImageUrl: null,
      originalImageFile: null,
      imageFile: null,
      redirectUrl: null,
      aspectRatio: defaultAspectRatio,
    });
  },
}));
