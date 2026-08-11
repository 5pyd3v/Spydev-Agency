import type { Service } from '@/types';
import { createResourceApi } from './createResourceApi';

export const servicesApi = createResourceApi<Service>('services');
