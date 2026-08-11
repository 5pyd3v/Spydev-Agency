import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateFaqSchema = createFaqSchema.partial();
