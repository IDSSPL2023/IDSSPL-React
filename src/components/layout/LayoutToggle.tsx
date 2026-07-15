import { PanelLeft, PanelTop } from "lucide-react";
import { useLayoutMode } from "./LayoutModeProvider";

export default function LayoutToggle() {
  const { layoutMode, toggleLayoutMode } = useLayoutMode();
  const isSidebar = layoutMode === "sidebar";

  return (
    <button
      type="button"
      onClick={toggleLayoutMode}
      title={isSidebar ? "Switch to top navigation layout" : "Switch to sidebar layout"}
      aria-label="Toggle layout"
      className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#5D6B82] transition-all hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {isSidebar ? <PanelTop size={16} /> : <PanelLeft size={16} />}
    </button>
  );
}
