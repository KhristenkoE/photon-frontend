export const getAppShareUrl = (telegramId?: string | number) => {
  const appUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL;
  if (!appUrl || !telegramId) return '';

  try {
    const url = new URL(appUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    url.searchParams.set('startapp', `ref${telegramId}_profile`);
    return url.toString();
  } catch {
    return '';
  }
};
