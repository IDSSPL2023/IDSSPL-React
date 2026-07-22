import { useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export interface TabModalTab {
  key: string;
  label: string;
  content: ReactNode;
}

export interface TabModalProps {
  onClose: () => void;
  tabs: TabModalTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerIcon?: ReactNode;
  footer?: ReactNode;
  readOnly?: boolean;
  headerActions?: ReactNode;
  /** Rendered to the right of the tab list itself (e.g. a per-tab "+ Add" action), not the dialog header. */
  tabBarActions?: ReactNode;
  maxWidthPx?: number;
}

/**
 * Generic, keyboard-accessible tabbed dialog (`role="tablist"/"tab"/"tabpanel"`,
 * roving tabindex, Arrow/Home/End navigation). First migration reference:
 * `/account-master/ca-sa` View.
 */
export default function TabModal({
  onClose,
  tabs,
  activeTab,
  onTabChange,
  title,
  subtitle,
  headerIcon,
  footer,
  readOnly = false,
  headerActions,
  tabBarActions,
  maxWidthPx,
}: TabModalProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.key === activeTab));

  const focusTab = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    onTabChange(tab.key);
    tabRefs.current[tab.key]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab((activeIndex + 1) % tabs.length);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab((activeIndex - 1 + tabs.length) % tabs.length);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Details"}
        style={maxWidthPx ? { maxWidth: `${maxWidthPx}px` } : undefined}
        className={`flex max-h-[92vh] w-full ${maxWidthPx ? "" : "max-w-[1200px]"} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        {(title || headerIcon) && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div className="flex items-start gap-3">
              {headerIcon}
              <div>
                {title && <h2 className="text-[20px] font-semibold leading-6 text-slate-800">{title}</h2>}
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {headerActions}
              {readOnly && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">Read only</span>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6">
          <div role="tablist" aria-label={typeof title === "string" ? title : "Tabs"} className="flex gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[tab.key] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tabmodal-tab-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={`tabmodal-panel-${tab.key}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onTabChange(tab.key)}
                  onKeyDown={handleKeyDown}
                  className={`relative shrink-0 whitespace-nowrap pb-3 pt-4 text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {isActive && <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
          {tabBarActions && <div className="pb-2">{tabBarActions}</div>}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              role="tabpanel"
              id={`tabmodal-panel-${tab.key}`}
              aria-labelledby={`tabmodal-tab-${tab.key}`}
              hidden={tab.key !== activeTab}
            >
              {tab.key === activeTab && tab.content}
            </div>
          ))}
        </div>

        {footer && <div className="border-t border-slate-100">{footer}</div>}
      </div>
    </div>
  );
}
