import axios, { AxiosError } from 'axios';
import { getCookie } from '@/utils/cookies';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

axiosClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (method && MUTATING_METHODS.has(method)) {
    const csrfToken = getCookie('spydev_csrf');
    if (csrfToken) {
      config.headers.set('x-csrf-token', csrfToken);
    }
  }
  return config;
});

// The access token cookie expires after 15 minutes; on a 401 we silently try
// the refresh endpoint once and replay the original request, so an admin
// mid-session isn't kicked out just because the access token aged out.
let refreshPromise: Promise<unknown> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    if (status !== 401 || !original || original._retry || url.includes('/auth/login') || url.includes('/auth/refresh')) {
      throw error;
    }

    original._retry = true;
    try {
      refreshPromise ??= axiosClient.post('/auth/refresh').finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return axiosClient(original);
    } catch (refreshError) {
      throw refreshError;
    }
  }
);

export interface ApiErrorShape {
  success: false;
  message: string;
  errors?: unknown;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorShape>;
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
}
