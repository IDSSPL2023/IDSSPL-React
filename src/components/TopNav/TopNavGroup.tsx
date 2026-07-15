import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import TopNavItem from "./TopNavItem";
import { useBilingual } from "@/i18n/useBilingual";

type NavChild = {
  id: string;
  title: string;
  titleKey?: string;
  href: string;
};

type NavItemData = {
  id: string;
  title: string;
  titleKey?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href?: string;
  children?: NavChild[];
};

type TopNavGroupProps = {
  item: NavItemData;
  pathname: string;
};

export default function TopNavGroup({ item, pathname }: TopNavGroupProps) {
  const { tRaw } = useBilingual();
  const children = item.children ?? [];
  const label = item.titleKey ? tRaw(item.titleKey) : item.title;

  const hasActiveChild = children.some((child) => child.href === pathname);

  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  const Icon = item.icon;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${
          hasActiveChild || open
            ? "bg-[#2B2F55] text-white"
            : "text-[#D7D9E4] hover:bg-[#242845]"
        }`}
      >
        <Icon size={16} className="shrink-0" />
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute left-0 top-full z-50 mt-1 w-56 origin-top space-y-0.5 rounded-xl border border-white/10 bg-[#0C0B1E] p-1.5 shadow-xl transition-all duration-200 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {children.map((child) => (
          <TopNavItem
            key={child.id}
            item={child}
            level={1}
            active={pathname === child.href}
          />
        ))}
      </div>
    </div>
  );
}
