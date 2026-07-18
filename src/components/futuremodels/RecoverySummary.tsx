import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, IndianRupee, Check, X, ChevronsDown } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import {
  DenominationTable,
  emptyDenominationRows,
  sumDenominationColumn,
} from "@/components/shared/DenominationTable";

const DENOMINATION_COLUMNS = [
  { key: "noOfNotes", label: "No. Of Notes" },
  { key: "currentNotesOfUser", label: "Current Notes Of User(Admin)" },
  { key: "custDNotes", label: "CustD0002" },
];

const RECOVERY_ACTIONS = ["Deposit to Custody", "Withdraw"] as const;
type RecoveryAction = (typeof RECOVERY_ACTIONS)[number];

export interface RecoverySummaryFormData {
  cashHandlingDate: string;
  currentCash: string;
  action: RecoveryAction;
  denominationAmount: string;
  denominations: Record<string, Record<string, string>>;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_RECOVERY_SUMMARY_DATA: RecoverySummaryFormData = {
  cashHandlingDate: "",
  currentCash: "",
  action: "Withdraw",
  denominationAmount: "",
  denominations: emptyDenominationRows(["noOfNotes", "currentNotesOfUser", "custDNotes"]),
};

const validateRecoverySummary = (data: RecoverySummaryFormData) => ({
  denominationAmount: data.denominationAmount.trim() === "",
});

/** Simulated save — no backend yet. */
const saveRecoverySummary = (data: RecoverySummaryFormData) =>
  new Promise<RecoverySummaryFormData>((resolve) => setTimeout(() => resolve(data), 600));

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const RadioRecoveryAction = ({
  value,
  onChange,
}: {
  value: RecoveryAction;
  onChange: (v: RecoveryAction) => void;
}) => (
  <div className="flex flex-wrap items-center gap-4 pt-3">
    {RECOVERY_ACTIONS.map((opt) => (
      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="h-4 w-4 accent-primary"
        />
        {opt}
      </label>
    ))}
  </div>
);

export interface RecoverySummaryProps {
  onClose: () => void;
  onSave?: (data: RecoverySummaryFormData) => void;
  variant?: "modal" | "page";
}

const RecoverySummary = ({ onClose, onSave, variant = "modal" }: RecoverySummaryProps) => {
  const [form, setForm] = useState<RecoverySummaryFormData>(DEFAULT_RECOVERY_SUMMARY_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"denominationAmount", boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const markDirty = () => setIsValidated(false);

  const updateDenominationAmount = (value: string) => {
    markDirty();
    setErrors((e) => (e.denominationAmount ? { ...e, denominationAmount: false } : e));
    setForm((f) => ({ ...f, denominationAmount: value }));
  };

  const updateDenomination = (label: string, column: string, value: string) => {
    markDirty();
    setForm((f) => ({
      ...f,
      denominations: {
        ...f.denominations,
        [label]: { ...f.denominations[label], [column]: value },
      },
    }));
  };

  const totals = useMemo(() => {
    const totalNoOfNotes = sumDenominationColumn(form.denominations, "noOfNotes");
    const totalCurrentNotesOfUser = sumDenominationColumn(form.denominations, "currentNotesOfUser");
    const totalCustDNotes = sumDenominationColumn(form.denominations, "custDNotes");
    return {
      totalNoOfNotes,
      totalCurrentNotesOfUser,
      totalCustDNotes,
      remainingAmount: Number(form.denominationAmount || 0) - totalNoOfNotes,
    };
  }, [form.denominations, form.denominationAmount]);

  const handleValidate = () => {
    const newErrors = validateRecoverySummary(form);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveRecoverySummary(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_RECOVERY_SUMMARY_DATA);
    setErrors({});
    setIsValidated(false);
    onClose();
  };

  const handleSuccessDone = () => {
    onSave?.(form);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Recovery Summary Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Recovery Summary"
      titleHi="व्याज तपशील"
      subtitleEn="Manage customer's personal and identity information."
      subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      headerIcon={<Image src="/person icon.png" alt="Recovery Summary" width={50} height={50} />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खात्याचा तपशील"
        subtitleEn="Enter the account details for outward bill collection."
        subtitleHi="जावक बिल वसुलीसाठी खात्याचे तपशील भरा."
        icon={<SectionIcon />}
      >
        <div className={`${grid3} mt-2`}>
          <FieldShell label="Cash Handling Date" labelHi="रोख हाताळणी दिनांक" required>
            <DateInput value={form.cashHandlingDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Current Cash" labelHi="सध्याची रोख रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={form.currentCash} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Select" labelHi="निवडा">
            <RadioRecoveryAction
              value={form.action}
              onChange={(v) => {
                markDirty();
                setForm((f) => ({ ...f, action: v }));
              }}
            />
          </FieldShell>

          <FieldShell label="Denomination Amount" labelHi="चलनी रक्कम" required error={errors.denominationAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.denominationAmount}
              onChange={updateDenominationAmount}
              placeholder="Enter Amount"
              error={errors.denominationAmount}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <DenominationTable
        columns={DENOMINATION_COLUMNS}
        rows={form.denominations}
        onChange={updateDenomination}
        totals={{
          noOfNotes: String(totals.totalNoOfNotes),
          currentNotesOfUser: String(totals.totalCurrentNotesOfUser),
          custDNotes: String(totals.totalCustDNotes),
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary-50 px-5 py-3.5 text-sm">
        <p className="font-medium text-primary">Remaining Amount</p>
        <div>
          <p className="text-primary">Amount</p>
          <p className="text-lg font-bold text-slate-800">{formatAmount(totals.remainingAmount)}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate <Check size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValidated || isSaving}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated && !isSaving
              ? "bg-primary text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isSaving ? "Saving..." : "Save"} <ChevronsDown size={16} />
        </button>
      </div>
    </FormModal>
  );
};

export default RecoverySummary;
