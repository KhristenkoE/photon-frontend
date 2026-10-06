import { create } from 'zustand';

interface ProfileScrollStore {
  y: number | null;
  save: (y: number) => void;
  restore: () => number | null;
  clear: () => void;
}

export const useProfileScrollStore = create<ProfileScrollStore>((set, get) => ({
  y: null,
  save: (y) => set({ y }),
  restore: () => get().y,
  clear: () => set({ y: null }),
}));
