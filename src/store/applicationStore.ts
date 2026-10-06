import { create } from 'zustand';

interface ApplicationStore {
  isTMA: boolean;
  setIsTMA: (isTMA: boolean) => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  isTMA: true,
  setIsTMA: (isTMA: boolean) => set({ isTMA }),
}));
