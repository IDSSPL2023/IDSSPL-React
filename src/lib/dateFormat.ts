const MONTH_ABBREVIATIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Formats a native `<input type="date">` ISO value (`YYYY-MM-DD`) as `DD-MMM-YYYY`. */
export function formatDateDDMMMYYYY(isoDate: string | undefined | null): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return "";
  return `${String(day).padStart(2, "0")}-${MONTH_ABBREVIATIONS[month - 1]}-${year}`;
}
