import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, Sparkles, Trash2, User } from "lucide-react";
import type { ChatMessage } from "./types";

const SUGGESTIONS = [
  "Give me SMS dashboard for last 5 days date wise",
  "Show today's SMS status summary",
  "SMS success vs failed for this month",
];

type ChatPanelProps = {
  messages: ChatMessage[];
  loading: boolean;
  activeId: string | null;
  onSend: (prompt: string) => void;
  onSelect: (message: ChatMessage) => void;
  onClear: () => void;
};

const ChatPanel = ({ messages, loading, activeId, onSend, onSelect, onClear }: ChatPanelProps) => {
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
              {SUGGESTIONS.map((s) => (
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
            {SUGGESTIONS.map((s) => (
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

export default ChatPanel;
