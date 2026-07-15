import { useState } from "react";
import { User, Calendar, X, Check, ChevronsDown } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

export interface GlobalDayEndModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalDayEndModal({ open, onClose }: GlobalDayEndModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId] = useState("Admin");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleDayClose = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  const tableData = [
    { code: "0002", name: "Bilagi", status: "Still Transacting" },
    { code: "0002", name: "Bilagi", status: "Still Transacting" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Global Day End"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/User.png" alt="Global Day End" width={48} height={48} />
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
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleDayClose}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Day Close
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Working Day" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={workingDay}
                  onChange={setWorkingDay}
                />
              </FieldShell>

              <FieldShell label="User ID" labelHi="व्यवहाराचा प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={userId}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>
            </div>

            {/* Branch Status Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B2143] text-white">
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Branch Code</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Branch Name</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.code}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.name}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Global Day Ended Successfully"
          subtitle="Working day has been closed."
        />
      )}
    </>
  );
}
