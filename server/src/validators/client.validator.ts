import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1).max(100),
  logoUrl: z.string().min(1),
  logoDarkUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateClientSchema = createClientSchema.partial();
