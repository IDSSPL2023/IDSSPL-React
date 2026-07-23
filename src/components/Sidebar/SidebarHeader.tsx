import { IMAGES } from "@/assets";
import { Search } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";


type SidebarHeaderProps = {
  collapsed?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export default function SidebarHeader({ collapsed = false, search = "", onSearchChange }: SidebarHeaderProps) {
  const { tRaw } = useBilingual();
  return (
    <div className={collapsed ? "px-2 pt-5" : "px-4 pt-5"}>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2">
        <img
          src={IMAGES.LOGO}
          alt={tRaw("sidebar.logoAlt")}
          className={collapsed ? "h-7 w-full object-contain" : "h-10 w-auto object-contain"}
        />
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="relative mt-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7387]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={tRaw("sidebar.search")}
            className="h-8 w-full rounded-md border border-[#ECECEC] bg-white pl-9 pr-3 text-xs text-[#444] placeholder:text-[#9AA2B2] outline-none focus:border-[#1976F9]"
          />
        </div>
      )}
    </div>
  );
}
