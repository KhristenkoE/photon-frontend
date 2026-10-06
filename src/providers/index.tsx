'use client';

import { Locale, NextIntlClientProvider } from 'next-intl';
import { PostHogProvider } from './PostHog';
import { ReactQueryProvider } from './ReactQuery';
import { TMAProvider } from './TMA/TMA';
import { useZoomPrevention } from '@/hooks/useZoomPrevention';
import { ToastContainer } from 'react-toastify';
import { TelegramAnalyticsProvider } from './TelegramAnalytics';
import { SkeletonTheme } from 'react-loading-skeleton';
import { TonConnectProvider } from './TonConnect';
import { RewardProvider } from '@/providers/RewardProvider';
import { GlobalDataProvider } from '@/providers/GlobalDataProvider';
import { DrawerProvider } from './Drawer';

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}) {
  useZoomPrevention();

  return (
    <NextIntlClientProvider locale={locale as Locale} messages={messages}>
      <PostHogProvider>
        <TelegramAnalyticsProvider>
          <ReactQueryProvider>
            <SkeletonTheme
              borderRadius={'16px'}
              baseColor='#f4f4f4'
              highlightColor='#d6d6d6'
            >
              <TMAProvider>
                <TonConnectProvider>
                  <GlobalDataProvider>
                    <RewardProvider>
                      <DrawerProvider>{children}</DrawerProvider>
                    </RewardProvider>
                  </GlobalDataProvider>
                </TonConnectProvider>
              </TMAProvider>
              <ToastContainer icon={false} />
            </SkeletonTheme>
          </ReactQueryProvider>
        </TelegramAnalyticsProvider>
      </PostHogProvider>
    </NextIntlClientProvider>
  );
}
