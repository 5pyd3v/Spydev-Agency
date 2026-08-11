import { axiosClient } from './axiosClient';
import type { ApiSuccess, SiteSettings } from '@/types';

export const settingsApi = {
  get: () => axiosClient.get<ApiSuccess<SiteSettings>>('/settings').then((r) => r.data.data),

  update: (payload: Partial<SiteSettings>) =>
    axiosClient.put<ApiSuccess<SiteSettings>>('/settings', payload).then((r) => r.data.data),
};
