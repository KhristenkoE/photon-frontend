import { useApplicationStore } from '@/store/applicationStore';
import { cloudStorage } from '@telegram-apps/sdk-react';
import { UserBase } from '@/api';

// Token storage keys
const KEYS = {
  ACCESS_TOKEN: '_act',
  REFRESH_TOKEN: '_rft',
  USER_DATA: '_ud',
};

// localStorage fallback prefix
const LOCAL_STORAGE_PREFIX = 'tg_mock_';

/**
 * Mock CloudStorage implementation using localStorage
 */
const mockCloudStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  },

  deleteItem: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

/**
 * Get the appropriate storage based on environment
 */
const getStorage = () => {
  const isTMA = useApplicationStore.getState().isTMA;

  // If we're in TMA environment and CloudStorage is supported
  if (isTMA && cloudStorage.isSupported()) {
    return cloudStorage;
  }

  // Use localStorage mock in non-TMA environments or when CloudStorage not supported
  return mockCloudStorage;
};

/**
 * Save tokens to storage (CloudStorage in TMA, localStorage otherwise)
 */
export const saveTokensToCloudStorage = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    const storage = getStorage();

    // Store tokens
    await Promise.all([
      storage.setItem(KEYS.ACCESS_TOKEN, accessToken),
      storage.setItem(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  } catch (error) {
    console.error('Failed to save tokens to storage:', error);
  }
};

/**
 * Save user data to storage (CloudStorage in TMA, localStorage otherwise)
 */
export const saveUserToCloudStorage = async (user: UserBase): Promise<void> => {
  try {
    const storage = getStorage();

    // Store user data
    await Promise.all([storage.setItem(KEYS.USER_DATA, JSON.stringify(user))]);
  } catch (error) {
    console.error('Failed to save user data to storage:', error);
  }
};

/**
 * Get tokens from storage (CloudStorage in TMA, localStorage otherwise)
 */
export const getTokensFromCloudStorage = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: string | null;
}> => {
  try {
    const storage = getStorage();

    // Get tokens
    const [accessToken, refreshToken, user] = await Promise.all([
      storage.getItem(KEYS.ACCESS_TOKEN),
      storage.getItem(KEYS.REFRESH_TOKEN),
      storage.getItem(KEYS.USER_DATA),
    ]);

    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (error) {
    console.error('Failed to get tokens from storage:', error);
    return { accessToken: null, refreshToken: null, user: null };
  }
};

/**
 * Remove tokens from storage (CloudStorage in TMA, localStorage otherwise)
 */
export const removeTokensFromCloudStorage = async (): Promise<void> => {
  try {
    const storage = getStorage();

    // Remove tokens
    await Promise.all([
      storage.deleteItem(KEYS.ACCESS_TOKEN),
      storage.deleteItem(KEYS.REFRESH_TOKEN),
      storage.deleteItem(KEYS.USER_DATA),
    ]);
  } catch (error) {
    console.error('Failed to remove tokens from storage:', error);
  }
};
