import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Hash,
  CreditCard,
  IndianRupee,
  FileText,
  MoreVertical,
  Check,
  ChevronDown,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

const MODE_OF_PAYMENT_OPTIONS = ["Cash", "Cheque", "NEFT", "RTGS", "Transfer"];

type AccountPickRow = {
  code: string;
  name: string;
  glAccountCode: string;
  glAccountName: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
};

const ACCOUNT_LIST: AccountPickRow[] = [
  {
    code: "AC-1001",
    name: "Rahul Sharma",
    glAccountCode: "GL-SH-01",
    glAccountName: "Share Capital - Members",
    ledgerBalance: "125000",
    availableBalance: "125000",
    newLedgerBalance: "125000",
  },
  {
    code: "AC-1002",
    name: "Priya Singh",
    glAccountCode: "GL-SH-01",
    glAccountName: "Share Capital - Members",
    ledgerBalance: "84000",
    availableBalance: "84000",
    newLedgerBalance: "84000",
  },
];

type TransferAccountPickRow = { code: string; name: string };

const TRANSFER_ACCOUNT_LIST: TransferAccountPickRow[] = [
  { code: "TA-501", name: "Cash Account" },
  { code: "TA-502", name: "Bank - HDFC Current" },
  { code: "TA-503", name: "Bank - SBI Current" },
];

export interface AccountInfoData {
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  glAccountName: string;
  ledgerBalance: string;
  availableBalance: string;
  newLedgerBalance: string;
}

export interface PaymentRow {
  id: number;
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  amount: string;
  particular: string;
}

export interface TransactionDetailsData {
  noOfShares: string;
  faceValue: string;
  amount: string;
  meetingDate: string;
  particular: string;
}

export interface ShareAllotmentFormData {
  accountInfo: AccountInfoData;
  paymentRows: PaymentRow[];
  transactionDetails: TransactionDetailsData;
}

const DEFAULT_ACCOUNT_INFO: AccountInfoData = {
  accountCode: "",
  accountName: "",
  glAccountCode: "",
  glAccountName: "",
  ledgerBalance: "",
  availableBalance: "",
  newLedgerBalance: "",
};

const emptyPaymentRow = (id: number): PaymentRow => ({
  id,
  modeOfPayment: "",
  transferAcCode: "",
  transferAcName: "",
  amount: "",
  particular: "",
});

const DEFAULT_TRANSACTION_DETAILS: TransactionDetailsData = {
  noOfShares: "",
  faceValue: "",
  amount: "",
  meetingDate: "",
  particular: "",
};

const ACCOUNT_INFO_REQUIRED_KEYS: (keyof AccountInfoData)[] = [
  "accountCode",
  "accountName",
  "glAccountCode",
  "glAccountName",
  "ledgerBalance",
  "availableBalance",
  "newLedgerBalance",
];

const PAYMENT_ROW_REQUIRED_KEYS: (keyof Omit<PaymentRow, "id">)[] = [
  "modeOfPayment",
  "transferAcCode",
  "transferAcName",
  "amount",
  "particular",
];

const TRANSACTION_DETAILS_REQUIRED_KEYS: (keyof TransactionDetailsData)[] = [
  "noOfShares",
  "faceValue",
  "amount",
  "meetingDate",
  "particular",
];

/** Simulated save — no backend yet. */
const saveShareAllotment = (data: ShareAllotmentFormData) =>
  new Promise<ShareAllotmentFormData>((resolve) => setTimeout(() => resolve(data), 600));

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

const AddRowButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
  >
    <Plus size={16} /> Add
  </button>
);

