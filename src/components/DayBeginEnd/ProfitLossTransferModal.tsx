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

export interface ProfitLossTransferModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfitLossTransferModal({ open, onClose }: ProfitLossTransferModalProps) {
  const [branchName] = useState("Main Branch, Bilagi");
  const [userId] = useState("Admin");
  const [date, setDate] = useState("13-Jul-2026");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleTransfer = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Profile And Loss Transfer To BS"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/User.png" alt="Profile And Loss Transfer" width={48} height={48} />
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
              onClick={handleTransfer}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Transfer To IO
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-5">
              <FieldShell label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={branchName}
                  onChange={() => {}}
                  readOnly
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

              <FieldShell label="Date" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={date}
                  onChange={setDate}
                />
              </FieldShell>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Profit Loss Transferred Successfully"
          subtitle="Profit Loss has been transferred to IO."
        />
      )}
    </>
  );
}
