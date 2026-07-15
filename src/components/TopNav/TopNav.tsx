import { usePathname, useRouter } from "@/lib/navigation";
import { LogOut } from "lucide-react";
import TopNavGroup from "./TopNavGroup";
import TopNavItem from "./TopNavItem";
import { menuItems } from "@/components/Sidebar/sidebarData";
import { clearAuthSession } from "@/lib/auth";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex min-h-12 w-full flex-wrap items-center gap-1 border-b border-[#ECECEC] bg-[#0C0B1E] px-3 py-1 dark:border-slate-800">
      <div className="flex flex-1 flex-wrap items-center gap-1">
        {menuItems.map((item) =>
          item.children ? (
            <TopNavGroup key={item.id} item={item} pathname={pathname} />
          ) : (
            <TopNavItem key={item.id} item={item} active={pathname === item.href} />
          )
        )}
      </div>

      <button
        onClick={() => {
          clearAuthSession();
          router.push("/login");
        }}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-[#ECECF4] transition-all hover:bg-[#242846]"
      >
        <LogOut size={15} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
