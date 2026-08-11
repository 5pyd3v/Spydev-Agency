import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/types';
import type { BlogPost } from '@/types/entities';

export const blogPostsApi = {
  listPublic: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    axiosClient.get<ApiSuccess<BlogPost[]>>('/blog/posts', { params }).then((r) => r.data),

  getPublicBySlug: (slug: string) =>
    axiosClient.get<ApiSuccess<BlogPost>>(`/blog/posts/${slug}`).then((r) => r.data.data),

  listAdmin: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    axiosClient.get<ApiSuccess<BlogPost[]>>('/blog/posts/admin/all', { params }).then((r) => r.data),

  getById: (id: string) => axiosClient.get<ApiSuccess<BlogPost>>(`/blog/posts/admin/${id}`).then((r) => r.data.data),

  create: (payload: Partial<BlogPost>) =>
    axiosClient.post<ApiSuccess<BlogPost>>('/blog/posts', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<BlogPost>) =>
    axiosClient.put<ApiSuccess<BlogPost>>(`/blog/posts/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/blog/posts/${id}`).then((r) => r.data),
};
