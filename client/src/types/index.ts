export type UserRole = 'superadmin' | 'admin' | 'editor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Seo {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

export type ContentStatus = 'active' | 'inactive' | 'draft';

export interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  heroImage: string;
  gallery: string[];
  features: ServiceFeature[];
  technologies: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  relatedProjects: string[];
  ctaText: string;
  ctaUrl: string;
  seo: Seo;
  status: ContentStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type HomepageSectionType =
  | 'hero'
  | 'clients'
  | 'services'
  | 'stats'
  | 'projects'
  | 'process'
  | 'technologies'
  | 'about'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'custom';

export interface HeroSectionContent {
  badge?: string;
  headline?: string;
  description?: string;
  primaryCta?: { text: string; url: string };
  secondaryCta?: { text: string; url: string };
  visualImage?: string;
  trustIndicators?: string[];
}

export interface CtaSectionContent {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface HomepageSection {
  _id: string;
  type: HomepageSectionType;
  key: string;
  enabled: boolean;
  order: number;
  heading: string;
  subheading: string;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  tagline: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: SocialLink[];
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
  seoDefaults: Seo;
  emailNotifications: {
    notifyOnContactLead: boolean;
    notifyOnProjectInquiry: boolean;
  };
  footerText: string;
}

export interface Media {
  _id: string;
  url: string;
  publicId: string;
  provider: 'cloudinary' | 'local';
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  folder: string;
  originalName: string;
  altText: string;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    [key: string]: unknown;
  };
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}
