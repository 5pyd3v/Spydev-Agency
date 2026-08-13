import type { Project } from '@/types/entities';

export const CATEGORY_LABELS: Record<Project['category'], string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  saas: 'SaaS',
  cybersecurity: 'Cybersecurity',
  ecommerce: 'E-commerce',
};

// Fixed decorative palette per category — not tied to admin brand colors,
// so categories stay visually distinct no matter what's set in Appearance.
export const CATEGORY_TONE_INDEX: Record<Project['category'], number> = {
  mobile: 0, // red
  cybersecurity: 1, // black
  ecommerce: 2, // yellow
  ai: 3, // orange
  web: 4, // gray
  saas: 4, // gray
};
