import { useRouter } from "@/lib/navigation";
import { useBilingual } from "@/i18n/useBilingual";
import type { NavChildData, NavItemData } from "./sidebarData";

type NavItemProps = {
  item: NavItemData | NavChildData;
  active: boolean;
  collapsed?: boolean;
};

export default function NavItem({ item, active, collapsed = false }: NavItemProps) {
  const router = useRouter();
  const { tRaw } = useBilingual();
  const Icon = item.icon;

  // Sidebar items are single labels (not bilingual pairs), so use tRaw so the
  // label always shows the selected language and never goes blank in English.
  const label = item.titleKey ? tRaw(item.titleKey) : item.title;

  // Items with no page built yet render as non-interactive placeholders.
  const disabled = !item.href;

  const handleClick = () => {
    // console.log("NavItem clicked:", item.id, item.href);
    if (item.href) router.push(item.href);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      title={collapsed ? label : disabled ? tRaw("sidebar.comingSoon") : undefined}
      className={`flex h-[42px] w-full items-center rounded-xl text-[14px] font-medium transition-all ${
        collapsed ? "justify-center px-0" : "px-3"
      } ${
        disabled
          ? "cursor-not-allowed text-[#5B5F79] opacity-60"
          : active
          ? "bg-[#2E3050] text-white"
          : "text-[#ECECF4] hover:bg-[#242846]"
      }`}
    >
      {Icon && (
        <Icon size={17} className={`shrink-0 ${collapsed ? "" : "mr-3"} ${disabled ? "" : "text-[#2E8FFF]"}`} />
      )}

      {!collapsed && <span>{label}</span>}
    </button>
  );
}
