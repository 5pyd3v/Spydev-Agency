import slugifyLib from 'slugify';
import type { Model } from 'mongoose';

export function toSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

/**
 * Generates a unique slug for a model by appending -2, -3, ... on collision,
 * excluding the current document (for updates) via excludeId.
 */
export async function generateUniqueSlug(
  model: Model<any>,
  text: string,
  excludeId?: string
): Promise<string> {
  const base = toSlug(text);
  let slug = base;
  let counter = 2;

  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await model.findOne(query).select('_id').lean();
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}
