import { useEffect, useRef, useState } from "react";
import { BotMessageSquare, Landmark, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || "https://app.dynamicbanksoft.com/api/chat";

const FALLBACK_MESSAGE = "Sorry, something went wrong. Please try again.";

const WELCOME_MESSAGE =
  "Hello! I'm the IDSSPL core banking assistant. Ask me how to do anything in the app — adding customers, opening accounts, freezing accounts, standing instructions, roles, masters and more. You can ask follow-up questions too.";

const SUGGESTIONS = [
  "How do I add a new customer?",
  "How to freeze an account?",
  "Where do I set TD interest rates?",
  "How to assign a role to a user?",
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const createWelcomeMessage = (): ChatMessage => ({
  role: "assistant",
  content: WELCOME_MESSAGE,
  timestamp: formatTime(new Date()),
});

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const ensureSession = async () => {
    if (sessionIdRef.current) return sessionIdRef.current;

    const res = await fetch(`${CHAT_API_BASE_URL}/sessions`, { method: "POST" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Failed to create session (${res.status} ${res.statusText})${body ? `: ${body}` : ""}`);
    }

    const data = await res.json();
    sessionIdRef.current = data.sessionId;
    return data.sessionId as string;
  };

  const sendMessage = async (override?: string) => {
    const question = (override ?? input).trim();
    if (!question || isSending) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, timestamp: formatTime(new Date()) },
    ]);
    setInput("");
    setIsSending(true);

    let reply = FALLBACK_MESSAGE;
    try {
      const sessionId = await ensureSession();

      const res = await fetch(`${CHAT_API_BASE_URL}/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        reply = `Request failed (${res.status} ${res.statusText})${data?.error ? `: ${data.error}` : ""}`;
      } else if (data?.error) {
        reply = `Pipeline error: ${data.error}`;
      } else {
        reply = data?.answer || FALLBACK_MESSAGE;
      }
    } catch (err) {
      reply = `Request failed: ${err instanceof Error ? err.message : String(err)}`;
      console.error("Chatbot request failed:", err);
    } finally {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: formatTime(new Date()) },
      ]);
      setIsSending(false);
    }
  };

  const startNewChat = () => {
    const staleSessionId = sessionIdRef.current;
    if (staleSessionId) {
      fetch(`${CHAT_API_BASE_URL}/sessions/${staleSessionId}`, { method: "DELETE" }).catch(
        () => { }
      );
    }
    sessionIdRef.current = null;
    setMessages([createWelcomeMessage()]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div ref={chatRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-150 w-100 flex-col overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-2 bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-3 text-white">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Landmark size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">IDSSPL Banking Assistant</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Core banking help — ask me anything
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={startNewChat}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium hover:bg-white/20"
              >
                New chat
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 hover:bg-white/20"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#EEF1F8] p-4 dark:bg-slate-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${m.role === "user"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm border border-[#ECECEC] bg-white text-[#30343B] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
                <span className="mt-1 px-1 text-[11px] text-[#8A93A6] dark:text-slate-500">
                  {m.timestamp}
                </span>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[#ECECEC] bg-white px-3 py-2 text-sm text-[#5D6B82] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {!hasUserMessages && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    disabled={isSending}
                    className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-[#ECECEC] p-3 dark:border-slate-800">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your question..."
              className="max-h-24 flex-1 resize-none rounded-lg border border-[#ECECEC] bg-white px-3 py-2 text-sm text-[#30343B] outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isSending || !input.trim()}
              className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
      </button>
    </div>
  );
}
