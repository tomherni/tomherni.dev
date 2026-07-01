/**
 * Slugify a string.
 *
 * ! Change logic witch caution as it affects tag page URLs.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 _.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