export interface AddShareAllotmentProps {
  onClose: () => void;
  onSave?: (data: ShareAllotmentFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddShareAllotment = ({ onClose, onSave, variant = "modal" }: AddShareAllotmentProps) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoData>(DEFAULT_ACCOUNT_INFO);
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([emptyPaymentRow(1)]);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsData>(DEFAULT_TRANSACTION_DETAILS);

  const [accountInfoErrors, setAccountInfoErrors] = useState<Partial<Record<keyof AccountInfoData, boolean>>>({});
  const [paymentRowErrors, setPaymentRowErrors] = useState<Record<string, boolean>>({});
  const [transactionDetailsErrors, setTransactionDetailsErrors] = useState<Partial<Record<keyof TransactionDetailsData, boolean>>>({});

  const [isValidated, setIsValidated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<"accountCode" | { row: number } | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handlePlaceholderAction = (label: string) => {
    toast.info(`${label} will be implemented.`);
  };

  const markDirty = () => {
    setIsValidated(false);
    setIsSaved(false);
  };

  const updateAccountInfo = (field: keyof AccountInfoData, value: string) => {
    markDirty();
    setAccountInfoErrors((e) => (e[field] ? { ...e, [field]: false } : e));
    setAccountInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updatePaymentRow = (index: number, patch: Partial<PaymentRow>) => {
    markDirty();
    setPaymentRowErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((key) => delete next[`${index}-${key}`]);
      return next;
    });
    setPaymentRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removePaymentRow = (index: number) => {
    markDirty();
    setPaymentRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTransactionDetails = (field: keyof TransactionDetailsData, value: string) => {
    markDirty();
    setTransactionDetailsErrors((e) => (e[field] ? { ...e, [field]: false } : e));
    setTransactionDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickAccount = (row: AccountPickRow) => {
    markDirty();
    setAccountInfoErrors({});
    setAccountInfo({
      accountCode: row.code,
      accountName: row.name,
      glAccountCode: row.glAccountCode,
      glAccountName: row.glAccountName,
      ledgerBalance: row.ledgerBalance,
      availableBalance: row.availableBalance,
      newLedgerBalance: row.newLedgerBalance,
    });
    setActivePicker(null);
  };

  const handlePickTransferAccount = (row: TransferAccountPickRow) => {
    if (!activePicker || activePicker === "accountCode") return;
    const index = activePicker.row;
    updatePaymentRow(index, { transferAcCode: row.code, transferAcName: row.name });
    setActivePicker(null);
  };

  const validate = () => {
    const nextAccountInfoErrors = {} as Record<keyof AccountInfoData, boolean>;
    ACCOUNT_INFO_REQUIRED_KEYS.forEach((key) => {
      nextAccountInfoErrors[key] = accountInfo[key].trim() === "";
    });

    const nextPaymentRowErrors: Record<string, boolean> = {};
    paymentRows.forEach((row, i) => {
      PAYMENT_ROW_REQUIRED_KEYS.forEach((key) => {
        nextPaymentRowErrors[`${i}-${key}`] = row[key].trim() === "";
      });
    });

    const nextTransactionDetailsErrors = {} as Record<keyof TransactionDetailsData, boolean>;
    TRANSACTION_DETAILS_REQUIRED_KEYS.forEach((key) => {
      nextTransactionDetailsErrors[key] = transactionDetails[key].trim() === "";
    });

    setAccountInfoErrors(nextAccountInfoErrors);
    setPaymentRowErrors(nextPaymentRowErrors);
    setTransactionDetailsErrors(nextTransactionDetailsErrors);

    const hasErrors =
      Object.values(nextAccountInfoErrors).some(Boolean) ||
      Object.values(nextPaymentRowErrors).some(Boolean) ||
      Object.values(nextTransactionDetailsErrors).some(Boolean);

    return !hasErrors;
  };

  const handleValidate = () => {
    const valid = validate();
    setIsValidated(valid);
    if (valid) {
      toast.success("All fields validated successfully.");
    } else {
      toast.error("Please fill all required fields before validating.");
    }
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveShareAllotment({ accountInfo, paymentRows, transactionDetails });
    setIsSaving(false);
    setIsSaved(true);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setAccountInfo(DEFAULT_ACCOUNT_INFO);
    setPaymentRows([emptyPaymentRow(1)]);
    setTransactionDetails(DEFAULT_TRANSACTION_DETAILS);
    setAccountInfoErrors({});
    setPaymentRowErrors({});
    setTransactionDetailsErrors({});
    setIsValidated(false);
    setIsSaved(false);
    onClose();
  };

  const handleSuccessDone = () => {
    onSave?.({ accountInfo, paymentRows, transactionDetails });
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Share Allotment Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Share Allotment"
      titleHi="भाग वितरण"
      subtitleEn="Configure earning and deduction components used for payroll calculation and salary processing."
      subtitleHi="वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा."
      headerIcon={<SectionIcon />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Account Info"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Account Code" labelHi="खाते कोड" required error={accountInfoErrors.accountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={accountInfo.accountCode}
                  onChange={(v) => updateAccountInfo("accountCode", v)}
                  placeholder="Select Account Code"
                  error={accountInfoErrors.accountCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={accountInfoErrors.accountName}>
            <TextInput icon={<User size={16} />} value={accountInfo.accountName} onChange={() => {}} placeholder="Account Name" readOnly error={accountInfoErrors.accountName} />
          </FieldShell>

          <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required error={accountInfoErrors.glAccountCode}>
            <TextInput icon={<CreditCard size={16} />} value={accountInfo.glAccountCode} onChange={() => {}} placeholder="GL Account Code" readOnly error={accountInfoErrors.glAccountCode} />
          </FieldShell>

          <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required error={accountInfoErrors.glAccountName}>
            <TextInput icon={<User size={16} />} value={accountInfo.glAccountName} onChange={() => {}} placeholder="GL Account Name" readOnly error={accountInfoErrors.glAccountName} />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required error={accountInfoErrors.ledgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={accountInfo.ledgerBalance} onChange={() => {}} placeholder="Ledger Balance" readOnly error={accountInfoErrors.ledgerBalance} />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={accountInfoErrors.availableBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={accountInfo.availableBalance} onChange={() => {}} placeholder="Available Balance" readOnly error={accountInfoErrors.availableBalance} />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required error={accountInfoErrors.newLedgerBalance}>
            <TextInput icon={<IndianRupee size={16} />} value={accountInfo.newLedgerBalance} onChange={() => {}} placeholder="New Ledger Balance" readOnly error={accountInfoErrors.newLedgerBalance} />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment Details"
        titleHi="पेमेंट तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
        headerAction={<AddRowButton onClick={() => setPaymentRows((prev) => [...prev, emptyPaymentRow(prev.length + 1)])} />}
      >
        {paymentRows.map((row, i) => (
          <div key={row.id} className={`rounded-xl border border-dashed border-primary-200 bg-primary-50/30 p-4 ${i > 0 ? "mt-4" : ""}`}>
            {paymentRows.length > 1 && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1F2858]">Payment {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removePaymentRow(i)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
            <div className={grid4}>
              <FieldShell label="Mode of Payment" labelHi="पेमेंट पद्धत" required error={paymentRowErrors[`${i}-modeOfPayment`]}>
                <SelectInput
                  icon={<CreditCard size={16} />}
                  value={row.modeOfPayment}
                  onChange={(v) => updatePaymentRow(i, { modeOfPayment: v })}
                  options={MODE_OF_PAYMENT_OPTIONS}
                  placeholder="Select Mode of Payment"
                  error={paymentRowErrors[`${i}-modeOfPayment`]}
                />
              </FieldShell>

              <FieldShell label="Transfer A/c Code" labelHi="खाते कोड" required error={paymentRowErrors[`${i}-transferAcCode`]}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput
                      icon={<Hash size={16} />}
                      value={row.transferAcCode}
                      onChange={(v) => updatePaymentRow(i, { transferAcCode: v })}
                      placeholder="Select Transfer A/c Code"
                      error={paymentRowErrors[`${i}-transferAcCode`]}
                    />
                  </div>
                  <LookupTrigger onClick={() => setActivePicker({ row: i })} />
                </div>
              </FieldShell>

              <FieldShell label="Transfer A/c Name" labelHi="खात्याचे नाव" required error={paymentRowErrors[`${i}-transferAcName`]}>
                <TextInput icon={<User size={16} />} value={row.transferAcName} onChange={() => {}} placeholder="Transfer A/c Name" readOnly error={paymentRowErrors[`${i}-transferAcName`]} />
              </FieldShell>

              <FieldShell label="Amount" labelHi="रक्कम" required error={paymentRowErrors[`${i}-amount`]}>
                <TextInput
                  icon={<IndianRupee size={16} />}
                  value={row.amount}
                  onChange={(v) => updatePaymentRow(i, { amount: v })}
                  placeholder="Enter Amount"
                  error={paymentRowErrors[`${i}-amount`]}
                />
              </FieldShell>

              <FieldShell label="Particular" labelHi="तपशील" required error={paymentRowErrors[`${i}-particular`]} className="lg:col-span-4">
                <TextInput
                  icon={<FileText size={16} />}
                  value={row.particular}
                  onChange={(v) => updatePaymentRow(i, { particular: v })}
                  placeholder="By Cash"
                  error={paymentRowErrors[`${i}-particular`]}
                />
              </FieldShell>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        titleEn="Transaction Details"
        titleHi="व्यवहार तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="No. Of Shares" labelHi="शेअर्सची संख्या" required error={transactionDetailsErrors.noOfShares}>
            <TextInput
              icon={<Hash size={16} />}
              value={transactionDetails.noOfShares}
              onChange={(v) => updateTransactionDetails("noOfShares", v)}
              placeholder="Enter No. of Shares"
              type="number"
              error={transactionDetailsErrors.noOfShares}
            />
          </FieldShell>

          <FieldShell label="Face Value" labelHi="दर्शनी मूल्य" required error={transactionDetailsErrors.faceValue}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={transactionDetails.faceValue}
              onChange={(v) => updateTransactionDetails("faceValue", v)}
              placeholder="Enter Face Value"
              error={transactionDetailsErrors.faceValue}
            />
          </FieldShell>

          <FieldShell label="Amount" labelHi="रक्कम" required error={transactionDetailsErrors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={transactionDetails.amount}
              onChange={(v) => updateTransactionDetails("amount", v)}
              placeholder="Enter Amount"
              error={transactionDetailsErrors.amount}
            />
          </FieldShell>

          <FieldShell label="Meeting Date" labelHi="सभेची तारीख" required error={transactionDetailsErrors.meetingDate}>
            <DateInput
              value={transactionDetails.meetingDate}
              onChange={(v) => updateTransactionDetails("meetingDate", v)}
              error={transactionDetailsErrors.meetingDate}
            />
          </FieldShell>

          <FieldShell label="Particular" labelHi="तपशील" required error={transactionDetailsErrors.particular} className="lg:col-span-4">
            <TextInput
              icon={<FileText size={16} />}
              value={transactionDetails.particular}
              onChange={(v) => updateTransactionDetails("particular", v)}
              placeholder="By Cash"
              error={transactionDetailsErrors.particular}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate <Check size={16} />
        </button>

        <button
          type="button"
          onClick={() => handlePlaceholderAction("Display Vouchers")}
          disabled={!isSaved}
          className={`flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors ${
            isSaved ? "hover:bg-slate-50" : "cursor-not-allowed opacity-60"
          }`}
        >
          Display Vouchers <ChevronDown size={16} />
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => (isValidated && !isSaving ? setSaveMenuOpen((o) => !o) : undefined)}
            disabled={!isValidated || isSaving}
            className={`flex items-center gap-1.5 rounded-lg border border-transparent bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors ${
              isValidated && !isSaving ? "hover:bg-primary-200" : "cursor-not-allowed opacity-60"
            }`}
          >
            {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
          </button>
          {saveMenuOpen && (
            <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setSaveMenuOpen(false);
                  handleSave();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveMenuOpen(false);
                  handleSave();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
              >
                Save & New
              </button>
            </div>
          )}
        </div>
      </div>

      {activePicker === "accountCode" && (
        <ListModal
          title="Account List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Name" },
          ]}
          rows={ACCOUNT_LIST}
          onSelect={handlePickAccount}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker !== null && activePicker !== "accountCode" && (
        <ListModal
          title="Transfer Account List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Name" },
          ]}
          rows={TRANSFER_ACCOUNT_LIST}
          onSelect={handlePickTransferAccount}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddShareAllotment;
