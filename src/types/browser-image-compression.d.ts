declare module 'browser-image-compression' {
  interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    maxIteration?: number;
    exifOrientation?: number;
    fileType?: string;
    initialQuality?: number;
  }

  function imageCompression(
    file: File,
    options: CompressionOptions,
  ): Promise<Blob>;
  export default imageCompression;
}
