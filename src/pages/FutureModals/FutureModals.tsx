import { useState, useMemo } from "react";
import { Calendar, ChevronDown, FileText, Percent, UserRound, X, User, Hash, IndianRupee, CreditCard, MoreVertical, Check, ChevronsDown, IdCard, Smartphone } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { FieldShell, LookupButton, TextInput, DateInput, SectionCard, SelectInput, RadioYesNo } from "@/components/shared/FormFields";
import { useBilingual } from "@/i18n/useBilingual";
import { IMAGES } from "@/assets";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import ListModal from "@/components/AccountMaster/ListModal";
import { DenominationTable, emptyDenominationRows, sumDenominationColumn, type DenominationNoteLabel } from "@/components/shared/DenominationTable";
import { useNavigate } from "react-router-dom";
import InterestPostingProcess from "@/components/futuremodels/InterestPostingProcess";
import SetBranchParameterModal from "@/components/FinancialClosing/SetBranchParameterModal";
import GeneratedInwardScheduleModal from "@/components/Clerk/Modals/GenerateInwardSchedule";
import GenerateOutwardScheduleModal from "@/components/Clerk/Modals/GenerateOutwordSchedule";
import ClearingTallyModal from "@/components/Clerk/Modals/ClearingTallyAndHouse";
import InwardClearingEntryModal from "@/components/futuremodels/InwardClearingEntryModal";
import OutwardClearingBounceModal from "@/components/futuremodels/OutwardClearingBounceModal";
import OutwardClearingEntryModal from "@/components/futuremodels/OutwardClearingEntryModal";

/* ===== from AddModifyLoanInterestRate.tsx ===== */
export interface AddModifyLoanInterestRate_LoanInterestRateRow {
  id: string;
  checked: boolean;
  interestRate: string;
  penalInterest: string;
  overdueInterest: string;
  moratoriumInterest: string;
  dateOfApplication: string;
}

export interface AddModifyLoanInterestRate_LoanInterestRateData {
  accountCode: string;
  accountName: string;
  rows: AddModifyLoanInterestRate_LoanInterestRateRow[];
}

export interface AddModifyLoanInterestRate_AddModifyLoanInterestRateProps {
  onClose: () => void;
  onSave?: (data: AddModifyLoanInterestRate_LoanInterestRateData) => void;
  variant?: "modal" | "page";
}

const AddModifyLoanInterestRate_DEFAULT_ROWS: AddModifyLoanInterestRate_LoanInterestRateRow[] = [
  {
    id: "current",
    checked: false,
    interestRate: "00025050007604",
    penalInterest: "14.0",
    overdueInterest: "2.0",
    moratoriumInterest: "0.0",
    dateOfApplication: "2026-11-12",
  },
  {
    id: "modified",
    checked: true,
    interestRate: "00025050007604",
    penalInterest: "14.0",
    overdueInterest: "2.0",
    moratoriumInterest: "0",
    dateOfApplication: "2026-03-12",
  },
];

const AddModifyLoanInterestRate_ACCOUNT_CODES = ["0002", "0003", "0004"];

const AddModifyLoanInterestRate_percentFields = ["penalInterest", "overdueInterest", "moratoriumInterest"] as const;

