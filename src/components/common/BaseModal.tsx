import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { BaseModalProps, ModalSize } from "./modal.types";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-[500px]",
  md: "max-w-[667px]",
  lg: "max-w-[1159px]",
  xl: "max-w-[1427px]",
  "2xl": "max-w-[1475px]",
  full: "max-w-[95vw]",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal primitive: fixed overlay, z-index, backdrop, Escape handling,
 * scroll locking, focus trap, and an optional default header/footer. Pass no
 * `title` for a fully custom ("bare") header authored in `children` (used by
 * `FilterModal`/`PicklistModal`, which have very custom headers).
 */
export default function BaseModal({
  onClose,
  title,
  subtitle,
  icon,
  footer,
  children,
  size = "md",
  maxWidthPx,
  contentClassName = "",
  overlayClassName = "",
  bodyClassName = "",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  ariaLabel,
}: BaseModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const node = dialogRef.current;
    const focusable = node?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable && focusable[0] ? focusable[0] : node)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = node?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!items || items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [closeOnEscape, onClose]);

  const hasCustomHeader = title === undefined;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ${overlayClassName}`}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : ariaLabel}
        tabIndex={-1}
        style={maxWidthPx ? { maxWidth: `${maxWidthPx}px` } : undefined}
        className={`relative flex max-h-[90vh] w-full ${maxWidthPx ? "" : SIZE_CLASSES[size]} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none dark:bg-slate-900 ${contentClassName}`}
      >
        {!hasCustomHeader && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-start gap-3">
              {icon}
              <div>
                {title && <h2 className="text-[20px] font-semibold leading-6 text-slate-800 dark:text-slate-100">{title}</h2>}
                {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
              </div>
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>

        {footer && <div className="border-t border-slate-100 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}
