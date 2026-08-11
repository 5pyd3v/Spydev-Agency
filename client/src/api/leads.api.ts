import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/types';
import type { Lead, LeadStatus } from '@/types/entities';

export interface ContactLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}

export interface ProjectInquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  projectDescription: string;
  budget?: string;
  timeline?: string;
  requiredTechnologies?: string[];
  referenceLinks?: string[];
}

export const leadsApi = {
  submitContact: (payload: ContactLeadInput) =>
    axiosClient.post<ApiSuccess<{ id: string }>>('/leads/contact', payload).then((r) => r.data),

  submitProjectInquiry: (payload: ProjectInquiryInput) =>
    axiosClient.post<ApiSuccess<{ id: string }>>('/leads/start-project', payload).then((r) => r.data),

  list: (params?: { page?: number; limit?: number; search?: string; status?: string; source?: string; isRead?: boolean }) =>
    axiosClient.get<ApiSuccess<Lead[]>>('/leads', { params }).then((r) => r.data),

  getById: (id: string) => axiosClient.get<ApiSuccess<Lead>>(`/leads/${id}`).then((r) => r.data.data),

  update: (id: string, payload: Partial<Pick<Lead, 'status' | 'isRead'>>) =>
    axiosClient.put<ApiSuccess<Lead>>(`/leads/${id}`, payload).then((r) => r.data.data),

  addNote: (id: string, text: string) =>
    axiosClient.post<ApiSuccess<Lead>>(`/leads/${id}/notes`, { text }).then((r) => r.data.data),

  remove: (id: string) => axiosClient.delete<ApiSuccess<null>>(`/leads/${id}`).then((r) => r.data),
};

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal-sent', 'won', 'lost'];
