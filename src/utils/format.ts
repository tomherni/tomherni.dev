/**
 * Format a `Date` to a human-readable string. (Example: 1 January 2024)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a `Date` to a short human-readable string. (Example: 01 Jan 2024)
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

/**
 * Format a `Date` to YYYY-MM-DD.
 */
export function formatDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Encode HTML to make it safe to display as text.
 */
export function encodeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
