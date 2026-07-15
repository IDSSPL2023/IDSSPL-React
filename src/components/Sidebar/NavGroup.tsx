import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { createPortal } from "react-dom";
import { ChevronRight } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import type { NavItemData } from "./sidebarData";

type NavGroupProps = {
  item: NavItemData;
  pathname: string;
  collapsed?: boolean;
};

const FLYOUT_WIDTH = 240;
const FLYOUT_MARGIN = 8;

export default function NavGroup({ item, pathname, collapsed = false }: NavGroupProps) {
  const router = useRouter();
  const { tRaw } = useBilingual();
  const children = item.children ?? [];
  const label = item.titleKey ? tRaw(item.titleKey) : item.title;

  const hasActiveChild = children.some((child) => child.href === pathname);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  const Icon = item.icon;

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    let top = rect.top + window.scrollY;
    const flyoutHeight = children.length * 44 + 60;
    if (top + flyoutHeight > window.innerHeight - FLYOUT_MARGIN) {
      top = Math.max(FLYOUT_MARGIN, window.innerHeight - flyoutHeight - FLYOUT_MARGIN);
    }

    const left = rect.right + window.scrollX + FLYOUT_MARGIN;

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
        flyoutRef.current &&
        !flyoutRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="select-none">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={collapsed ? label : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-10 w-full items-center rounded-md text-[13px] font-medium transition-all duration-200 ${
          collapsed ? "justify-center px-0" : "px-3"
        } ${
          hasActiveChild || open
            ? "bg-[#2B2F55] text-white"
            : "text-[#D7D9E4] hover:bg-[#242845]"
        }`}
      >
        <Icon size={17} className={collapsed ? "shrink-0" : "mr-3 shrink-0"} />

        {!collapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <ChevronRight size={15} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {open &&
        position &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={flyoutRef}
            role="menu"
            className="fixed z-50 rounded-2xl bg-white p-3 shadow-2xl"
            style={{ top: `${position.top}px`, left: `${position.left}px`, width: FLYOUT_WIDTH }}
          >
            <div className="mb-2 flex items-center gap-2 border-b border-slate-100 px-1 pb-2">
              <Icon size={16} className="text-primary" />
              <span className="text-sm font-bold text-[#1B2143]">{label}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              {children.map((child) => {
                const ChildIcon = child.icon;
                const childLabel = child.titleKey ? tRaw(child.titleKey) : child.title;
                const isActive = pathname === child.href;
                const childDisabled = !child.href;
                return (
                  <button
                    key={child.id}
                    type="button"
                    role="menuitem"
                    disabled={childDisabled}
                    title={childDisabled ? tRaw("sidebar.comingSoon") : undefined}
                    onClick={() => {
                      if (!child.href) return;
                      setOpen(false);
                      router.push(child.href);
                    }}
                    className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium transition-colors ${
                      childDisabled
                        ? "cursor-not-allowed text-[#A8ACC0] opacity-60"
                        : isActive
                        ? "bg-primary text-white"
                        : "text-[#1B2143] hover:bg-primary-50"
                    }`}
                  >
                    {ChildIcon && <ChildIcon size={15} className="shrink-0" />}
                    <span className="truncate">{childLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
