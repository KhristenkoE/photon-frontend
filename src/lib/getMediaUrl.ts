export const getMediaUrl = (key?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  if (!key || !baseUrl) return null;

  return `${baseUrl.replace(/\/$/, '')}/${key}`;
};
