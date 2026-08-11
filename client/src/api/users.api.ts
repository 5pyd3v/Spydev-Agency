import { axiosClient } from './axiosClient';
import type { ApiSuccess, AuthUser, UserRole } from '@/types';

export interface AdminUser extends AuthUser {
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const usersApi = {
  list: (params?: { search?: string }) =>
    axiosClient.get<ApiSuccess<AdminUser[]>>('/users', { params }).then((r) => r.data),

  create: (payload: CreateUserInput) =>
    axiosClient.post<ApiSuccess<AdminUser>>('/users', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Pick<AdminUser, 'name' | 'email' | 'role' | 'isActive'>>) =>
    axiosClient.put<ApiSuccess<AdminUser>>(`/users/${id}`, payload).then((r) => r.data.data),

  resetPassword: (id: string, newPassword: string) =>
    axiosClient.put<ApiSuccess<null>>(`/users/${id}/reset-password`, { newPassword }).then((r) => r.data),

  remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/users/${id}`).then((r) => r.data),
};
