import { axiosClient } from './axiosClient';
import type { ApiSuccess, AuthUser } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post<ApiSuccess<{ user: AuthUser }>>('/auth/login', { email, password }).then((r) => r.data.data),

  logout: () => axiosClient.post<ApiSuccess<null>>('/auth/logout').then((r) => r.data.data),

  me: () => axiosClient.get<ApiSuccess<{ user: AuthUser }>>('/auth/me').then((r) => r.data.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    axiosClient
      .put<ApiSuccess<null>>('/auth/change-password', { currentPassword, newPassword })
      .then((r) => r.data.data),
};
