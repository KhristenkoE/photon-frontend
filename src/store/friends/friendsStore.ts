import { create } from 'zustand';

interface FriendsStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useFriendsStore = create<FriendsStore>((set) => ({
  activeTab: 'referrals',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
}));
