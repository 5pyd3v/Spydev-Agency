import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean().default(true),
});

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

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  logoUrl: z.string().optional(),
  logoDarkUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  appearance: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      highlightColor: z.string().optional(),
      backgroundColor: z.string().optional(),
      surfaceColor: z.string().optional(),
      textColor: z.string().optional(),
      buttonStyle: z.enum(['rounded', 'pill', 'square']).optional(),
      borderRadius: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      fontHeading: z.string().optional(),
      fontBody: z.string().optional(),
      defaultTheme: z.enum(['dark', 'light']).optional(),
    })
    .partial()
    .optional(),
  announcement: z
    .object({
      enabled: z.boolean().optional(),
      text: z.string().optional(),
      linkText: z.string().optional(),
      linkUrl: z.string().optional(),
      dismissible: z.boolean().optional(),
    })
    .partial()
    .optional(),
  seoDefaults: seoSchema.partial().optional(),
  emailNotifications: z
    .object({
      notifyOnContactLead: z.boolean().optional(),
      notifyOnProjectInquiry: z.boolean().optional(),
    })
    .partial()
    .optional(),
  footerText: z.string().optional(),
});
