import { create } from 'zustand';

export const useMomentStore = create<{
  lastDeletedMomentId: string | null;
  setLastDeletedMomentId: (id: string | null) => void;
}>((set) => ({
  lastDeletedMomentId: null,
  setLastDeletedMomentId: (id) => set({ lastDeletedMomentId: id }),
}));