function AddModifyLoanInterestRate({
  onClose,
  onSave,
  variant = "modal",
}: AddModifyLoanInterestRate_AddModifyLoanInterestRateProps) {
  const { en, t, tRaw } = useBilingual();
  const [accountCode, setAccountCode] = useState("0002");
  const [accountName] = useState("");
  const [rows, setRows] = useState<AddModifyLoanInterestRate_LoanInterestRateRow[]>(AddModifyLoanInterestRate_DEFAULT_ROWS);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateRow = (id: string, patch: Partial<AddModifyLoanInterestRate_LoanInterestRateRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addNewRow = () => {
    setRows((prev) => [
      ...prev.map((row) => ({ ...row, checked: false })),
      {
        id: `new-${Date.now()}`,
        checked: true,
        interestRate: accountCode.padEnd(14, "0"),
        penalInterest: "0.0",
        overdueInterest: "0.0",
        moratoriumInterest: "0.0",
        dateOfApplication: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const handleSave = () => {
    const payload = { accountCode, accountName, rows };
    onSave?.(payload);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
        title={en("loanInterestRate.successTitle")}
        subtitle={en("loanInterestRate.successSubtitle")}
      />
    );
  }

  const footer = (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={addNewRow}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md border border-primary-500 bg-white px-4 text-xs font-medium text-primary transition hover:bg-primary-50"
      >
        {en("loanInterestRate.actions.new")}
        <FileText size={13} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md border border-primary-500 bg-white px-4 text-xs font-medium text-primary transition hover:bg-primary-50"
      >
        {en("common.cancel")}
        <X size={13} />
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md bg-primary-100 px-4 text-xs font-medium text-primary transition hover:bg-primary-200"
      >
        {en("common.save")}
        <ChevronDown size={13} />
      </button>
    </div>
  );

  return (
    <FormModal
      onClose={onClose}
      titleEn={en("loanInterestRate.title")}
      titleHi={t("loanInterestRate.title")}
      subtitleEn={en("loanInterestRate.subtitle")}
      subtitleHi={t("loanInterestRate.subtitle")}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      maxWidth="max-w-5xl"
      hideFooter
      customFooter={footer}
      variant={variant}
    >
      <div className="rounded-xl border border-primary border-t-4 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_44px_1.1fr] md:items-end">
          <FieldShell
            label={en("fields.accountCode")}
            labelHi={t("fields.accountCode")}
            required
          >
            <TextInput
              icon={<UserRound size={16} />}
              value={accountCode}
              onChange={setAccountCode}
              placeholder={tRaw("loanInterestRate.placeholders.accountCode")}
              trailing={<LookupButton items={AddModifyLoanInterestRate_ACCOUNT_CODES} onPick={setAccountCode} />}
            />
          </FieldShell>

          <div className="hidden md:block" />

          <FieldShell
            label={en("fields.accountName")}
            labelHi={t("fields.accountName")}
            required
          >
            <TextInput
              icon={<UserRound size={16} />}
              value={accountName}
              onChange={() => {}}
              placeholder={tRaw("loanInterestRate.placeholders.accountName")}
              readOnly
            />
          </FieldShell>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <table className="min-w-[850px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[64px]" />
            <col className="w-[210px]" />
            <col className="w-[145px]" />
            <col className="w-[145px]" />
            <col className="w-[165px]" />
            <col className="w-[185px]" />
          </colgroup>
          <thead>
            <tr className="bg-[#211858] text-left text-xs font-semibold text-white">
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.check")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.interestRate")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.penalInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.overdueInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.moratoriumInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.dateOfApplication")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 last:border-b-0 ${
                  row.checked ? "bg-[#F7F8FC]" : "bg-white"
                }`}
              >
                <td className="px-3 py-2 align-middle">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(event) => updateRow(row.id, { checked: event.target.checked })}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-primary"
                  />
                </td>
                <td className="px-3 py-2 align-middle">
                  <span className="block truncate text-xs font-medium text-[#1F2858]">
                    {row.interestRate}
                  </span>
                </td>
                {AddModifyLoanInterestRate_percentFields.map((field) => (
                  <td key={field} className="px-3 py-2 align-middle">
                    <AddModifyLoanInterestRate_PercentInput
                      value={row[field]}
                      disabled={!row.checked}
                      onChange={(value) => updateRow(row.id, { [field]: value })}
                    />
                  </td>
                ))}
                <td className="px-3 py-2 align-middle">
                  <AddModifyLoanInterestRate_DateCell
                    value={row.dateOfApplication}
                    disabled={!row.checked}
                    onChange={(value) => updateRow(row.id, { dateOfApplication: value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}
function AddModifyLoanInterestRate_PercentInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-8 items-center rounded-md border px-2.5 text-xs ${
        disabled
          ? "border-slate-200 bg-slate-100 text-slate-500"
          : "border-primary bg-white text-slate-700 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]"
      }`}
    >
      <Percent size={12} className="mr-1.5 shrink-0 text-slate-500" />
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
      />
    </label>
  );
}

function AddModifyLoanInterestRate_DateCell({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-8 items-center rounded-md border px-2.5 text-xs ${
        disabled
          ? "border-slate-200 bg-slate-100 text-slate-500"
          : "border-primary bg-white text-slate-700 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]"
      }`}
    >
      <Calendar size={12} className="mr-1.5 shrink-0 text-slate-500" />
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
      />
    </label>
  );
}


/* ===== from CombineAcceptPayCashMultiple.tsx ===== */
type CombineAcceptPayCashMultiple_PickRow = { code: string; name: string };

const CombineAcceptPayCashMultiple_SCROLL_LIST: CombineAcceptPayCashMultiple_PickRow[] = [
  { code: "SCR-2026-001", name: "Outward Bill Collection Scroll" },
  { code: "SCR-2026-002", name: "Cash Handling Scroll" },
];

type CombineAcceptPayCashMultiple_PickerStringField = "scrollNumber";
type CombineAcceptPayCashMultiple_PickerField = "scrollNumber";

const CombineAcceptPayCashMultiple_PICKER_CONFIG: Record<
  CombineAcceptPayCashMultiple_PickerField,
  { title: string; codeField: CombineAcceptPayCashMultiple_PickerStringField; nameField?: CombineAcceptPayCashMultiple_PickerStringField; codeLabel: string; nameLabel: string; rows: CombineAcceptPayCashMultiple_PickRow[] }
> = {
  scrollNumber: { title: "Scroll List", codeField: "scrollNumber", codeLabel: "Scroll No", nameLabel: "Description", rows: CombineAcceptPayCashMultiple_SCROLL_LIST },
};

const CombineAcceptPayCashMultiple_DENOMINATION_COLUMNS = [
  { key: "paid", label: "Paid" },
  { key: "receive", label: "Receive" },
];

export interface CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData {
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
export const CombineAcceptPayCashMultiple_DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA: CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData = {
  scrollNumber: "",
  amount: "",
  accountCode: "",
  accountName: "",
  customerId: "",
  customerName: "",
  cashHandlingDate: "",
  denominations: emptyDenominationRows(["paid", "receive"]),
};

const CombineAcceptPayCashMultiple_TEXT_FIELD_KEYS: (keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">)[] = ["scrollNumber", "amount"];

const CombineAcceptPayCashMultiple_validateCombineAcceptPayCash = (
  data: CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData
): Record<keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">, boolean>;
  CombineAcceptPayCashMultiple_TEXT_FIELD_KEYS.forEach((key) => {
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
const CombineAcceptPayCashMultiple_saveCombineAcceptPayCash = (data: CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData) =>
  new Promise<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData>((resolve) => setTimeout(() => resolve(data), 600));

const CombineAcceptPayCashMultiple_formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

const CombineAcceptPayCashMultiple_LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const CombineAcceptPayCashMultiple_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

export interface CombineAcceptPayCashMultiple_CombineAcceptPayCashMultipleProps {
  onClose: () => void;
  onSave?: (data: CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData) => void;
  variant?: "modal" | "page";
}

const CombineAcceptPayCashMultiple = ({ onClose, onSave, variant = "modal" }: CombineAcceptPayCashMultiple_CombineAcceptPayCashMultipleProps) => {
  const [form, setForm] = useState<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData>(CombineAcceptPayCashMultiple_DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<CombineAcceptPayCashMultiple_PickerField | null>(null);

  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const markDirty = (field: keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof Omit<CombineAcceptPayCashMultiple_CombineAcceptPayCashFormData, "denominations">, value: string) => {
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

  const handlePickRow = (row: CombineAcceptPayCashMultiple_PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = CombineAcceptPayCashMultiple_PICKER_CONFIG[activePicker];
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
    const newErrors = CombineAcceptPayCashMultiple_validateCombineAcceptPayCash(form);
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
    await CombineAcceptPayCashMultiple_saveCombineAcceptPayCash(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(CombineAcceptPayCashMultiple_DEFAULT_COMBINE_ACCEPT_PAY_CASH_DATA);
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
      headerIcon={<Image src={IMAGES.PERSON_ICON} alt="Combine Accept Pay Cash Multiple" width={50} height={50} />}
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
        icon={<CombineAcceptPayCashMultiple_SectionIcon />}
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
              <CombineAcceptPayCashMultiple_LookupTrigger onClick={() => setActivePicker("scrollNumber")} />
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
        columns={CombineAcceptPayCashMultiple_DENOMINATION_COLUMNS}
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
            <p className="text-lg font-bold text-slate-800">{CombineAcceptPayCashMultiple_formatAmount(totals.totalPaid)}</p>
          </div>
          <div>
            <p className="text-primary">Difference Amount</p>
            <p className="text-lg font-bold text-slate-800">{CombineAcceptPayCashMultiple_formatAmount(totals.differenceAmount)}</p>
          </div>
          <div>
            <p className="text-primary">Denomination Amount</p>
            <p className="text-lg font-bold text-slate-800">{CombineAcceptPayCashMultiple_formatAmount(totals.denominationAmount)}</p>
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
          title={CombineAcceptPayCashMultiple_PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: CombineAcceptPayCashMultiple_PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: CombineAcceptPayCashMultiple_PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={CombineAcceptPayCashMultiple_PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};


/* ===== from PayCash.tsx ===== */
const PayCash_DENOMINATION_COLUMNS = [
  { key: "received", label: "Received" },
  { key: "paid", label: "Paid" },
];

export interface PayCash_PayCashFormData {
  accountCode: string;
  accountName: string;
  customerId: string;
  customerName: string;
  transactionAmount: string;
  scrollNumber: string;
  cashHandlingDate: string;
  denominations: Record<string, Record<string, string>>;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). All
 * account context here is read-only: this screen is opened from an existing scroll. */
export const PayCash_DEFAULT_PAY_CASH_DATA: PayCash_PayCashFormData = {
  accountCode: "",
  accountName: "",
  customerId: "",
  customerName: "",
  transactionAmount: "",
  scrollNumber: "",
  cashHandlingDate: "",
  denominations: emptyDenominationRows(["received", "paid"]),
};

/** Simulated save — no backend yet. */
const PayCash_savePayCash = (data: PayCash_PayCashFormData) =>
  new Promise<PayCash_PayCashFormData>((resolve) => setTimeout(() => resolve(data), 600));

const PayCash_formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export interface PayCash_PayCashProps {
  onClose: () => void;
  onSave?: (data: PayCash_PayCashFormData) => void;
  variant?: "modal" | "page";
}

const PayCash = ({ onClose, onSave, variant = "modal" }: PayCash_PayCashProps) => {
  const [form, setForm] = useState<PayCash_PayCashFormData>(PayCash_DEFAULT_PAY_CASH_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

  const updateDenomination = (label: string, column: string, value: string) => {
    setIsValidated(false);
    setForm((f) => ({
      ...f,
      denominations: {
        ...f.denominations,
        [label]: { ...f.denominations[label], [column]: value },
      },
    }));
  };

  const totals = useMemo(() => {
    const totalReceived = sumDenominationColumn(form.denominations, "received");
    const totalPaid = sumDenominationColumn(form.denominations, "paid");
    return {
      totalReceived,
      totalPaid,
      denominationAmount: totalReceived - totalPaid,
    };
  }, [form.denominations]);

  const handleValidate = () => {
    setIsValidated(true);
    toast.success("All fields validated successfully.");
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await PayCash_savePayCash(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(PayCash_DEFAULT_PAY_CASH_DATA);
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
        title="Pay Cash Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Pay Cash"
      titleHi="व्याज तपशील"
      subtitleEn="Manage customer's personal and identity information."
      subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      headerIcon={<Image src={IMAGES.PERSON_ICON} alt="Pay Cash" width={50} height={50} />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <div className="rounded-[20px] border-2 border-primary p-6">
        <div className={grid4}>
          <FieldShell label="Account Code" labelHi="खाते कोड" required>
            <TextInput icon={<CreditCard size={16} />} value={form.accountCode} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खाते नाव" required>
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
            <TextInput icon={<Hash size={16} />} value={form.customerId} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
            <TextInput icon={<User size={16} />} value={form.customerName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={form.transactionAmount} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
            <TextInput icon={<Hash size={16} />} value={form.scrollNumber} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Cash Handling Date" labelHi="रोकड हाताळणी दिनांक" required>
            <DateInput value={form.cashHandlingDate} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </div>

      <DenominationTable
        firstColumnLabel="Cash Detail"
        columns={PayCash_DENOMINATION_COLUMNS}
        rows={form.denominations}
        onChange={updateDenomination}
        totals={{ received: String(totals.totalReceived), paid: String(totals.totalPaid) }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary-50 px-5 py-3.5 text-sm">
        <p className="font-medium text-primary">Denomination Amount</p>
        <div>
          <p className="text-primary">Amount</p>
          <p className="text-lg font-bold text-slate-800">{PayCash_formatAmount(totals.denominationAmount)}</p>
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


/* ===== from RecoverySummary.tsx ===== */
const RecoverySummary_DENOMINATION_COLUMNS = [
  { key: "noOfNotes", label: "No. Of Notes" },
  { key: "currentNotesOfUser", label: "Current Notes Of User(Admin)" },
  { key: "custDNotes", label: "CustD0002" },
];

const RecoverySummary_RECOVERY_ACTIONS = ["Deposit to Custody", "Withdraw"] as const;
type RecoverySummary_RecoveryAction = (typeof RecoverySummary_RECOVERY_ACTIONS)[number];

export interface RecoverySummary_RecoverySummaryFormData {
  cashHandlingDate: string;
  currentCash: string;
  action: RecoverySummary_RecoveryAction;
  denominationAmount: string;
  denominations: Record<string, Record<string, string>>;
}

/** Reusable dummy data — used to prefill the form on open (backend not ready). */
export const RecoverySummary_DEFAULT_RECOVERY_SUMMARY_DATA: RecoverySummary_RecoverySummaryFormData = {
  cashHandlingDate: "",
  currentCash: "",
  action: "Withdraw",
  denominationAmount: "",
  denominations: emptyDenominationRows(["noOfNotes", "currentNotesOfUser", "custDNotes"]),
};

const RecoverySummary_validateRecoverySummary = (data: RecoverySummary_RecoverySummaryFormData) => ({
  denominationAmount: data.denominationAmount.trim() === "",
});

/** Simulated save — no backend yet. */
const RecoverySummary_saveRecoverySummary = (data: RecoverySummary_RecoverySummaryFormData) =>
  new Promise<RecoverySummary_RecoverySummaryFormData>((resolve) => setTimeout(() => resolve(data), 600));

const RecoverySummary_formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

const RecoverySummary_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const RecoverySummary_RadioRecoveryAction = ({
  value,
  onChange,
}: {
  value: RecoverySummary_RecoveryAction;
  onChange: (v: RecoverySummary_RecoveryAction) => void;
}) => (
  <div className="flex flex-wrap items-center gap-4 pt-3">
    {RecoverySummary_RECOVERY_ACTIONS.map((opt) => (
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

export interface RecoverySummary_RecoverySummaryProps {
  onClose: () => void;
  onSave?: (data: RecoverySummary_RecoverySummaryFormData) => void;
  variant?: "modal" | "page";
}

const RecoverySummary = ({ onClose, onSave, variant = "modal" }: RecoverySummary_RecoverySummaryProps) => {
  const [form, setForm] = useState<RecoverySummary_RecoverySummaryFormData>(RecoverySummary_DEFAULT_RECOVERY_SUMMARY_DATA);
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
    const newErrors = RecoverySummary_validateRecoverySummary(form);
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
    await RecoverySummary_saveRecoverySummary(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(RecoverySummary_DEFAULT_RECOVERY_SUMMARY_DATA);
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
      headerIcon={<Image src={IMAGES.PERSON_ICON} alt="Recovery Summary" width={50} height={50} />}
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
        icon={<RecoverySummary_SectionIcon />}
      >
        <div className={`${grid3} mt-2`}>
          <FieldShell label="Cash Handling Date" labelHi="रोख हाताळणी दिनांक" required>
            <DateInput value={form.cashHandlingDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Current Cash" labelHi="सध्याची रोख रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={form.currentCash} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Select" labelHi="निवडा">
            <RecoverySummary_RadioRecoveryAction
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
        columns={RecoverySummary_DENOMINATION_COLUMNS}
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
          <p className="text-lg font-bold text-slate-800">{RecoverySummary_formatAmount(totals.remainingAmount)}</p>
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


/* ===== from StopChequePayment.tsx ===== */
const StopChequePayment_CHEQUE_TYPE_OPTIONS = ["CTS", "Non-CTS"];

export interface StopChequePayment_StopChequePaymentData {
  accountCode: string;
  name: string;
  chequeType: string;
  chequeSeries: string;
  chequeNoFrom: string;
  chequeNoTo: string;
  reason: string;
  chargesApply: boolean;
  serviceCharges: string;
  serviceTax: string;
}

const StopChequePayment_DEFAULT_DATA: StopChequePayment_StopChequePaymentData = {
  accountCode: "1234567890",
  name: "Akshay Om More",
  chequeType: "CTS",
  chequeSeries: "A",
  chequeNoFrom: "10010",
  chequeNoTo: "10020",
  reason: "",
  chargesApply: true,
  serviceCharges: "50",
  serviceTax: "9",
};

type StopChequePayment_StopChequePaymentStringField = {
  [K in keyof StopChequePayment_StopChequePaymentData]: StopChequePayment_StopChequePaymentData[K] extends string ? K : never;
}[keyof StopChequePayment_StopChequePaymentData];

const StopChequePayment_REQUIRED_FIELDS: StopChequePayment_StopChequePaymentStringField[] = [
  "accountCode",
  "name",
  "chequeType",
  "chequeSeries",
  "chequeNoFrom",
  "chequeNoTo",
  "reason",
  "serviceCharges",
  "serviceTax",
];

const StopChequePayment_SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const StopChequePayment_ChequeIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <IdCard size={20} className="text-primary" />
  </div>
);

export interface StopChequePayment_StopChequePaymentProps {
  onClose: () => void;
  onSave?: (data: StopChequePayment_StopChequePaymentData) => void;
  variant?: "modal" | "page";
}

function StopChequePayment({ onClose, onSave, variant = "modal" }: StopChequePayment_StopChequePaymentProps) {
  const [data, setData] = useState<StopChequePayment_StopChequePaymentData>(StopChequePayment_DEFAULT_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof StopChequePayment_StopChequePaymentData, boolean>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clearError = (key: keyof StopChequePayment_StopChequePaymentData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof StopChequePayment_StopChequePaymentData) =>
    (value: string) => {
      setData((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof StopChequePayment_StopChequePaymentData, boolean>> = {};
    StopChequePayment_REQUIRED_FIELDS.forEach((key) => {
      if (!data[key].trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleValidate = () => setIsValidated(validate());

  const handleSave = () => {
    if (!isValidated) return;
    onSave?.(data);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
        title="Cheque Payment Stopped Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Stop Payment Revoke"
      titleHi="चेक पेमेंट थांबवा"
      headerIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
          <Smartphone size={22} />
        </div>
      }
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      onValidate={handleValidate}
      onSave={handleSave}
      isLastTab
      variant={variant}
    >
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<StopChequePayment_SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldShell label="Account Code" labelHi="खात्याचा कोड" required error={!!errors.accountCode}>
            <TextInput
              icon={<IdCard size={16} />}
              value={data.accountCode}
               onChange={() => {}}
              readOnly
              placeholder="Enter Account Code"
              error={!!errors.accountCode}
            />
          </FieldShell>

          <FieldShell label="Name" labelHi="नाव" required error={!!errors.name}>
            <TextInput
              icon={<User size={16} />}
              value={data.name}
              onChange={() => {}}
              readOnly
              placeholder="Name"
              error={!!errors.name}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="Cheque Details" titleHi="तपशील तपासा" icon={<StopChequePayment_ChequeIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FieldShell label="Cheque Type" labelHi="चेक प्रकार" required error={!!errors.chequeType}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={data.chequeType}
                            onChange={() => {}}
              readOnly
              options={StopChequePayment_CHEQUE_TYPE_OPTIONS}
              placeholder="Select Cheque Type"
              error={!!errors.chequeType}
            />
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="चेक प्रकार" required error={!!errors.chequeSeries}>
            <TextInput
              icon={<FileText size={16} />}
              value={data.chequeSeries}
                            onChange={() => {}}
              readOnly
              placeholder="Enter Cheque Series"
              error={!!errors.chequeSeries}
            />
          </FieldShell>

          <FieldShell label="Cheque No From" labelHi="चेक क्रमांकापासून" required error={!!errors.chequeNoFrom}>
            <TextInput
              icon={<Hash size={16} />}
              value={data.chequeNoFrom}
              onChange={set("chequeNoFrom")}
              readOnly
              placeholder="Cheque No From"
              error={!!errors.chequeNoFrom}
            />
          </FieldShell>

          <FieldShell label="Cheque No To" labelHi="चेक क्रमांकापर्यंत" required error={!!errors.chequeNoTo}>
            <TextInput
              icon={<Hash size={16} />}
              value={data.chequeNoTo}
              onChange={set("chequeNoTo")}
              readOnly
              placeholder="Cheque No To"
              error={!!errors.chequeNoTo}
            />
          </FieldShell>
        </div>

        <div className="mt-4">
          <FieldShell label="Reason for Cheque Stop" required error={!!errors.reason}>
            <div
              className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 focus-within:ring-2 ${
                errors.reason
                  ? "border-red-300 focus-within:ring-red-100"
                  : "border-primary focus-within:ring-primary/10"
              }`}
            >
              <FileText size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <textarea
                rows={3}
                value={data.reason}
                             onChange={() => {}}
              readOnly
                placeholder="Reason for Cheque Stop"
                className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </FieldShell>
        </div>

      </SectionCard>
    </FormModal>
  );
}


