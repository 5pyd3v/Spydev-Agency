import { z } from 'zod';

export const contactLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().max(30).optional(),
  company: z.string().max(150).optional(),
  service: z.string().max(150).optional(),
  budget: z.string().max(80).optional(),
  message: z.string().min(1, 'Message is required').max(4000),
});

export const projectInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().max(30).optional(),
  company: z.string().max(150).optional(),
  projectType: z.string().max(150).optional(),
  projectDescription: z.string().min(1, 'Project description is required').max(4000),
  budget: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  requiredTechnologies: z.array(z.string()).optional(),
  referenceLinks: z.array(z.string()).optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'proposal-sent', 'won', 'lost']).optional(),
  isRead: z.boolean().optional(),
});

export const addLeadNoteSchema = z.object({
  text: z.string().min(1).max(2000),
});
