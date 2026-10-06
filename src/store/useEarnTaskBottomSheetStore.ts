import { create } from 'zustand';
import { Task } from '@/api';

interface BottomSheetState {
  history: Task[];
  isOpen: boolean;
  open: (data: Task) => void;
  back: () => void;
  close: () => void;
  isDailyOpen: boolean;
  toggleDaily: (isOpen: boolean) => void;
  updateHistory: (updater: (task: Task) => Task) => void;
}

export const useEarnTaskBottomSheetStore = create<BottomSheetState>(
  (set, get) => ({
    history: [],
    isOpen: false,
    isDailyOpen: false,
    open: (data) =>
      set((state) => ({
        history: [...state.history, data],
        isOpen: true,
      })),
    back: () => {
      const { history } = get();
      if (history.length > 1) {
        set((state) => ({
          history: state.history.slice(0, -1),
        }));
      } else {
        set({ isOpen: false, history: [] });
      }
    },
    updateHistory: (updater) =>
      set((state) => {
        const updatedHistory = [...state.history];
        if (updatedHistory.length > 0) {
          const lastIndex = updatedHistory.length - 1;
          updatedHistory[lastIndex] = updater(updatedHistory[lastIndex]);
        }
        return { history: updatedHistory };
      }),

    close: () => set({ isOpen: false, history: [] }),
    toggleDaily: (isOpen) => set({ isDailyOpen: isOpen }),
  }),
);
