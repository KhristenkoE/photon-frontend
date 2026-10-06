import { apiClient } from '@/api/client';
import { AuthResponse } from '@/api';
import { CF_API_URL, ENDPOINTS } from '../endpoints';
import { getCurrentTime } from '@telegram-apps/sdk-react';
import { useApplicationStore } from '@/store/applicationStore';
import { Temporal } from '@js-temporal/polyfill';
import * as Sentry from '@sentry/nextjs';
const getClientDate = async () => {
  const { isTMA } = useApplicationStore.getState();
  const shouldUseTelegramDate = isTMA && getCurrentTime.isAvailable();
  const date = shouldUseTelegramDate ? await getCurrentTime() : new Date();
  return date.toISOString().split('T')[0].replace(/-/g, '/');
};

export const authService = {
  async telegramAuth(initData: string, referrer?: string) {
    const clientDate = await getClientDate();
    const tz = Temporal.Now.timeZoneId() || 'Etc/GMT';
    try {
      return apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH_TELEGRAM,
        {
          initData,
          clientDate,
          referrer,
          tz,
        },
        {
          baseUrl: CF_API_URL,
        },
      );
    } catch (error: any) {
      if (error.status === 406) {
        return;
      }
      Sentry.captureException('Error in authService.telegramAuth', {
        level: 'fatal',
        // Do not send signed launch data or user details to diagnostics.
      });

      return null;
    }
  },

  async refreshToken(refreshToken: string) {
    try {
      const clientDate = await getClientDate();
      return apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH_REFRESH,
        { refreshToken, clientDate },
        { skipAuth: true, baseUrl: CF_API_URL },
      );
    } catch (error) {
      Sentry.captureException('Error in authService.refreshToken', {
        level: 'fatal',
        extra: { error: error },
      });
    }
  },
};
