import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Image from "@/components/ui/Image";
import { User, Hash, IndianRupee, CreditCard, Check, X, ChevronsDown } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import {
  DenominationTable,
  emptyDenominationRows,
  sumDenominationColumn,
} from "@/components/shared/DenominationTable";

const DENOMINATION_COLUMNS = [
  { key: "received", label: "Received" },
  { key: "paid", label: "Paid" },
];

export interface PayCashFormData {
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
export const DEFAULT_PAY_CASH_DATA: PayCashFormData = {
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
const savePayCash = (data: PayCashFormData) =>
  new Promise<PayCashFormData>((resolve) => setTimeout(() => resolve(data), 600));

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export interface PayCashProps {
  onClose: () => void;
  onSave?: (data: PayCashFormData) => void;
  variant?: "modal" | "page";
}

const PayCash = ({ onClose, onSave, variant = "modal" }: PayCashProps) => {
  const [form, setForm] = useState<PayCashFormData>(DEFAULT_PAY_CASH_DATA);
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
    await savePayCash(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_PAY_CASH_DATA);
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
      headerIcon={<Image src="/person icon.png" alt="Pay Cash" width={50} height={50} />}
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
        columns={DENOMINATION_COLUMNS}
        rows={form.denominations}
        onChange={updateDenomination}
        totals={{ received: String(totals.totalReceived), paid: String(totals.totalPaid) }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary-50 px-5 py-3.5 text-sm">
        <p className="font-medium text-primary">Denomination Amount</p>
        <div>
          <p className="text-primary">Amount</p>
          <p className="text-lg font-bold text-slate-800">{formatAmount(totals.denominationAmount)}</p>
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

export default PayCash;
