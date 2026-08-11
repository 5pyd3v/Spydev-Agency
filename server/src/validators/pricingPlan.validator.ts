import { z } from 'zod';

export const createPricingPlanSchema = z.object({
  name: z.string().min(1).max(80),
  price: z.string().min(1),
  billingPeriod: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isPopular: z.boolean().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updatePricingPlanSchema = createPricingPlanSchema.partial();
