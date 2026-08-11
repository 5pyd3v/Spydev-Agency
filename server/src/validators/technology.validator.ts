import { z } from 'zod';

export const createTechnologySchema = z.object({
  name: z.string().min(1).max(60),
  icon: z.string().optional(),
  category: z
    .enum(['frontend', 'backend', 'mobile', 'database', 'ai', 'devops', 'security', 'other'])
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateTechnologySchema = createTechnologySchema.partial();
