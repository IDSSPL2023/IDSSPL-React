
/** Generic helpers for the "active filter" chip/reset UX (mirrors NavbarCM/NavbarCA),
 * usable with any `Record<string, string>` filter shape. */

export function hasActiveFilters(filters: Record<string, string> | undefined): boolean {
  if (!filters) return false;
  return Object.values(filters).some((v) => v.trim() !== "");
}

const humanizeKey = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export function getActiveFilterSummary(filters: Record<string, string> | undefined): string {
  if (!filters) return "";
  const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
  if (active.length === 0) return "";
  const [firstKey, firstValue] = active[0];
  const summary = `${humanizeKey(firstKey)}: ${firstValue}`;
  return active.length > 1 ? `${summary} +${active.length - 1} more` : summary;
}