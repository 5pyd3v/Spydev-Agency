import { z } from 'zod';

export const createProcessStepSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateProcessStepSchema = createProcessStepSchema.partial();
