// Status palette from the design system's data-viz reference (references/palette.md),
// pre-validated for CVD-safe contrast — reused as-is rather than re-picked per chart.
export const STATUS_COLORS = {
  good: { light: "#0ca30c", dark: "#0ca30c" }, // Success
  warning: { light: "#fab219", dark: "#fab219" }, // Pending
  serious: { light: "#ec835a", dark: "#ec835a" }, // Send / in-flight
  critical: { light: "#d03b3b", dark: "#e66767" }, // Failed
  neutral: { light: "#2a78d6", dark: "#3987e5" }, // Total / default
} as const;

export function statusColorFor(label: string): { light: string; dark: string } {
  const key = label.toLowerCase();
  if (key.includes("success")) return STATUS_COLORS.good;
  if (key.includes("pending")) return STATUS_COLORS.warning;
  if (key.includes("fail")) return STATUS_COLORS.critical;
  if (key.includes("send")) return STATUS_COLORS.serious;
  return STATUS_COLORS.neutral;
}
