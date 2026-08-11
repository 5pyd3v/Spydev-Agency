import { axiosClient } from './axiosClient';
import type { ApiSuccess, HomepageSection } from '@/types';

export const homepageSectionsApi = {
  listPublic: () => axiosClient.get<ApiSuccess<HomepageSection[]>>('/homepage-sections').then((r) => r.data.data),

  listAll: () =>
    axiosClient.get<ApiSuccess<HomepageSection[]>>('/homepage-sections/admin/all').then((r) => r.data.data),

  create: (payload: Partial<HomepageSection>) =>
    axiosClient.post<ApiSuccess<HomepageSection>>('/homepage-sections', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<HomepageSection>) =>
    axiosClient.put<ApiSuccess<HomepageSection>>(`/homepage-sections/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/homepage-sections/${id}`).then((r) => r.data),

  reorder: (items: { id: string; order: number; enabled?: boolean }[]) =>
    axiosClient
      .patch<ApiSuccess<HomepageSection[]>>('/homepage-sections/reorder', { items })
      .then((r) => r.data.data),
};
