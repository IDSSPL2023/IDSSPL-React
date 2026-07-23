import type { LucideIcon } from "lucide-react";
import BaseModal from "./BaseModal";

export interface ActionModalItem {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface ActionModalProps {
  onClose: () => void;
  items: ActionModalItem[];
  title?: string;
}

/**
 * Lists a row's available actions as a standard dialog — the dialog-shaped
 * alternative to `table/TableActionMenu`'s portal dropdown, for contexts
 * (e.g. touch/mobile-width layouts) where a dropdown isn't appropriate.
 */
export default function ActionModal({ onClose, items, title = "Actions" }: ActionModalProps) {
  return (
    <BaseModal onClose={onClose} size="sm" title={title} contentClassName="rounded-[24px]" bodyClassName="px-4 py-3">
      <div className="flex flex-col">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ${
                item.destructive ? "text-red-600" : "text-slate-700"
              }`}
            >
              <Icon size={18} className={`shrink-0 ${item.destructive ? "text-red-500" : "text-primary"}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </BaseModal>
  );
}
