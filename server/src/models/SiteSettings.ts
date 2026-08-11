import { Schema, model, type Document, type Model } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export interface ISocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface ISiteSettings extends Document {
  key: string; // fixed 'main' — enforces a singleton document
  siteName: string;
  tagline: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: ISocialLink[];
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    buttonStyle: 'rounded' | 'pill' | 'square';
    borderRadius: 'sm' | 'md' | 'lg' | 'xl';
    fontHeading: string;
    fontBody: string;
    defaultTheme: 'dark' | 'light';
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
    dismissible: boolean;
  };
  seoDefaults: ISeo;
  emailNotifications: {
    notifyOnContactLead: boolean;
    notifyOnProjectInquiry: boolean;
  };
  footerText: string;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: 'main', unique: true },
    siteName: { type: String, default: 'SpyDev' },
    tagline: { type: String, default: 'Digital Products. Engineered to Move Businesses Forward.' },
    logoUrl: { type: String, default: '' },
    logoDarkUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    contactEmail: { type: String, default: 'hello@spydev.agency' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: { type: [socialLinkSchema], default: [] },
    appearance: {
      primaryColor: { type: String, default: '#1DB954' },
      secondaryColor: { type: String, default: '#0EA5E9' },
      backgroundColor: { type: String, default: '#0A0B0D' },
      surfaceColor: { type: String, default: '#131519' },
      textColor: { type: String, default: '#F5F7FA' },
      buttonStyle: { type: String, enum: ['rounded', 'pill', 'square'], default: 'pill' },
      borderRadius: { type: String, enum: ['sm', 'md', 'lg', 'xl'], default: 'xl' },
      fontHeading: { type: String, default: 'Space Grotesk' },
      fontBody: { type: String, default: 'Inter' },
      defaultTheme: { type: String, enum: ['dark', 'light'], default: 'light' },
    },
    announcement: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      linkText: { type: String, default: '' },
      linkUrl: { type: String, default: '' },
      dismissible: { type: Boolean, default: true },
    },
    seoDefaults: { type: seoSchema, default: () => ({}) },
    emailNotifications: {
      notifyOnContactLead: { type: Boolean, default: true },
      notifyOnProjectInquiry: { type: Boolean, default: true },
    },
    footerText: { type: String, default: `© ${new Date().getFullYear()} SpyDev. All rights reserved.` },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> = model<ISiteSettings>('SiteSettings', siteSettingsSchema);