/* ===== from FutureModal.tsx ===== */
interface FutureModelAction {
  label: string;
  path: string;
}

const FutureModalsPage = () => {
    const navigate = useNavigate();
    const [showStopChequePayment, setShowStopChequePayment] = useState(false);
    const [showLoanInterestRate, setShowLoanInterestRate] = useState(false);
    const [showInterestPosting, setShowInterestPosting] = useState(false);
    const [showSiPosting, setShowSiPosting] = useState(false);
    const [showSetBranchParameter, setShowSetBranchParameter] = useState(false);
    const [showCombineAcceptPayCash, setShowCombineAcceptPayCash] = useState(false);
    const [showRecoverySummary, setShowRecoverySummary] = useState(false);
    const [showPayCash, setShowPayCash] = useState(false);
  const [clerkModal, setClerkModal] = useState<"tally"|"inward"|"outward"|"">("tally");
    const [showInwardClearing, setShowInwardClearing] = useState(false);
    const [showOutwardBounce, setShowOutwardBounce] = useState(false);
    const [showOutwardClearing, setShowOutwardClearing] = useState(false);

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-4">
                <button
                    type="button"
                    onClick={() => setShowStopChequePayment(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    STOP CHEQUE PAYMENT
                </button>

        <button
          type="button"
          onClick={() => setShowLoanInterestRate(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          ADD/MODIFY LOAN INTEREST RATE
        </button>

                <button
                    type="button"
                    onClick={() => setShowInterestPosting(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    MATURED TD
                </button>

                <button
                    type="button"
                    onClick={() => setShowSetBranchParameter(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    SET BRANCH PARAMETER
                </button>

                <button
                    type="button"
                    onClick={() => setShowInwardClearing(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
                >
                    INWARD CLEARING ENTRY
                </button>

                <button
                    type="button"
                    onClick={() => setShowOutwardBounce(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-orange-700"
                >
                    OUTWARD CLEARING BOUNCE
                </button>

                <button
                    type="button"
                    onClick={() => setShowOutwardClearing(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700"
                >
                    OUTWARD CLEARING ENTRY
                </button>

                <button
                    type="button"
                    onClick={() => setShowCombineAcceptPayCash(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    COMBINE ACCEPT PAY CASH MULTIPLE
                </button>

                <button
                    type="button"
                    onClick={() => setShowRecoverySummary(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    RECOVERY SUMMARY
                </button>

                <button
                    type="button"
                    onClick={() => setShowPayCash(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    PAY CASH
                </button>
            </div>

      {showStopChequePayment && (
        <StopChequePayment onClose={() => setShowStopChequePayment(false)} />
      )}

            {showLoanInterestRate && (
                <AddModifyLoanInterestRate onClose={() => setShowLoanInterestRate(false)} />
            )}

      {showSetBranchParameter && (
        <SetBranchParameterModal
          onClose={() => setShowSetBranchParameter(false)}
        />
      )}


        <GeneratedInwardScheduleModal open={clerkModal === "inward"}
            onClose={() => setClerkModal("")}
        />

       <GenerateOutwardScheduleModal open={clerkModal === "outward"}
            onClose={() => setClerkModal("")}

        />

        <ClearingTallyModal open={clerkModal === "tally"}
            onClose={() => setClerkModal("")}
        />

            {showInwardClearing && (
                <InwardClearingEntryModal
                    open={showInwardClearing}
                    onClose={() => setShowInwardClearing(false)}
                />
            )}

            {showOutwardBounce && (
                <OutwardClearingBounceModal
                    open={showOutwardBounce}
                    onClose={() => setShowOutwardBounce(false)}
                />
            )}

            {showOutwardClearing && (
                <OutwardClearingEntryModal
                    open={showOutwardClearing}
                    onClose={() => setShowOutwardClearing(false)}
                />
            )}

            {showCombineAcceptPayCash && (
                <CombineAcceptPayCashMultiple onClose={() => setShowCombineAcceptPayCash(false)} />
            )}

            {showRecoverySummary && (
                <RecoverySummary onClose={() => setShowRecoverySummary(false)} />
            )}

            {showPayCash && (
                <PayCash onClose={() => setShowPayCash(false)} />
            )}
        </div>
    );
    // </div>
//   );
};

export default FutureModalsPage;
