/**
 * Fixed decorative palette for card icons (Services, Projects, Process,
 * Technologies) — deliberately NOT tied to the admin-configured brand
 * colors, so these stay visually consistent no matter what Primary/
 * Secondary/Highlight are set to in /admin/appearance.
 */
export const CARD_TONES = [
  { bg: '#E4262E', text: '#ffffff', shadow: 'rgba(228, 38, 46, 0.35)' }, // red
  { bg: '#1A1A1A', text: '#ffffff', shadow: 'rgba(26, 26, 26, 0.35)' }, // black
  { bg: '#F5E643', text: '#1a1a1a', shadow: 'rgba(245, 230, 67, 0.35)' }, // yellow
  { bg: '#FF6B2B', text: '#ffffff', shadow: 'rgba(255, 107, 43, 0.35)' }, // orange
  { bg: '#6B6B6B', text: '#ffffff', shadow: 'rgba(107, 107, 107, 0.35)' }, // gray
] as const;
