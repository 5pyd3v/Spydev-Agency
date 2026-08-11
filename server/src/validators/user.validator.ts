import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number');

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: passwordRule,
  role: z.enum(['superadmin', 'admin', 'editor']).default('editor'),
  avatar: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['superadmin', 'admin', 'editor']).optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const resetUserPasswordSchema = z.object({
  newPassword: passwordRule,
});
