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

export const createProjectSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().trim().toLowerCase().optional(),
  client: z.string().optional(),
  category: z.enum(['web', 'mobile', 'ai', 'saas', 'cybersecurity', 'ecommerce']).optional(),
  description: z.string().min(1),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  screenshots: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  completionDate: z.coerce.date().optional(),
  featured: z.boolean().optional(),
  seo: seoSchema.optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  displayOrder: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
