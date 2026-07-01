/**
 * Format a `Date` to a human-readable string. (Example: 1 January 2024)
 */
export function formatDateLong(date: Date): string {
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
