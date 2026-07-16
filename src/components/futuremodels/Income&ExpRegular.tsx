// src/components/futuremodels/ReportsParameterBranchModal.tsx
import { useState } from "react";
import { Calendar, Percent, Printer, X, Database } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput } from "@/components/shared/FormFields";

export interface ReportsParameterBranchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportsParameterBranchModal({
  open,
  onClose,
}: ReportsParameterBranchModalProps) {
  const [branchCode] = useState("0002");
  const [asOnDate, setAsOnDate] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const handlePrint = () => {
    setIsValidated(true);
    // placeholder — wire to real print logic when available
  };

  const handleGenerate = () => {
    // placeholder — wire to real generate logic when available
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
            onClick={handleGenerate}
            disabled={!isValidated}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isValidated
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Generate
            <Database className="h-4 w-4" />
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
          <div className="flex flex-col gap-5">
            <FieldShell label="Branch Code " labelHi="शाखा कोड" required>
              <TextInput
                icon={<Percent size={16} />}
                value={branchCode}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="As on Date " labelHi="आजच्या तारखेनुसार" required>
              <TextInput
                icon={<Calendar size={16} />}
                value={asOnDate}
                onChange={setAsOnDate}
                placeholder="Enter From Date"
              />
            </FieldShell>
          </div>
        </div>
      </div>
    </FormModal>
  );
}