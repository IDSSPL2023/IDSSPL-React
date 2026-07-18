// @ts-nocheck
import { Check, X, ChevronDown } from "lucide-react";

/**
 * Shared "Validate / Cancel / Display" footer used by the Support Utility
 * modify-style modals (Daily Scroll, Daily TXN, Denomination, ...). Validate
 * runs the caller's validation + loads whatever data is being reviewed;
 * Display is enabled once that succeeds and hands off to the caller (which
 * is expected to show the shared SuccessModal).
 */
const ModalFooterActions = ({ onValidate, onCancel, onDisplay, canDisplay }) => (
  <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
    <button
      type="button"
      onClick={onValidate}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
    >
      Validate <Check size={16} />
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
    >
      Cancel <X size={16} />
    </button>
    <button
      type="button"
      disabled={!canDisplay}
      onClick={onDisplay}
      className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        canDisplay
          ? "bg-primary text-white hover:bg-primary-700"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
      }`}
    >
      Display <ChevronDown size={16} />
    </button>
  </div>
);

export default ModalFooterActions;