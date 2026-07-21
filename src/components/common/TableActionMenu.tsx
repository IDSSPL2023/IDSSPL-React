import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, type LucideIcon } from "lucide-react";

export interface TableActionMenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
}

interface TableActionMenuProps {
  items: TableActionMenuItem[];
  menuWidth?: number;
  triggerClassName?: string;
  ariaLabel?: string;
}

const MENU_MARGIN = 8;
const OPTION_HEIGHT = 40;
const MENU_PADDING = 16;

/**
 * Portal-based row action menu (relocated from `shared/RowActionMenu.tsx`).
 * Self-positions relative to its trigger, flips above when there's no room below,
 * and closes on outside click / scroll / resize.
 */
export default function TableActionMenu({
  items,
  menuWidth = 256,
  triggerClassName = "text-gray-400 hover:text-gray-600",
  ariaLabel = "Row actions",
}: TableActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();

    const menuHeight = items.length * OPTION_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showBelow = spaceBelow > menuHeight + 20;

    let top: number;
    if (showBelow) {
      top = rect.bottom + window.scrollY + 4;
    } else {
      top = rect.top + window.scrollY - menuHeight - 4;
      if (top < 10) top = 10;
    }

    let left = rect.left + window.scrollX - 40;
    if (left + menuWidth > window.innerWidth - MENU_MARGIN) {
      left = window.innerWidth - menuWidth - MENU_MARGIN;
    }
    if (left < MENU_MARGIN) left = MENU_MARGIN;

    setPosition({ top, left });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (items.length === 0) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative z-10 ${triggerClassName}`}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        position &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-50 rounded-xl border border-primary-200 bg-white py-2 shadow-lg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: menuWidth,
              maxHeight: "min(300px, 80vh)",
              overflowY: "auto",
            }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <Icon size={16} className="shrink-0 text-primary" />
                  <span className="text-gray-700">{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
