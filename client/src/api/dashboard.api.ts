import { axiosClient } from './axiosClient';
import type { ApiSuccess, Service } from '@/types';

export interface DashboardStats {
  services: { total: number; active: number };
  users: { total: number };
  media: { total: number };
  homepageSections: { enabled: number; total: number };
  recentServices: Pick<Service, '_id' | 'title' | 'slug' | 'status' | 'createdAt'>[];
}

export const dashboardApi = {
  stats: () => axiosClient.get<ApiSuccess<DashboardStats>>('/dashboard/stats').then((r) => r.data.data),
};
