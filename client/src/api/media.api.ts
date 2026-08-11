import { axiosClient } from './axiosClient';
import type { ApiSuccess, Media } from '@/types';

export const mediaApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    axiosClient.get<ApiSuccess<Media[]>>('/media', { params }).then((r) => r.data),

  upload: (files: File[], folder = 'spydev', onProgress?: (pct: number) => void) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);
    return axiosClient
      .post<ApiSuccess<Media[]>>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      })
      .then((r) => r.data.data);
  },

  update: (id: string, altText: string) =>
    axiosClient.put<ApiSuccess<Media>>(`/media/${id}`, { altText }).then((r) => r.data.data),

  remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/media/${id}`).then((r) => r.data),
};
