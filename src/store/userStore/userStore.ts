import { create } from 'zustand';
import {
  removeTokensFromCloudStorage,
  saveTokensToCloudStorage,
  saveUserToCloudStorage,
} from '@/utils/cloudStorage';
import { UserBase } from '@/api';

interface UserStore {
  user: UserBase | null;
  accessToken: string | null;
  refreshToken: string | null;
  alreadyRegistered?: boolean;

  setAuthData: (data: {
    accessToken: string;
    refreshToken: string;
    user: UserBase;
    alreadyRegistered?: boolean;
  }) => void;
  updateUser: (userData: Partial<UserBase>) => void;
  updateTokens: (tokens: {
    accessToken: string;
    refreshToken?: string;
  }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  initFromCloudStorage: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  alreadyRegistered: false,

  setAuthData: ({ accessToken, refreshToken, user, alreadyRegistered }) => {
    set({ accessToken, refreshToken, user, alreadyRegistered });

    saveTokensToCloudStorage(accessToken, refreshToken);
    saveUserToCloudStorage(user);
  },

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  updateTokens: ({ accessToken, refreshToken }) => {
    const newRefreshToken = refreshToken || get().refreshToken;

    set({
      accessToken,
      refreshToken: newRefreshToken,
    });

    if (accessToken && newRefreshToken) {
      saveTokensToCloudStorage(accessToken, newRefreshToken);
    }
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, refreshToken: null });
    removeTokensFromCloudStorage();
  },

  isAuthenticated: () => !!get().accessToken && !!get().user,

  initFromCloudStorage: async () => {
    // TODO: remake the logic of getting tokens from cloud storage
    // const { accessToken, refreshToken, user } =
    //   await getTokensFromCloudStorage();
    // if (accessToken && refreshToken && user) {
    //   set({ accessToken, refreshToken, user: JSON.parse(user) });
    // }
  },
}));
