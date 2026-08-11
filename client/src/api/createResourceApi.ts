import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Mirrors the server's `createCrudController` pattern: public list/detail-by-slug
 * plus admin list/get/create/update/delete/reorder under conventional routes.
 */
export function createResourceApi<T>(resource: string) {
  return {
    listPublic: (params?: ListParams) =>
      axiosClient.get<ApiSuccess<T[]>>(`/${resource}`, { params }).then((r) => r.data.data),

    getPublicBySlug: (slug: string) =>
      axiosClient.get<ApiSuccess<T>>(`/${resource}/${slug}`).then((r) => r.data.data),

    listAdmin: (params?: ListParams) =>
      axiosClient.get<ApiSuccess<T[]>>(`/${resource}/admin/all`, { params }).then((r) => r.data),

    getById: (id: string) => axiosClient.get<ApiSuccess<T>>(`/${resource}/admin/${id}`).then((r) => r.data.data),

    create: (payload: Partial<T>) =>
      axiosClient.post<ApiSuccess<T>>(`/${resource}`, payload).then((r) => r.data.data),

    update: (id: string, payload: Partial<T>) =>
      axiosClient.put<ApiSuccess<T>>(`/${resource}/${id}`, payload).then((r) => r.data.data),

    remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/${resource}/${id}`).then((r) => r.data),

    reorder: (items: { id: string; displayOrder: number }[]) =>
      axiosClient.patch<ApiSuccess<null>>(`/${resource}/reorder`, { items }).then((r) => r.data),
  };
}
