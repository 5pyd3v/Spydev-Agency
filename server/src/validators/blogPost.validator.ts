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

export const createBlogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().trim().toLowerCase().optional(),
  excerpt: z.string().max(300).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.coerce.date().optional(),
  seo: seoSchema.optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();
