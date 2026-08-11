import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/types';
import type { Project } from '@/types/entities';
import { createResourceApi } from './createResourceApi';

const base = createResourceApi<Project>('projects');

export const projectsApi = {
  ...base,
  listPublic: (params?: { page?: number; limit?: number; category?: string; featured?: boolean }) =>
    axiosClient.get<ApiSuccess<Project[]>>('/projects', { params }).then((r) => r.data),
};
