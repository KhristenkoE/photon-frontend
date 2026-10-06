import { routing } from '@/i18n/routing';
import { formats } from '@/i18n/request';
import messages from './messages/en.json';
import { Telegram } from '@twa-dev/types';
import { Sonar } from './sonar';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}

declare global {
  interface Window {
    Telegram: Telegram;
    Sonar: Sonar;
  }
}
