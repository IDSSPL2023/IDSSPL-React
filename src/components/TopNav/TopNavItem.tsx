import type { ComponentType } from "react";
import { useRouter } from "@/lib/navigation";
import { useBilingual } from "@/i18n/useBilingual";

type NavItemData = {
  id: string;
  title: string;
  titleKey?: string;
  href?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

type TopNavItemProps = {
  item: NavItemData;
  active: boolean;
  level?: number;
};

export default function TopNavItem({ item, active, level = 0 }: TopNavItemProps) {
  const router = useRouter();
  const { tRaw } = useBilingual();
  const Icon = item.icon;

  // Sidebar items are single labels (not bilingual pairs), so use tRaw so the
  // label always shows the selected language and never goes blank in English.
  const label = item.titleKey ? tRaw(item.titleKey) : item.title;

  const handleClick = () => {
    if (item.href) {
      router.push(item.href);
    }
  };

  if (level === 0) {
    return (
      <button
        onClick={handleClick}
        className={`flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-all ${
          active
            ? "bg-[#2E3050] text-white"
            : "text-[#ECECF4] hover:bg-[#242846]"
        }`}
      >
        {Icon && <Icon size={16} className="shrink-0 text-[#2E8FFF]" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex h-9 w-full items-center whitespace-nowrap rounded-lg px-3 text-left text-[13px] font-medium transition-all ${
        active
          ? "bg-[#1877F2] text-white shadow-md"
          : "text-[#ECECF4] hover:bg-[#242846]"
      }`}
    >
      {label}
    </button>
  );
}
