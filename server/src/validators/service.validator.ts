import { z } from 'zod';

const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  icon: z.string().optional().default('sparkles'),
});

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().optional().default(''),
});

const seoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(200).optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogTitle: z.string().max(70).optional(),
  ogDescription: z.string().max(200).optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().optional(),
});

export const createServiceSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().trim().toLowerCase().optional(),
  shortDescription: z.string().min(1).max(300),
  fullDescription: z.string().optional().default(''),
  icon: z.string().optional().default('code-2'),
  heroImage: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  features: z.array(featureSchema).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  process: z.array(processStepSchema).optional().default([]),
  faqs: z.array(faqSchema).optional().default([]),
  relatedProjects: z.array(z.string()).optional().default([]),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  seo: seoSchema.optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  displayOrder: z.number().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export { reorderSchema } from './common.validator.js';
