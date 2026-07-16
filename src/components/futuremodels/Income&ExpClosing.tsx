// src/components/futuremodels/ReportsParameterModal.tsx
import { useRef, useState } from "react";
import { Calendar, Printer, X } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput } from "@/components/shared/FormFields";

export interface ReportsParameterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportsParameterModal({
  open,
  onClose,
}: ReportsParameterModalProps) {
  const [asOnDate, setAsOnDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleIconClick = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof (el as any).showPicker === "function") {
      (el as any).showPicker();
    } else {
      el.focus();
    }
  };

  const handlePrint = () => {
    // placeholder — wire to real print/export logic when available
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Reports Parameter"
      titleHi="अहवाल मापदंड"
      subtitleEn="Process interest posting for eligible deposit accounts."
      subtitleHi="पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा."
      headerIcon={
        <div className="flex h-12 w-12 items-center justify-center">
          <Image src="/person icon.png" alt="Reports Parameter" width={40} height={40} />
        </div>
      }
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-4xl"
      customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Printing
            <Printer className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="p-1">
        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <FieldShell label="As on Date " labelHi="आजच्या तारखेनुसार" required>
            <div className="relative flex items-center">
              <span 
                onClick={handleIconClick}
                className="absolute left-3 z-10 cursor-pointer text-slate-400"
              >
                <Calendar size={16} />
              </span>
              <input
                ref={inputRef}
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer"
                style={{ opacity: 0, position: 'absolute' }}
              />
              <div 
                onClick={handleIconClick}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none cursor-pointer flex items-center"
              >
                {asOnDate || "Enter From Date"}
              </div>
            </div>
          </FieldShell>
        </div>
      </div>
    </FormModal>
  );
}