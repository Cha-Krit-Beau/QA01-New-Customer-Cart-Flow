/** Date helpers used by tests/test data that need dynamic (non-hardcoded) dates. */

/** Returns today's date as YYYY-MM-DD. */
export function todayISO(referenceDate: Date = new Date()): string {
  return referenceDate.toISOString().slice(0, 10);
}

/** Returns a date `days` from `from` (negative for the past), as YYYY-MM-DD. */
export function addDaysISO(days: number, from: Date = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Formats a Date as DD/MM/YYYY for UI assertions against locale-formatted fields. */
export function formatDateDMY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
