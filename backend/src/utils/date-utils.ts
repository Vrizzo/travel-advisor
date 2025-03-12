/**
 * Format a Date object to YYYY-MM-DD string format
 * required by the Kiwi API
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse a date string in the format YYYY-MM-DD to a Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get a formatted date string for a date N days from now
 */
export function getDateDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
} 