import { useState } from "react";
import { CreditCard, User, FileText, Settings, Check, X } from "lucide-react";
import { toast } from "react-toastify";

import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import {
  FieldShell,
  TextInput,
  SectionCard,
} from "@/components/shared/FormFields";

export interface MemoModalProps {
  onClose: () => void;
  onSubmit?: (memo: string) => void;
  accountCode?: string;
  accountName?: string;
}

const MAX_CHARACTERS = 200;

const MemoModal = ({
  onClose,
  onSubmit,
  accountCode = "7208076812",
  accountName = "Akshay Om More",
}: MemoModalProps) => {
  const [memo, setMemo] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMemoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      setMemo(e.target.value);

      if (error) setError(false);
      setValidated(false);
    }
  };

  const handleValidate = () => {
    if (!memo.trim()) {
      setError(true);
      setValidated(false);
      toast.error("Please enter Memo Details.");
      return;
    }

    setError(false);
    setValidated(true);
    toast.success("Memo validated successfully.");
  };

  const handleSave = () => {
    if (!validated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSubmit?.(memo);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="Memo Added Successfully"
        subtitle="Please Authorize"
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Memo"
      titleHi="मेमो"
      headerIcon={<Settings size={24} className="text-primary" />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खात्याचा तपशील"
        icon={<User size={16} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <FieldShell
            label="Account Code"
            labelHi="खाते क्रमांक"
            required
          >
            <TextInput
              icon={<CreditCard size={16} />}
              value={accountCode}
              readOnly
              onChange={() => {}}
            />
          </FieldShell>

          <FieldShell
            label="Name"
            labelHi="नाव"
            required
          >
            <TextInput
              icon={<User size={16} />}
              value={accountName}
              readOnly
              onChange={() => {}}
            />
          </FieldShell>

        </div>
      </SectionCard>

      <SectionCard
        titleEn="Memo Details"
        titleHi="मेमो तपशील"
        icon={<FileText size={16} />}
      >
        <FieldShell
          label="Memo Details"
          labelHi="मेमो तपशील"
          required
          error={error}
        >
          <div
            className={`rounded-lg border ${
              error
                ? "border-red-500"
                : "border-slate-300 dark:border-slate-700"
            }`}
          >
            <textarea
              rows={8}
              value={memo}
              onChange={handleMemoChange}
              placeholder="Enter Memo Details..."
              className="w-full resize-none rounded-lg bg-transparent p-3 outline-none dark:text-white"
            />
          </div>
        </FieldShell>

        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>Maximum 200 characters</span>
          <span>
            {memo.length}/{MAX_CHARACTERS}
          </span>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">

        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Validate
          <Check size={16} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary-50"
        >
          Cancel
          <X size={16} />
        </button>

        <button
          type="button"
          disabled={!validated}
          onClick={handleSave}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
            validated
              ? "bg-primary text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          Submit
          <Check size={16} />
        </button>

      </div>
    </FormModal>
  );
};

export default MemoModal;