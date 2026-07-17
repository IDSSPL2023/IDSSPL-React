import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, Hash, IndianRupee, CreditCard, MoreVertical, Check, X, ChevronsDown } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import {
  DenominationTable,
  emptyDenominationRows,
  sumDenominationColumn,
  type DenominationNoteLabel,
} from "@/components/shared/DenominationTable";

type PickRow = { code: string; name: string };

const SCROLL_LIST: PickRow[] = [
  { code: "SCR-2026-001", name: "Outward Bill Collection Scroll" },
  { code: "SCR-2026-002", name: "Cash Handling Scroll" },
];

type PickerStringField = "scrollNumber";
type PickerField = "scrollNumber";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField?: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  scrollNumber: { title: "Scroll List", codeField: "scrollNumber", codeLabel: "Scroll No", nameLabel: "Description", rows: SCROLL_LIST },
};

const DENOMINATION_COLUMNS = [
  { key: "paid", label: "Paid" },
  { key: "receive", label: "Receive" },
];

export interface CombineAcceptPayCashFormData {
  scrollNumber: string;
  amount: string;
  accountCode: string;
  accountName: string;
  customerId: string;
  customerName: string;
  cashHandlingDate: string;
  denominations: Record<DenominationNoteLabel, Record<string, string>>;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA: CombineAcceptPayCashFormData = {
  scrollNumber: "",
  amount: "",
  accountCode: "",
  accountName: "",
  customerId: "",
  customerName: "",
  cashHandlingDate: "",
  denominations: emptyDenominationRows(["paid", "receive"]),
};

const TEXT_FIELD_KEYS: (keyof Omit<CombineAcceptPayCashFormData, "denominations">)[] = ["scrollNumber", "amount"];

const validateCombineAcceptPayCash = (
  data: CombineAcceptPayCashFormData
): Record<keyof Omit<CombineAcceptPayCashFormData, "denominations">, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof Omit<CombineAcceptPayCashFormData, "denominations">, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  errors.accountCode = false;
  errors.accountName = false;
  errors.customerId = false;
  errors.customerName = false;
  errors.cashHandlingDate = false;
  return errors;
};

/** Simulated save — no backend yet. */
const saveCombineAcceptPayCash = (data: CombineAcceptPayCashFormData) =>
  new Promise<CombineAcceptPayCashFormData>((resolve) => setTimeout(() => resolve(data), 600));

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

export interface CombineAcceptPayCashMultipleProps {
  onClose: () => void;
  onSave?: (data: CombineAcceptPayCashFormData) => void;
  variant?: "modal" | "page";
}

const CombineAcceptPayCashMultiple = ({ onClose, onSave, variant = "modal" }: CombineAcceptPayCashMultipleProps) => {
  const [form, setForm] = useState<CombineAcceptPayCashFormData>(DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<CombineAcceptPayCashFormData, "denominations">, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const markDirty = (field: keyof Omit<CombineAcceptPayCashFormData, "denominations">) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof Omit<CombineAcceptPayCashFormData, "denominations">, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateDenomination = (label: DenominationNoteLabel, column: "paid" | "receive", value: string) => {
    setIsValidated(false);
    setForm((f) => ({
      ...f,
      denominations: {
        ...f.denominations,
        [label]: { ...f.denominations[label], [column]: value },
      },
    }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    if (nameField) markDirty(nameField);
    setForm((f) => ({
      ...f,
      [codeField]: row.code,
      ...(nameField ? { [nameField]: row.name } : {}),
    }));
    setActivePicker(null);
  };

  const totals = useMemo(() => {
    const totalPaid = sumDenominationColumn(form.denominations, "paid");
    const totalReceive = sumDenominationColumn(form.denominations, "receive");
    return {
      totalPaid,
      totalReceive,
      differenceAmount: totalReceive - totalPaid,
      denominationAmount: totalPaid + totalReceive,
    };
  }, [form.denominations]);

  const handleValidate = () => {
    const newErrors = validateCombineAcceptPayCash(form);
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
    await saveCombineAcceptPayCash(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA);
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
        title="Combine Accept Pay Cash Multiple Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Combine Accept Pay Cash Multiple"
      titleHi="एकाधिक रोख देयके स्वीकारणे"
      subtitleEn="Accept and record multiple cash denominations for cash receipt and payment in a single transaction."
      subtitleHi="एकाच व्यवहारात रोख स्वीकार व अदा करण्यासाठी विविध चलनी नोटांची नोंद करा."
      headerIcon={<Image src="/person icon.png" alt="Combine Accept Pay Cash Multiple" width={50} height={50} />}
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
          <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={errors.scrollNumber}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.scrollNumber}
                  onChange={(v) => updateField("scrollNumber", v)}
                  placeholder="Enter Scroll Number"
                  error={errors.scrollNumber}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("scrollNumber")} />
            </div>
          </FieldShell>

          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.amount}
              onChange={(v) => updateField("amount", v)}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>

          <FieldShell label="Account Code" labelHi="खाते कोड" error={errors.accountCode}>
            <TextInput icon={<CreditCard size={16} />} value={form.accountCode} onChange={() => {}} readOnly error={errors.accountCode} />
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" error={errors.accountName}>
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly error={errors.accountName} />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" error={errors.customerId}>
            <TextInput icon={<Hash size={16} />} value={form.customerId} onChange={() => {}} readOnly error={errors.customerId} />
          </FieldShell>

          <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" error={errors.customerName}>
            <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} readOnly error={errors.customerName} />
          </FieldShell>

          <FieldShell label="Cash Handling Date" labelHi="रोख हाताळणी दिनांक" error={errors.cashHandlingDate}>
            <DateInput value={form.cashHandlingDate} onChange={() => {}} readOnly error={errors.cashHandlingDate} />
          </FieldShell>
        </div>
      </SectionCard>

      <DenominationTable
        columns={DENOMINATION_COLUMNS}
        rows={form.denominations}
        onChange={(label, column, value) => updateDenomination(label, column as "paid" | "receive", value)}
        totals={{ paid: String(totals.totalPaid), receive: String(totals.totalReceive) }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary-50 px-5 py-3.5 text-sm">
        <p className="text-primary">
          Verify the cash denomination totals before saving the transaction.{" "}
          <span className="text-slate-500">/ व्यवहार जतन करण्यापूर्वी चलनी नोटांची एकूण रक्कम पडताळा.</span>
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-primary">Total Paid</p>
            <p className="text-lg font-bold text-slate-800">{formatAmount(totals.totalPaid)}</p>
          </div>
          <div>
            <p className="text-primary">Difference Amount</p>
            <p className="text-lg font-bold text-slate-800">{formatAmount(totals.differenceAmount)}</p>
          </div>
          <div>
            <p className="text-primary">Denomination Amount</p>
            <p className="text-lg font-bold text-slate-800">{formatAmount(totals.denominationAmount)}</p>
          </div>
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

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default CombineAcceptPayCashMultiple;
