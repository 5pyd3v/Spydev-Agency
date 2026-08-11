import { useEffect } from 'react';
import { useSettings } from '@/hooks/queries/useSettings';

const RADIUS_MAP: Record<string, string> = {
  sm: '0.5rem',
  md: '0.875rem',
  lg: '1.25rem',
  xl: '1.75rem',
};

/**
 * Applies the admin-configured Appearance settings (colors, radius, fonts)
 * as CSS custom property overrides at runtime, on top of the static
 * defaults defined in index.css — so changes in /admin/appearance take
 * effect on the live site without a rebuild.
 */
export function AppearanceInjector() {
  const { data: settings } = useSettings();

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement.style;
    const { appearance } = settings;

    if (appearance.primaryColor) root.setProperty('--accent', appearance.primaryColor);
    if (appearance.secondaryColor) root.setProperty('--secondary', appearance.secondaryColor);
    if (appearance.fontHeading) root.setProperty('--font-display', `"${appearance.fontHeading}", "Inter", ui-sans-serif, system-ui, sans-serif`);
    if (appearance.fontBody) root.setProperty('--font-sans', `"${appearance.fontBody}", ui-sans-serif, system-ui, sans-serif`);
    if (appearance.borderRadius && RADIUS_MAP[appearance.borderRadius]) {
      root.setProperty('--radius-xl', RADIUS_MAP[appearance.borderRadius]);
    }

    if (settings.faviconUrl) {
      const link = (document.querySelector('link[rel="icon"]') as HTMLLinkElement) ?? document.createElement('link');
      link.rel = 'icon';
      link.href = settings.faviconUrl;
      if (!link.parentElement) document.head.appendChild(link);
    }
  }, [settings]);

  return null;
}
