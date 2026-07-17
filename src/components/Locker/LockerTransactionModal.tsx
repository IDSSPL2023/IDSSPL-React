import { useState } from "react";
import { toast } from "react-toastify";
import { Hash, User, Calendar, Percent, IndianRupee, CreditCard, MoreVertical } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import type { LockerRow } from "./LockerTable";

interface TransactionFormData {
  nameOfHire: string;
  rentPaidTillDate: string;
  period: string;
  reviewDate: string;
  rentFromDate: string;
  rentToDate: string;
  completedPeriodInMonths: string;
  lockerRentPerMonth: string;
  lockerRentDue: string;
  serviceTax: string;
  amount: string;
  closingBalance: string;

  transactionMode: "Cash" | "Transfer";
  transactionDate: string;
  debitAcCode: string;
  name: string;
  transferByCheque: boolean;
  chequeType: string;
  chequeSeries: string;
  chequeNo: string;
  chequeDate: string;
}

type PickRow = { code: string; name: string };

const DEBIT_AC_LIST: PickRow[] = [
  { code: "000245", name: "Devaraddi Mallanagoud" },
  { code: "000246", name: "Akshay Om More" },
  { code: "000247", name: "Priya Sharma" },
];
const CHEQUE_TYPE_LIST: PickRow[] = [
  { code: "CHQ1", name: "Local Cheque" },
  { code: "CHQ2", name: "Outstation Cheque" },
];

