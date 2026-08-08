import { Intl, Temporal } from '@js-temporal/polyfill';

/**
 * Format a `Temporal.Instant` to a human-readable string. (Example: 1 January 2024)
 */
export function formatDateLong(date: Temporal.Instant): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a `Temporal.Instant` to a short human-readable string. (Example: 01 Jan 2024)
 */
export function formatDateShort(date: Temporal.Instant): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

/**
 * Format a `Temporal.Instant` to YYYY-MM-DD.
 */
export function formatPlainDate(date: Temporal.Instant): string {
  return date.toZonedDateTimeISO('UTC').toPlainDate().toString();
}

/**
 * Format a `Temporal.Instant` to a UTC string. (Example: Mon, 01 Jan 2024 00:00:00 GMT)
 */
export function formatDateUtcString(date: Temporal.Instant): string {
  return new Date(date.epochMilliseconds).toUTCString();
}
