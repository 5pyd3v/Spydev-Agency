import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/hooks/queries/useSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { getContrastColor } from '@/utils/color';

const RADIUS_MAP: Record<string, string> = {
  sm: '0.5rem',
  md: '0.875rem',
  lg: '1.25rem',
  xl: '1.75rem',
};

const CACHE_KEY = 'spydev-appearance';

/**
 * Applies the admin-configured Appearance settings (colors, radius, fonts)
 * as CSS custom property overrides at runtime, on top of the static
 * defaults defined in index.css — so changes in /admin/appearance take
 * effect on the live site without a rebuild.
 *
 * Also mirrors the fetched values to localStorage, which a blocking inline
 * script in index.html reads and applies before React mounts — otherwise
 * every page load would briefly flash the static index.css defaults while
 * this settings request is in flight.
 */
export function AppearanceInjector() {
  const { data: settings } = useSettings();
  const location = useLocation();
  const { theme } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement.style;
    const { appearance } = settings;

    // Text on the accent/secondary fills is auto-contrasted from the chosen
    // color's luminance rather than hardcoded — otherwise an admin picking a
    // dark brand color would end up with illegible dark-on-dark button text.
    const accentForeground = appearance.primaryColor ? getContrastColor(appearance.primaryColor) : undefined;
    const secondaryForeground = appearance.secondaryColor ? getContrastColor(appearance.secondaryColor) : undefined;

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          accent: appearance.primaryColor,
          accentForeground,
          secondary: appearance.secondaryColor,
          secondaryForeground,
          accentAlt: appearance.highlightColor,
          background: theme === 'light' ? appearance.backgroundColor : undefined,
          surface: theme === 'light' ? appearance.surfaceColor : undefined,
          foreground: theme === 'light' ? appearance.textColor : undefined,
          radius: appearance.borderRadius,
        })
      );
    } catch {
      // localStorage unavailable (private browsing, storage full) — this
      // cache is only a flash-prevention nicety, not required to function.
    }

    // Inline styles beat every stylesheet rule, including the admin panel's
    // deliberately-different `.admin-scope` accent — so skip the brand
    // color overrides while inside /admin rather than clobbering it.
    if (isAdminRoute) {
      root.removeProperty('--accent');
      root.removeProperty('--accent-foreground');
      root.removeProperty('--secondary');
      root.removeProperty('--secondary-foreground');
      root.removeProperty('--accent-alt');
      root.removeProperty('--background');
      root.removeProperty('--surface');
      root.removeProperty('--foreground');
    } else {
      if (appearance.primaryColor) {
        root.setProperty('--accent', appearance.primaryColor);
        root.setProperty('--accent-foreground', accentForeground!);
      }
      if (appearance.secondaryColor) {
        root.setProperty('--secondary', appearance.secondaryColor);
        root.setProperty('--secondary-foreground', secondaryForeground!);
      }
      if (appearance.highlightColor) root.setProperty('--accent-alt', appearance.highlightColor);

      // Background/Surface/Text are tuned per-theme in index.css (light and
      // .dark use very different values for contrast) — only override the
      // light palette here so dark mode keeps its own legible defaults.
      if (theme === 'light') {
        if (appearance.backgroundColor) root.setProperty('--background', appearance.backgroundColor);
        if (appearance.surfaceColor) root.setProperty('--surface', appearance.surfaceColor);
        if (appearance.textColor) root.setProperty('--foreground', appearance.textColor);
      } else {
        root.removeProperty('--background');
        root.removeProperty('--surface');
        root.removeProperty('--foreground');
      }
    }

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
  }, [settings, isAdminRoute, theme]);

  return null;
}
