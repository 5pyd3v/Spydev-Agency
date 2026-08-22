/**
 * Rewrites a Cloudinary URL to request an optimized delivery variant —
 * auto format (WebP/AVIF where the browser supports it), auto quality, and
 * capped to the width it'll actually render at — instead of shipping the
 * full-resolution original to every card/thumbnail. Cloudinary generates
 * and edge-caches the transformed variant on first request; non-Cloudinary
 * URLs (or malformed ones) pass through untouched.
 */
export function optimizedImageUrl(url: string | undefined | null, width: number): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) return url;

  const insertAt = index + marker.length;
  const transform = `f_auto,q_auto,w_${width}/`;
  return url.slice(0, insertAt) + transform + url.slice(insertAt);
}
