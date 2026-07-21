import { useTheme } from "@/components/theme/ThemeProvider";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Lightbulb, ListChecks, Bot, Loader2, Send, Sparkles, Trash2, User, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/* ===== from types.ts ===== */
export type Types_DashboardCard = {
  title: string;
  value: number | string;
  description?: string;
};

export type Types_DashboardChart = {
  type: "bar" | "pie" | "line" | string;
  title: string;
  data: { name: string; value: number }[];
};

export type Types_DashboardTable = {
  title: string;
  columns: string[];
  rows: (string | number)[][];
};

export type Types_DashboardResponse = {
  title: string;
  subtitle?: string;
  cards: Types_DashboardCard[];
  charts: Types_DashboardChart[];
  tables: Types_DashboardTable[];
  insights?: string[];
  alerts?: string[];
  actions?: string[];
};

export type Types_ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  dashboard?: Types_DashboardResponse;
};


/* ===== from statusColors.ts ===== */
export const StatusColors_STATUS_COLORS = {
  good: { light: "#0ca30c", dark: "#0ca30c" }, // Success
  warning: { light: "#fab219", dark: "#fab219" }, // Pending
  serious: { light: "#ec835a", dark: "#ec835a" }, // Send / in-flight
  critical: { light: "#d03b3b", dark: "#e66767" }, // Failed
  neutral: { light: "#2a78d6", dark: "#3987e5" }, // Total / default
} as const;

export function StatusColors_statusColorFor(label: string): { light: string; dark: string } {
  const key = label.toLowerCase();
  if (key.includes("success")) return StatusColors_STATUS_COLORS.good;
  if (key.includes("pending")) return StatusColors_STATUS_COLORS.warning;
  if (key.includes("fail")) return StatusColors_STATUS_COLORS.critical;
  if (key.includes("send")) return StatusColors_STATUS_COLORS.serious;
  return StatusColors_STATUS_COLORS.neutral;
}


/* ===== from StatCards.tsx ===== */
function StatCards_formatValue(value: number | string) {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-IN").format(value);
}

