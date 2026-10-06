export function getAndroidSDK(): number | null {
  if (typeof navigator === 'undefined') return null;
  const match = navigator.userAgent.match(/SDK (\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
