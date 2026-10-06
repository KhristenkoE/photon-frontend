import { apiClient } from '@/api/client';
import { MEDIA_UPLOAD_URL } from '@/api/endpoints';
import { MediaUploadResponse, UploadProgressCallback } from '@/api/types/types';

export const mediaService = {
  /**
   * Upload a media file with progress tracking
   * @param file - The file to upload
   * @param onProgress - Optional callback to track upload progress
   * @returns Promise with the uploaded file URL
   */
  async uploadFile(
    file: File,
    onProgress?: UploadProgressCallback,
  ): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<MediaUploadResponse>('/', formData, {
      onUploadProgress: (event) => {
        if (onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            progress: Math.round((event.loaded / event.total) * 100),
          });
        }
      },
      baseUrl: MEDIA_UPLOAD_URL,
    });
  },
};