const StatCards = ({ cards }: { cards: Types_DashboardCard[] }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const accent = StatusColors_statusColorFor(card.title);
        const color = isDarkMode ? accent.dark : accent.light;

        return (
          <div
            key={card.title}
            style={{ borderLeftColor: color }}
            className="rounded-xl border border-l-4 border-gray-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="truncate text-xs font-medium text-[#52514E] dark:text-[#C3C2B7]">
              {card.title}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#0B0B0B] dark:text-white">
              {StatCards_formatValue(card.value)}
            </p>
            {card.description ? (
              <p className="mt-0.5 truncate text-[11px] text-[#898781]">{card.description}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};


/* ===== from DashboardCharts.tsx ===== */
const DashboardCharts_chrome = {
  light: { grid: "#e1e0d9", axis: "#898781", text: "#52514E", surface: "#fcfcfb" },
  dark: { grid: "#2c2c2a", axis: "#898781", text: "#C3C2B7", surface: "#1a1a19" },
};

function DashboardCharts_ChartTooltip({
  active,
  payload,
  label,
  isDarkMode,
}: {
  active?: boolean;
  payload?: { value: number; name?: string; payload?: { name: string } }[];
  label?: string;
  isDarkMode: boolean;
}) {
  if (!active || !payload?.length) return null;
  const c = isDarkMode ? DashboardCharts_chrome.dark : DashboardCharts_chrome.light;
  return (
    <div
      style={{ background: c.surface, borderColor: c.grid }}
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
    >
      <p className="mb-1 font-medium" style={{ color: c.text }}>
        {label ?? payload[0]?.payload?.name}
      </p>
      <p className="font-semibold text-[#0B0B0B] dark:text-white">
        {new Intl.NumberFormat("en-IN").format(payload[0].value)}
      </p>
    </div>
  );
}

function DashboardCharts_BarChartCard({ chart, isDarkMode }: { chart: Types_DashboardChart; isDarkMode: boolean }) {
  const c = isDarkMode ? DashboardCharts_chrome.dark : DashboardCharts_chrome.light;
  const barColor = isDarkMode ? StatusColors_STATUS_COLORS.neutral.dark : StatusColors_STATUS_COLORS.neutral.light;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{chart.title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chart.data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap={12}>
          <CartesianGrid vertical={false} stroke={c.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: c.axis, fontSize: 11 }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<DashboardCharts_ChartTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "#ffffff0d" : "#0000000a" }} />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardCharts_PieChartCard({ chart, isDarkMode }: { chart: Types_DashboardChart; isDarkMode: boolean }) {
  const c = isDarkMode ? DashboardCharts_chrome.dark : DashboardCharts_chrome.light;
  const data = chart.data.filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{chart.title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke={c.surface}
            strokeWidth={2}
            label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={isDarkMode ? StatusColors_statusColorFor(entry.name).dark : StatusColors_statusColorFor(entry.name).light} />
            ))}
          </Pie>
          <Tooltip content={<DashboardCharts_ChartTooltip isDarkMode={isDarkMode} />} />
          <Legend
            formatter={(value) => <span style={{ color: c.text, fontSize: 12 }}>{value}</span>}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const DashboardCharts = ({ charts }: { charts: Types_DashboardChart[] }) => {
  const { isDarkMode } = useTheme();
  if (!charts?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {charts.map((chart) => {
        if (chart.type === "pie") return <DashboardCharts_PieChartCard key={chart.title} chart={chart} isDarkMode={isDarkMode} />;
        return <DashboardCharts_BarChartCard key={chart.title} chart={chart} isDarkMode={isDarkMode} />;
      })}
    </div>
  );
};


/* ===== from DashboardTables.tsx ===== */
const DashboardTables = ({ tables }: { tables: Types_DashboardTable[] }) => {
  if (!tables?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {tables.map((table) => (
        <div
          key={table.title}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{table.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#e1e0d9] dark:border-slate-800">
                  {table.columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-[#898781]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#e1e0d9] last:border-0 dark:border-slate-800/60"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="whitespace-nowrap px-3 py-2 tabular-nums text-[#0B0B0B] dark:text-white"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};


/* ===== from DashboardView.tsx ===== */
const DashboardView_NoteList = ({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "info" | "warning";
}) => {
  if (!items?.length) return null;
  const toneClass =
    tone === "warning"
      ? "border-[#fab219]/30 bg-[#fab219]/10 text-[#7a4e00] dark:text-[#fab219]"
      : "border-[#2a78d6]/30 bg-[#2a78d6]/10 text-[#184f95] dark:text-[#9ec5f4]";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const DashboardView = ({ data }: { data: Types_DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-[#0B0B0B] dark:text-white">{data.title}</h2>
        {data.subtitle ? (
          <p className="text-sm text-[#52514E] dark:text-[#C3C2B7]">{data.subtitle}</p>
        ) : null}
      </div>

      {data.cards?.length ? <StatCards cards={data.cards} /> : null}
      <DashboardCharts charts={data.charts} />
      <DashboardTables tables={data.tables} />

      {data.insights?.length ? (
        <DashboardView_NoteList title="Insights" icon={<Lightbulb size={16} />} items={data.insights} tone="info" />
      ) : null}
      {data.alerts?.length ? (
        <DashboardView_NoteList title="Alerts" icon={<AlertTriangle size={16} />} items={data.alerts} tone="warning" />
      ) : null}
      {data.actions?.length ? (
        <DashboardView_NoteList title="Suggested actions" icon={<ListChecks size={16} />} items={data.actions} tone="info" />
      ) : null}
    </div>
  );
};


/* ===== from ChatPanel.tsx ===== */
const ChatPanel_SUGGESTIONS = [
  "Give me SMS dashboard for last 5 days date wise",
  "Show today's SMS status summary",
  "SMS success vs failed for this month",
];

type ChatPanel_ChatPanelProps = {
  messages: Types_ChatMessage[];
  loading: boolean;
  activeId: string | null;
  onSend: (prompt: string) => void;
  onSelect: (message: Types_ChatMessage) => void;
  onClear: () => void;
};

const ChatPanel = ({ messages, loading, activeId, onSend, onSelect, onClear }: ChatPanel_ChatPanelProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = (value?: string) => {
    const prompt = (value ?? input).trim();
    if (!prompt || loading) return;
    onSend(prompt);
    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-slate-800">
        <Sparkles size={18} className="text-primary" />
        <h2 className="flex-1 text-sm font-semibold text-[#0B0B0B] dark:text-white">SMS Dashboard Assistant</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={messages.length === 0}
          aria-label="Clear chat history"
          title="Clear chat history"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#898781] hover:bg-gray-100 hover:text-[#d03b3b] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#898781] dark:hover:bg-slate-800"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <Bot size={28} className="text-[#898781]" />
            <p className="text-sm text-[#52514E] dark:text-[#C3C2B7]">
              Ask for an SMS dashboard in plain English — try one of these:
            </p>
            <div className="flex flex-col gap-2">
              {ChatPanel_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-[#184f95] hover:bg-[#EEF6FF] dark:border-slate-700 dark:text-[#9ec5f4] dark:hover:bg-slate-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role !== "user" ? (
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <Bot size={14} className="text-primary" />
                </div>
              ) : null}

              <button
                type="button"
                disabled={m.role !== "assistant" || !m.dashboard}
                onClick={() => onSelect(m)}
                className={[
                  "max-w-[85%] rounded-2xl px-3 py-2 text-left text-sm",
                  m.role === "user"
                    ? "bg-primary text-white"
                    : m.role === "error"
                    ? "border border-[#d03b3b]/30 bg-[#d03b3b]/10 text-[#d03b3b]"
                    : activeId === m.id
                    ? "border border-primary bg-[#EEF6FF] text-[#0B0B0B] dark:bg-slate-800 dark:text-white"
                    : "border border-gray-200 bg-gray-50 text-[#0B0B0B] hover:bg-[#EEF6FF] dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800",
                ].join(" ")}
              >
                {m.content}
              </button>

              {m.role === "user" ? (
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700">
                  <User size={14} className="text-[#52514E] dark:text-[#C3C2B7]" />
                </div>
              ) : null}
            </div>
          ))
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-[#898781]">
            <Loader2 size={14} className="animate-spin" />
            Generating dashboard…
          </div>
        ) : null}

        {!loading && messages.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs font-medium text-[#898781]">Try asking next</p>
            {ChatPanel_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-[#184f95] hover:bg-[#EEF6FF] dark:border-slate-700 dark:text-[#9ec5f4] dark:hover:bg-slate-800"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 p-3 dark:border-slate-800">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask for an SMS dashboard…"
            rows={1}
            className="max-h-28 flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#0B0B0B] outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => submit()}
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};


/* ===== from AiDashboardPage.tsx ===== */
const CHAT_PANEL_WIDTH = 384; // px — matches w-96
const STORAGE_KEY = "idsspl_ai_dashboard_chat";
const AI_DASHBOARD_PROMPT_URL =
  import.meta.env.VITE_AI_DASHBOARD_PROMPT_URL || "https://sms-app.appantech.com/api/dashboard/sms/prompt";

type StoredChat = {
  messages: Types_ChatMessage[];
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
  const [messages, setMessages] = useState<Types_ChatMessage[]>(() => loadStoredChat().messages);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(() => loadStoredChat().activeId);
  const [activeDashboard, setActiveDashboard] = useState<Types_DashboardResponse | null>(() => {
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
    const userMessage: Types_ChatMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(AI_DASHBOARD_PROMPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate dashboard");
      }

      const dashboard = data as Types_DashboardResponse;
      const assistantMessage: Types_ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: dashboard.title || "Here's your dashboard",
        dashboard,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setActiveDashboard(dashboard);
      setActiveId(assistantMessage.id);
    } catch (err) {
      const errorMessage: Types_ChatMessage = {
        id: crypto.randomUUID(),
        role: "error",
        content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (message: Types_ChatMessage) => {
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
