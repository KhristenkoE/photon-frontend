import { useQuery, useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useUserStore } from '@/store/userStore/userStore';

export const authKeys = {
  auth: ['auth'] as const,
  refresh: ['auth', 'refresh'] as const,
};

export const useTelegramAuth = (initData: string) => {
  const { setAuthData } = useUserStore();

  return useQuery({
    queryKey: authKeys.auth,
    queryFn: async () => {
      const response = await authService.telegramAuth(initData);

      // Store auth data in userStore and CloudStorage
      if (response) {
        setAuthData(response.data);
      }

      return response;
    },
    enabled: false,
  });
};

// Hook for refreshing access token
export const useRefreshToken = () => {
  const { updateTokens, refreshToken, clearAuth } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const response = await authService.refreshToken(refreshToken);

        if (!response) {
          throw new Error('No response from refreshToken');
        }

        updateTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        return response;
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
  });
};
