import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "@/lib/navigation";

import SidebarHeader from "./SidebarHeader";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";
import UserFooter from "./UserFooter";
import { useBilingual } from "@/i18n/useBilingual";

import { menuItems, user, type NavChildData, type NavItemData } from "./sidebarData";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen: _isOpen, onClose: _onClose }: SidebarProps) {
  const pathname = usePathname();
  const { tRaw } = useBilingual();

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [canScrollDown, setCanScrollDown] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const query = search.trim().toLowerCase();

  const searchResults = useMemo<(NavItemData | NavChildData)[]>(() => {
    if (!query) return [];

    const label = (item: { title: string; titleKey?: string }) =>
      (item.titleKey ? tRaw(item.titleKey) : item.title).toLowerCase();

    const results: (NavItemData | NavChildData)[] = [];
    menuItems.forEach((item) => {
      if (item.children) {
        const groupMatches = label(item).includes(query);
        item.children.forEach((child) => {
          if (groupMatches || label(child).includes(query)) results.push(child);
        });
      } else if (label(item).includes(query)) {
        results.push(item);
      }
    });
    return results;
  }, [query, tRaw]);

  const isSearching = query.length > 0;

  const updateScrollState = () => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  };

  useLayoutEffect(() => {
    updateScrollState();
  }, [collapsed, isSearching, searchResults]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    updateScrollState();

    const handleScroll = () => updateScrollState();
    el.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`flex h-screen flex-col rounded-r-2xl border-r border-primary bg-[#0C0B1E] transition-[width] duration-300 ${
        collapsed ? "w-[72px]" : "w-[230px]"
      }`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => {
        setCollapsed(true);
        setSearch("");
      }}
    >
      <SidebarHeader collapsed={collapsed} search={search} onSearchChange={setSearch} />

      <div className="relative min-h-0 flex-1">
        <div ref={navRef} className="no-scrollbar mt-5 h-full overflow-y-auto px-2 pb-3">
          <div className="space-y-1">
            {isSearching ? (
              searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <NavItem key={item.id} item={item} active={pathname === item.href} collapsed={collapsed} />
                ))
              ) : (
                <p className="px-3 py-4 text-center text-[13px] text-[#8A8FA8]">{tRaw("sidebar.noMatchingItems")}</p>
              )
            ) : (
              menuItems.map((item) =>
                item.children ? (
                  <NavGroup key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
                ) : (
                  <NavItem key={item.id} item={item} active={pathname === item.href} collapsed={collapsed} />
                )
              )
            )}
          </div>
        </div>

        {canScrollDown && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-10 items-end justify-center bg-gradient-to-t from-[#0C0B1E] to-transparent pb-1">
            <button
              type="button"
              aria-label={tRaw("sidebar.moreMenusBelow")}
              title={tRaw("sidebar.moreMenusBelow")}
              onClick={() => navRef.current?.scrollBy({ top: 160, behavior: "smooth" })}
              className="pointer-events-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#242846] text-[#8A8FA8] shadow-md transition-colors hover:bg-[#2E3050] hover:text-white"
            >
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        )}
      </div>

      <UserFooter user={user} collapsed={collapsed} />
    </div>
  );
}
