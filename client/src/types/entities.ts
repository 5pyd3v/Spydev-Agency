export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  profileImage: string;
  shortBio: string;
  fullBio: string;
  skills: string[];
  linkedin: string;
  github: string;
  otherLinks: { platform: string; url: string }[];
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface Technology {
  _id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'ai' | 'devops' | 'security' | 'other';
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface ProcessStep {
  _id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface Testimonial {
  _id: string;
  clientName: string;
  company: string;
  position: string;
  avatar: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface PricingPlan {
  _id: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface Client {
  _id: string;
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  websiteUrl: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  client: string;
  category: 'web' | 'mobile' | 'ai' | 'saas' | 'cybersecurity' | 'ecommerce';
  description: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  screenshots: string[];
  coverImage: string;
  projectUrl: string;
  githubUrl: string;
  completionDate?: string;
  featured: boolean;
  seo: import('./index').Seo;
  status: 'active' | 'inactive' | 'draft';
  displayOrder: number;
  createdAt: string;
}

export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  coverImage: string;
  problem: string;
  strategy: string;
  solution: string;
  implementation: string;
  technologies: string[];
  results: string;
  metrics: { label: string; value: string }[];
  images: string[];
  timeline: { phase: string; description: string }[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialPosition: string;
  relatedProject?: string;
  status: 'active' | 'inactive' | 'draft';
  displayOrder: number;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category?: BlogCategory | string;
  tags: string[];
  author?: { _id: string; name: string; avatar: string } | string;
  status: 'draft' | 'published';
  publishedAt?: string;
  seo: import('./index').Seo;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'won' | 'lost';

export interface Lead {
  _id: string;
  source: 'contact' | 'start-project';
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  projectType: string;
  projectDescription: string;
  timeline: string;
  requiredTechnologies: string[];
  referenceLinks: string[];
  status: LeadStatus;
  isRead: boolean;
  notes: { text: string; createdAt: string }[];
  createdAt: string;
}

export interface NavigationItem {
  _id: string;
  label: string;
  url: string;
  location: 'header' | 'footer';
  parent?: string | null;
  openInNewTab: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface Page {
  _id: string;
  slug: string;
  title: string;
  content: string;
  seo: import('./index').Seo;
  status: 'active' | 'draft';
}
