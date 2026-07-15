import { useEffect, useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import ChatPanel from "@/components/AiDashboard/ChatPanel";
import DashboardView from "@/components/AiDashboard/DashboardView";
import type { ChatMessage, DashboardResponse } from "@/components/AiDashboard/types";

const CHAT_PANEL_WIDTH = 384; // px — matches w-96
const STORAGE_KEY = "idsspl_ai_dashboard_chat";

type StoredChat = {
  messages: ChatMessage[];
  activeId: string | null;
};

function loadStoredChat(): StoredChat {
  if (typeof window === "undefined") return { messages: [], activeId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], activeId: null };
    const parsed = JSON.parse(raw) as Partial<StoredChat>;
    return { messages: parsed.messages ?? [], activeId: parsed.activeId ?? null };
  } catch {
    return { messages: [], activeId: null };
  }
}

const AiDashboardPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredChat().messages);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(() => loadStoredChat().activeId);
  const [activeDashboard, setActiveDashboard] = useState<DashboardResponse | null>(() => {
    const stored = loadStoredChat();
    return stored.messages.find((m) => m.id === stored.activeId)?.dashboard ?? null;
  });
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, activeId }));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — chat just won't persist
    }
  }, [messages, activeId]);

  const handleSend = async (prompt: string) => {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-dashboard/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate dashboard");
      }

      const dashboard = data as DashboardResponse;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: dashboard.title || "Here's your dashboard",
        dashboard,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setActiveDashboard(dashboard);
      setActiveId(assistantMessage.id);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "error",
        content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (message: ChatMessage) => {
    if (!message.dashboard) return;
    setActiveDashboard(message.dashboard);
    setActiveId(message.id);
  };

  const handleClear = () => {
    setMessages([]);
    setActiveId(null);
    setActiveDashboard(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (private browsing, quota, etc.)
    }
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="no-scrollbar flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-slate-950 sm:p-6">
        {activeDashboard ? (
          <DashboardView data={activeDashboard} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#898781]">
            <BarChart3 size={36} />
            <p className="text-sm">Ask the AI Assistant to generate an SMS dashboard.</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setChatOpen((open) => !open)}
        aria-label={chatOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={chatOpen}
        style={{ right: chatOpen ? CHAT_PANEL_WIDTH : 0 }}
        className="absolute top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-xl border border-r-0 border-gray-200 bg-white px-2 py-3 text-primary shadow-md transition-[right] duration-300 ease-in-out hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        {chatOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        <span className="text-[11px] font-semibold tracking-wide [writing-mode:vertical-rl]">
          AI Assistant
        </span>
      </button>

      <div
        style={{ width: chatOpen ? CHAT_PANEL_WIDTH : 0 }}
        className="h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
      >
        <div style={{ width: CHAT_PANEL_WIDTH }} className="h-full">
          <ChatPanel
            messages={messages}
            loading={loading}
            activeId={activeId}
            onSend={handleSend}
            onSelect={handleSelect}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
};

export default AiDashboardPage;
