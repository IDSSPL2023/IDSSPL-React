import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface BaseModalProps {
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  /** Exact pixel max-width, for targets that don't match a `size` preset (e.g. PicklistModal's 841px). Overrides `size`. */
  maxWidthPx?: number;
  /** Exact pixel max-height for dynamic height control */
  maxHeightPx?: number;
  /** Exact pixel min-height for dynamic height control */
  minHeightPx?: number;
  /** Extra classes merged onto the dialog card (width/radius/border/shadow overrides). */
  contentClassName?: string;
  /** Extra classes merged onto the fixed backdrop (e.g. blur). */
  overlayClassName?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** aria-label used when `title` is not a plain string (bare-header modals). */
  ariaLabel?: string;
}