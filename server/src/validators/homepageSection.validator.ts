import { z } from 'zod';

export const createSectionSchema = z.object({
  type: z.enum([
    'hero',
    'clients',
    'services',
    'stats',
    'projects',
    'process',
    'technologies',
    'about',
    'testimonials',
    'pricing',
    'faq',
    'cta',
    'custom',
  ]),
  key: z.string().min(1),
  enabled: z.boolean().optional(),
  order: z.number().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const updateSectionSchema = createSectionSchema.partial();

export const reorderSectionsSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.number(), enabled: z.boolean().optional() })).min(1),
});
