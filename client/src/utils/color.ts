/**
 * Picks readable text color (near-black or white) for a given background hex
 * color, using relative luminance. Used so admin-picked brand colors (which
 * could be light or dark) always keep their button/badge text legible,
 * instead of a hardcoded text color assuming the brand color is always light.
 */
export function getContrastColor(hex: string, darkText = '#16210a', lightText = '#ffffff'): string {
  const match = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!match) return darkText;

  const value = parseInt(match[1], 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? darkText : lightText;
}
