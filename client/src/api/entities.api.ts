import { createResourceApi } from './createResourceApi';
import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/types';
import type {
  BlogCategory,
  Client,
  FAQ,
  NavigationItem,
  Page,
  PricingPlan,
  ProcessStep,
  Technology,
  TeamMember,
  Testimonial,
} from '@/types/entities';

export const teamApi = createResourceApi<TeamMember>('team');
export const technologiesApi = createResourceApi<Technology>('technologies');
export const processApi = createResourceApi<ProcessStep>('process');
export const testimonialsApi = createResourceApi<Testimonial>('testimonials');
export const pricingApi = createResourceApi<PricingPlan>('pricing');
export const faqsApi = createResourceApi<FAQ>('faqs');
export const clientsApi = createResourceApi<Client>('clients');
export const blogCategoriesApi = createResourceApi<BlogCategory>('blog/categories');
export const navigationApi = createResourceApi<NavigationItem>('navigation');

export const pagesApi = {
  getPublic: (slug: string) => axiosClient.get<ApiSuccess<Page>>(`/pages/${slug}`).then((r) => r.data.data),
  listAdmin: () => axiosClient.get<ApiSuccess<Page[]>>('/pages/admin/all').then((r) => r.data.data),
  getAdmin: (slug: string) => axiosClient.get<ApiSuccess<Page>>(`/pages/admin/${slug}`).then((r) => r.data.data),
  save: (slug: string, payload: Partial<Page>) =>
    axiosClient.put<ApiSuccess<Page>>(`/pages/admin/${slug}`, payload).then((r) => r.data.data),
};
