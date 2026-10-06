export function getAndroidVersion(): {
  version: string | null;
  oldAndroidVersion: boolean;
} {
  const userAgent = navigator.userAgent;
  const match = userAgent.match(/Android\s([0-9.]+)/);
  const version = match ? match[1] : null;
  return {
    version,
    oldAndroidVersion: version ? Number(version) <= 10 : false,
  };
}
