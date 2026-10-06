import { create } from 'zustand';

interface NavigationStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isOpen: true,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
