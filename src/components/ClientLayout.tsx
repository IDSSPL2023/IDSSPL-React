import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";
import TopNav from "@/components/TopNav/TopNav";
import I18nProvider from "@/i18n/I18nProvider";
import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";
import { getAuthSession, clearAuthSession } from "@/lib/auth";
import { useLayoutMode } from "@/components/layout/LayoutModeProvider";

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { layoutMode } = useLayoutMode();

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    const remainingMs = session.expiresAt - Date.now();
    const timeout = setTimeout(() => {
      clearAuthSession();
      router.replace("/login");
    }, remainingMs);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <I18nProvider>
      <div className="flex h-full">
        {layoutMode === "sidebar" && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          {layoutMode === "topnav" && <TopNav />}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">{children}</main>
        </div>

        <ChatbotWidget />
      </div>
    </I18nProvider>
  );
}
