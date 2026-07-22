import type { ReactNode } from "react";

export type FilterFieldType = "text" | "select" | "date" | "status" | "custom";

export interface FilterFieldOption {
  value: string;
  label: string;
}

export interface FilterFieldDef {
  id: string;
  label: string;
  icon?: ReactNode;
  type: FilterFieldType;
  placeholder?: string;
  /** Options for `select` and `status` field types. */
  options?: FilterFieldOption[];
  /** Custom right-panel renderer for `type: "custom"`. */
  render?: (value: string, setValue: (value: string) => void) => ReactNode;
}

export type FilterValues = Record<string, string>;
