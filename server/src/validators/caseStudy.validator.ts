import { z } from 'zod';

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

export const createCaseStudySchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().trim().toLowerCase().optional(),
  client: z.string().optional(),
  coverImage: z.string().optional(),
  problem: z.string().optional(),
  strategy: z.string().optional(),
  solution: z.string().optional(),
  implementation: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  results: z.string().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  images: z.array(z.string()).optional(),
  timeline: z.array(z.object({ phase: z.string(), description: z.string() })).optional(),
  testimonialQuote: z.string().optional(),
  testimonialAuthor: z.string().optional(),
  testimonialPosition: z.string().optional(),
  relatedProject: z.string().optional(),
  seo: seoSchema.optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  displayOrder: z.number().optional(),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();
