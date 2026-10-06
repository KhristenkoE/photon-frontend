'use client';

import { CF_API_URL } from '@/api/endpoints';

import {
  backButton,
  closingBehavior,
  init,
  initData,
  LaunchParams,
  miniApp,
  retrieveLaunchParams,
  swipeBehavior,
  themeParams,
  viewport,
} from '@telegram-apps/sdk-react';
import { useCallback, useEffect, useState } from 'react';
import {
  mockTMAViewportVars,
  mockTMA,
  parseStartParam,
  isDesktopPlatform,
} from './utils';
import { useUserStore } from '@/store';
import { authService } from '@/api/services/auth';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { debounce } from 'lodash';
export const useTMA = () => {
  const [isTMAInitialized, setIsTMAInitialized] = useState(false);
  const { setAuthData, initFromCloudStorage } = useUserStore();
  const router = useRouter();
  const locale = useLocale();
  const [isCorrectLocale, setIsCorrectLocale] = useState(false);

  useEffect(() => {
    let launchParams: LaunchParams | undefined;
    try {
      launchParams = retrieveLaunchParams();
    } catch (err) {
      console.error(err);
    }

    const tmaLang =
      launchParams?.tgWebAppData?.user?.language_code === 'ru' ? 'ru' : 'en';

    if (tmaLang === locale) {
      setIsCorrectLocale(true);
    } else {
      router.replace(`/${tmaLang}`);
    }
  }, [locale, router]);

  const bindViewportCssVars = useCallback(() => {
    try {
      const isViewportCssVarsAvailable = viewport.bindCssVars.isAvailable();
      const canBindCssVars = !viewport.isCssVarsBound();
      if (!isViewportCssVarsAvailable) {
        mockTMAViewportVars();
        return;
      }
      canBindCssVars && viewport.bindCssVars();
    } catch (err) {
      Sentry.captureException('Error binding viewport css vars', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initViewport = useCallback(async () => {
    try {
      const isViewportAvailable = viewport.mount.isAvailable();
      const canMount = !viewport.isMounting() && !viewport.isMounted();

      if (!isViewportAvailable) {
        // Mock
        return;
      }

      canMount && (await viewport.mount({ timeout: 3000 }));
      bindViewportCssVars();

      if (isDesktopPlatform()) {
        viewport.exitFullscreen.ifAvailable();
      } else {
        viewport.requestFullscreen.ifAvailable();
      }
    } catch (err) {
      Sentry.captureException('Error initializing viewport', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const bindMiniAppCssVars = useCallback(() => {
    try {
      const isMiniAppCssVarsAvailable = miniApp.bindCssVars.isAvailable();
      const canBindCssVars = !miniApp.isCssVarsBound();

      if (!isMiniAppCssVarsAvailable) {
        return;
      }

      canBindCssVars && miniApp.bindCssVars();
    } catch (err) {
      Sentry.captureException('Error binding mini app css vars', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initMiniApp = useCallback(() => {
    try {
      const isMiniAppAvailable = miniApp.mountSync.isAvailable();
      if (!isMiniAppAvailable) {
        return;
      }

      miniApp.mountSync();
      bindMiniAppCssVars();
    } catch (err) {
      Sentry.captureException('Error initializing mini app', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const bindThemeParamsCssVars = useCallback(() => {
    try {
      const isThemeParamsCssVarsAvailable =
        themeParams.bindCssVars.isAvailable();
      const canBindCssVars = !themeParams.isCssVarsBound();

      if (!isThemeParamsCssVarsAvailable) {
        return;
      }

      canBindCssVars && themeParams.bindCssVars();
    } catch (err) {
      Sentry.captureException('Error binding theme params css vars', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initThemeParams = useCallback(() => {
    try {
      const themeParam = themeParams.mountSync.isAvailable();
      if (!themeParam) {
        return;
      }

      themeParams.mountSync();
      bindThemeParamsCssVars();
    } catch (err) {
      Sentry.captureException('Error initializing theme params', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initCustomCssVars = useCallback(() => {
    const root = document.documentElement;
    const height = window.innerHeight;

    root.style.setProperty('--screen-height', `${height}px`);
  }, []);

  useEffect(() => {
    const debouncedInitCustomCssVars = debounce(initCustomCssVars, 100);
    window.addEventListener('resize', debouncedInitCustomCssVars);
    return () => {
      window.removeEventListener('resize', debouncedInitCustomCssVars);
    };
  }, [initCustomCssVars]);

  const restoreInitData = useCallback(() => {
    try {
      initData.restore();
    } catch (err) {
      Sentry.captureException('Error restoring init data', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initBackButton = useCallback(() => {
    try {
      const isBackButtonAvailable = backButton.mount.isAvailable();
      const canMount = !backButton.isMounted();
      if (!isBackButtonAvailable) {
        return;
      }

      canMount && backButton.mount();
    } catch (err) {
      Sentry.captureException(new Error('Error initializing back button'), {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initSwipeBehavior = useCallback(() => {
    try {
      const isSwipeBehaviorAvailable = swipeBehavior.mount.isAvailable();
      const canMount = !swipeBehavior.isMounted();

      if (!isSwipeBehaviorAvailable || !canMount) {
        return;
      }

      canMount && swipeBehavior.mount();
      swipeBehavior.disableVertical.ifAvailable();
    } catch (err) {
      Sentry.captureException('Error initializing swipe behavior', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const initClosingBehavior = useCallback(() => {
    try {
      const isClosingBehaviorAvailable = closingBehavior.mount.isAvailable();
      const canMount = !closingBehavior.isMounted();

      if (!isClosingBehaviorAvailable || !canMount) {
        return;
      }

      canMount && closingBehavior.mount();
      closingBehavior.enableConfirmation.ifAvailable();
    } catch (err) {
      Sentry.captureException('Error initializing closing behavior', {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, []);

  const authorize = useCallback(async () => {
    // Backend access is opt-in; the archive has no connected service.
    if (!CF_API_URL) return;

    try {
      await initFromCloudStorage();

      const {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      } = useUserStore.getState();

      if (storedAccessToken && storedRefreshToken) {
        // Check for redirection to profile even if already authorized
        const { referrer, toProfile } = parseStartParam();

        if (toProfile && referrer) {
          router.push(`/${locale}/profile/${referrer}?fromInvite=true`);
          return;
        }
        return;
      }

      const rawInitData = initData.raw();

      if (!rawInitData) {
        console.error('No init data available');
        return;
      }

      const { referrer, toProfile } = parseStartParam();

      const response = await authService.telegramAuth(rawInitData, referrer);

      if (!response) {
        throw new Error('Failed to authorize');
      }

      const { accessToken, refreshToken, user } = response.data;
      setAuthData({
        accessToken,
        refreshToken,
        user,
        alreadyRegistered: response.data.meta.alreadyRegistered,
      });

      // After successful authentication, check if we need to redirect to a profile
      if (toProfile && referrer && response.data.meta.alreadyRegistered) {
        setTimeout(() => {
          router.push(`/${locale}/profile/${referrer}?fromInvite=true`);
        }, 300);
      }
    } catch (err) {
      Sentry.captureException(new Error('Error authorizing'), {
        level: 'fatal',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, [setAuthData, router, locale]);

  const initTMA = useCallback(async () => {
    if (!isCorrectLocale) {
      return;
    }

    try {
      await mockTMA();
      init();
      restoreInitData();
      await authorize();
      initBackButton();
      initMiniApp();
      await initViewport();
      bindViewportCssVars();
      initCustomCssVars();
      initThemeParams();
      initSwipeBehavior();
      initClosingBehavior();

      miniApp.ready.ifAvailable();

      setIsTMAInitialized(true);
    } catch (err) {
      Sentry.captureException(new Error('Error initializing TMA'), {
        level: 'error',
        extra: {
          error: err,
        },
      });
      console.error(err);
    }
  }, [
    initViewport,
    bindViewportCssVars,
    initCustomCssVars,
    initMiniApp,
    bindMiniAppCssVars,
    authorize,
    isCorrectLocale,
  ]);

  return {
    isTMAInitialized,
    initTMA,
  };
};