const buildInitialData = (row: LockerRow): TransactionFormData => ({
  nameOfHire: row.accountName,
  rentPaidTillDate: "",
  period: "12",
  reviewDate: "12-May-2026",
  rentFromDate: "2026-05-12",
  rentToDate: "2026-05-12",
  completedPeriodInMonths: "158",
  lockerRentPerMonth: "0",
  lockerRentDue: "",
  serviceTax: "0.0%",
  amount: "12,349",
  closingBalance: "0.0%",

  transactionMode: "Transfer",
  transactionDate: "12-May-2026",
  debitAcCode: "",
  name: "",
  transferByCheque: true,
  chequeType: "",
  chequeSeries: "",
  chequeNo: "",
  chequeDate: "",
});

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const RadioTransactionMode = ({ value, onChange }: { value: "Cash" | "Transfer"; onChange: (v: "Cash" | "Transfer") => void }) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Transaction Mode <span className="text-slate-600">/ आर्थिक व्यवहार मोड</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Cash", "Transfer"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const RadioTransferByCheque = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div className="last:mb-0 flex items-center gap-2">
    <label className="large block text-sm font-medium text-[#1F2858]">
      Transfer by Cheque <span className="text-slate-600">/ आर्थिक व्यवहार मोड</span>
    </label>
    <div className="flex items-center gap-4 pt-1">
      {(["Yes", "No"] as const).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="radio" checked={(opt === "Yes") === value} onChange={() => onChange(opt === "Yes")} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export interface LockerTransactionModalProps {
  row: LockerRow;
  onClose: () => void;
  onSave?: (data: TransactionFormData) => void;
}

const LockerTransactionModal = ({ row, onClose, onSave }: LockerTransactionModalProps) => {
  const [form, setForm] = useState<TransactionFormData>(() => buildInitialData(row));
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePicker, setActivePicker] = useState<"debitAcCode" | "chequeType" | null>(null);

  const updateField = <K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsValidated(false);
  };

  const handlePickRow = (picked: PickRow) => {
    if (activePicker === "debitAcCode") {
      updateField("debitAcCode", picked.code);
      updateField("name", picked.name);
    } else if (activePicker === "chequeType") {
      updateField("chequeType", picked.name);
    }
    setActivePicker(null);
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<keyof TransactionFormData, boolean>> = {
      debitAcCode: form.debitAcCode.trim() === "",
    };
    if (form.transferByCheque) {
      newErrors.chequeType = form.chequeType.trim() === "";
    }
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) toast.error("Please fill all required fields before validating.");
    else toast.success("All fields validated successfully.");
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handlePlaceholderAction = (label: string) => toast.info(`${label} will be implemented.`);

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
        title="Locker Transaction Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  const disabledBtnClass = "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400";
  const enabledOutlineClass = "border border-primary-500 bg-white text-primary hover:bg-primary-50";

  return (
    <FormModal
      onClose={onClose}
      titleEn="Locker Transaction"
      titleHi="लॉकर व्यवहार"
      subtitleEn="All Information's are related to Interest Payment Mark"
      subtitleHi="सर्व माहिती व्याज भरण्याच्या मार्कशी संबंधित आहे"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      maxWidth="max-w-6xl"
      customFooter={
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Signature")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Signature
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Photo")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Photo
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={() => handlePlaceholderAction("Display Voucher")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isValidated ? enabledOutlineClass : disabledBtnClass}`}
          >
            Display Voucher
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValidated}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isValidated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel
          </button>
        </div>
      }
    >
      <SectionCard titleEn="Account Details" titleHi="आकाउंट तपशील" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FieldShell label="Name of hire" labelHi="खाते नाव">
            <TextInput icon={<User size={16} />} value={form.nameOfHire} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Rent Paid Till Date">
            <TextInput icon={<Calendar size={16} />} value={form.rentPaidTillDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Period">
            <TextInput icon={<Hash size={16} />} value={form.period} onChange={(v) => updateField("period", v)} />
          </FieldShell>
          <FieldShell label="Review Date">
            <TextInput icon={<Calendar size={16} />} value={form.reviewDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Rent from Date">
            <DateInput value={form.rentFromDate} onChange={(v) => updateField("rentFromDate", v)} />
          </FieldShell>
          <FieldShell label="Rent To Date">
            <DateInput value={form.rentToDate} onChange={(v) => updateField("rentToDate", v)} />
          </FieldShell>
          <FieldShell label="Completed Period in Months">
            <TextInput icon={<Hash size={16} />} value={form.completedPeriodInMonths} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Locker Rent/Month">
            <TextInput icon={<IndianRupee size={16} />} value={form.lockerRentPerMonth} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Locker Rent Due">
            <TextInput icon={<IndianRupee size={16} />} value={form.lockerRentDue} onChange={() => {}} placeholder="Rent" readOnly />
          </FieldShell>
          <FieldShell label="Service Tax">
            <TextInput icon={<Percent size={16} />} value={form.serviceTax} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Amount">
            <TextInput icon={<IndianRupee size={16} />} value={form.amount} onChange={(v) => updateField("amount", v)} />
          </FieldShell>
          <FieldShell label="Closing Balance">
            <TextInput icon={<Percent size={16} />} value={form.closingBalance} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="Transaction Mode" titleHi="आर्थिक व्यवहार मोड" subtitleEn="Manage customer's personal and identity information." icon={<SectionIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-end pb-2.5">
            <RadioTransactionMode value={form.transactionMode} onChange={(v) => updateField("transactionMode", v)} />
          </div>
          <FieldShell label="Transaction Date">
            <TextInput icon={<Calendar size={16} />} value={form.transactionDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Debit A/C Code" required error={errors.debitAcCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<CreditCard size={16} />} value={form.debitAcCode} onChange={(v) => updateField("debitAcCode", v)} error={errors.debitAcCode} />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("debitAcCode")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
              >
                <MoreVertical size={18} strokeWidth={2.4} />
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Name">
            <TextInput icon={<User size={16} />} value={form.name} onChange={() => {}} readOnly />
          </FieldShell>

          <div className="flex items-end pb-2.5">
            <RadioTransferByCheque value={form.transferByCheque} onChange={(v) => updateField("transferByCheque", v)} />
          </div>
          <FieldShell label="Cheque Type" required={form.transferByCheque} error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput icon={<CreditCard size={16} />} value={form.chequeType} onChange={(v) => updateField("chequeType", v)} placeholder="Cheque" error={errors.chequeType} />
              </div>
              <button
                type="button"
                onClick={() => setActivePicker("chequeType")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
              >
                <MoreVertical size={18} strokeWidth={2.4} />
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Cheque Series">
            <TextInput icon={<Hash size={16} />} value={form.chequeSeries} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Cheque No">
            <TextInput icon={<Hash size={16} />} value={form.chequeNo} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Cheque Date">
            <TextInput icon={<Calendar size={16} />} value={form.chequeDate} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      {activePicker && (
        <ListModal
          title={activePicker === "debitAcCode" ? "Debit Account List" : "Cheque Type List"}
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
          ]}
          rows={activePicker === "debitAcCode" ? DEBIT_AC_LIST : CHEQUE_TYPE_LIST}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default LockerTransactionModal;
