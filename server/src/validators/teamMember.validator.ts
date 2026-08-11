import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  name: z.string().min(2).max(100),
  position: z.string().min(1).max(120),
  profileImage: z.string().optional(),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  otherLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();
