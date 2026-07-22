import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type SortDirection = "asc" | "desc";

export type ColumnAlign = "left" | "center" | "right";

export interface ColumnDef<T> {
  /** Unique key for the column. Used as the React key and, when `sortable`, the sort field. */
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: ColumnAlign;
  className?: string;
  /** Custom cell renderer. Defaults to `String(row[key])` when omitted. */
  render?: (row: T, index: number) => ReactNode;
}

export interface TableAction<T> {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export type StatusTone = "success" | "neutral" | "pending" | "rejected" | "info";

export interface PaginationState {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableTabDef {
  key: string;
  label: string;
  count?: number;
}
