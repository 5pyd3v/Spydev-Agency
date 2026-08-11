import { z } from 'zod';

export const createTestimonialSchema = z.object({
  clientName: z.string().min(1).max(100),
  company: z.string().optional(),
  position: z.string().optional(),
  avatar: z.string().optional(),
  testimonial: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
