import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  MoreVertical,
  Check,
  X,
  ChevronDown,
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

const DISBURSE_BY_OPTIONS = ["Transfer", "Cash", "Cheque"];
const GL_OUTLIST_DESCRIPTIONS = [
  "Term Loan Disbursement Outlist",
  "Savings Disbursement Outlist",
  "Overdraft Disbursement Outlist",
];
const O_AND_R_OPTIONS = ["O", "R"];

type AccountPickRow = { code: string; name: string };

/** Same pick-list shape as Account Master's account lookup (Account Type + Name). */
const ACCOUNT_PICK_LIST: AccountPickRow[] = [
  { code: "00025050002501", name: "DEVARADDI MALLANAGOUD" },
  { code: "00021010000163", name: "MATURED JEEVAN SIRI DEPOSIT" },
  { code: "00099010000045", name: "TERM LOAN DISBURSEMENT GL" },
  { code: "00034020001122", name: "SURESH PATIL KULKARNI" },
  { code: "00045030002233", name: "ANITA RAMESH DESHMUKH" },
];

type PickerField = "accountCode" | "transferAcCode" | "glAccountCode";

const PICKER_CONFIG: Record<PickerField, { title: string; codeField: keyof TransactionMasterFormData; nameField: keyof TransactionMasterFormData }> = {
  accountCode: { title: "Account Type List", codeField: "accountCode", nameField: "accountName" },
  transferAcCode: { title: "Transfer A/c List", codeField: "transferAcCode", nameField: "transferAcName" },
  glAccountCode: { title: "GL Account List", codeField: "glAccountCode", nameField: "glAccountName" },
};

export interface TransactionMasterFormData {
  accountType: string;
  accountCode: string;
  accountName: string;
  scrollNumber: string;
  reviewDate: string;
  totalInstallment: string;
  ledgerBalance: string;
  availableBalance: string;
  limitAmount: string;
  drawingPower: string;
  loanDisbursed: string;
  disburseBy: string;
  transferAcCode: string;
  transferAcName: string;
  glAccountCode: string;
  glAccountName: string;
  txnLedgerBalance: string;
  txnAvailableBalance: string;
  newLedgerBalance: string;
  glOutlistNo: string;
  glOutlistDescription: string;
  outlistDocNo: string;
  amount: string;
  adviceNumber: string;
  adviceDate: string;
  particular: string;
  oAndR: string;
}

/** Reusable dummy data — used to prefill the form on open. */
export const DEFAULT_TRANSACTION_MASTER_DATA: TransactionMasterFormData = {
  accountType: "TL",
  accountCode: "00025050002501",
  accountName: "DEVARADDI MALLANAGOUD",
  scrollNumber: "SCR-458712",
  reviewDate: "2026-01-15",
  totalInstallment: "36",
  ledgerBalance: "150000",
  availableBalance: "150000",
  limitAmount: "200000",
  drawingPower: "180000",
  loanDisbursed: "50000",
  disburseBy: "Transfer",
  transferAcCode: "00021010000163",
  transferAcName: "MATURED JEEVAN SIRI DEPOSIT",
  glAccountCode: "00099010000045",
  glAccountName: "TERM LOAN DISBURSEMENT GL",
  txnLedgerBalance: "150000",
  txnAvailableBalance: "150000",
  newLedgerBalance: "200000",
  glOutlistNo: "OUT-2026-0458",
  glOutlistDescription: "Term Loan Disbursement Outlist",
  outlistDocNo: "DOC-778812",
  amount: "10000",
  adviceNumber: "ADV-33021",
  adviceDate: "2026-01-15",
  particular: "By Cash",
  oAndR: "O",
};

/** Same validation approach used by Customer Master's sibling forms (AddSI). */
const validateTransactionMaster = (
  data: TransactionMasterFormData
): Record<keyof TransactionMasterFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  return {
    accountType: isEmpty(data.accountType),
    accountCode: isEmpty(data.accountCode),
    accountName: isEmpty(data.accountName),
    scrollNumber: isEmpty(data.scrollNumber),
    reviewDate: isEmpty(data.reviewDate),
    totalInstallment: isEmpty(data.totalInstallment),
    ledgerBalance: isEmpty(data.ledgerBalance),
    availableBalance: isEmpty(data.availableBalance),
    limitAmount: isEmpty(data.limitAmount),
    drawingPower: isEmpty(data.drawingPower),
    loanDisbursed: isEmpty(data.loanDisbursed),
    disburseBy: isEmpty(data.disburseBy),
    transferAcCode: isEmpty(data.transferAcCode),
    transferAcName: isEmpty(data.transferAcName),
    glAccountCode: isEmpty(data.glAccountCode),
    glAccountName: isEmpty(data.glAccountName),
    txnLedgerBalance: isEmpty(data.txnLedgerBalance),
    txnAvailableBalance: isEmpty(data.txnAvailableBalance),
    newLedgerBalance: isEmpty(data.newLedgerBalance),
    glOutlistNo: isEmpty(data.glOutlistNo),
    glOutlistDescription: isEmpty(data.glOutlistDescription),
    outlistDocNo: isEmpty(data.outlistDocNo),
    amount: isEmpty(data.amount),
    adviceNumber: isEmpty(data.adviceNumber),
    adviceDate: isEmpty(data.adviceDate),
    particular: isEmpty(data.particular),
    oAndR: isEmpty(data.oAndR),
  };
};

/** Simulated save — no backend yet. */
const saveTransactionMaster = (data: TransactionMasterFormData) =>
  new Promise<TransactionMasterFormData>((resolve) =>
    setTimeout(() => resolve(data), 600)
  );

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-[#EEF4FF] dark:bg-slate-800 text-primary transition hover:bg-[#DDEAFF] dark:hover:bg-slate-700"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

export interface AddTransactionMasterProps {
  onClose: () => void;
  onSave?: (data: TransactionMasterFormData) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const AddTransactionMaster = ({ onClose, onSave, variant = "modal" }: AddTransactionMasterProps) => {
  const [form, setForm] = useState<TransactionMasterFormData>(
    DEFAULT_TRANSACTION_MASTER_DATA
  );
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionMasterFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handlePickAccount = (row: AccountPickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    markDirty(nameField);
    setForm((f) => ({ ...f, [codeField]: row.code, [nameField]: row.name }));
    setActivePicker(null);
  };

  const markDirty = (field: keyof TransactionMasterFormData) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof TransactionMasterFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleValidate = () => {
    const newErrors = validateTransactionMaster(form);
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
    await saveTransactionMaster(form);
    setIsSaving(false);
    setShowSuccess(true);
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
        title="Transaction Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="TL Disbursement"
      titleHi="मुदत कर्ज वितरण"
      subtitleEn="Fill in the details below to create a new parameter."
      subtitleHi="नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा."
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
      variant={variant}
    >
      <SectionCard
        titleEn="Account Details"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required error={errors.accountType}>
            <TextInput icon={<User size={16} />} value={form.accountType} onChange={() => {}} readOnly error={errors.accountType} />
          </FieldShell>

          <FieldShell label="Account Code" labelHi="खाते कोड" required error={errors.accountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.accountCode}
                  onChange={(v) => updateField("accountCode", v)}
                  placeholder="Enter Account Code"
                  error={errors.accountCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("accountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={errors.accountName}>
            <TextInput icon={<User size={16} />} value={form.accountName} onChange={() => {}} readOnly error={errors.accountName} />
          </FieldShell>

          <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={errors.scrollNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.scrollNumber}
              onChange={(v) => updateField("scrollNumber", v)}
              placeholder="Enter Scroll Number"
              error={errors.scrollNumber}
            />
          </FieldShell>

          <FieldShell label="Review Date" labelHi="ठेव रक्कम" required error={errors.reviewDate}>
            <DateInput value={form.reviewDate} onChange={(v) => updateField("reviewDate", v)} error={errors.reviewDate} />
          </FieldShell>

          <FieldShell label="Total Installment" labelHi="एकूण हप्ता" required error={errors.totalInstallment}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.totalInstallment}
              onChange={(v) => updateField("totalInstallment", v)}
              placeholder="Enter Total Installment"
              error={errors.totalInstallment}
            />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.ledgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.ledgerBalance}
              onChange={(v) => updateField("ledgerBalance", v)}
              placeholder="Enter Ledger Balance"
              error={errors.ledgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.availableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.availableBalance}
              onChange={(v) => updateField("availableBalance", v)}
              placeholder="Enter Available Balance"
              error={errors.availableBalance}
            />
          </FieldShell>

          <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required error={errors.limitAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.limitAmount}
              onChange={(v) => updateField("limitAmount", v)}
              placeholder="Enter Limit Amount"
              error={errors.limitAmount}
            />
          </FieldShell>

          <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required error={errors.drawingPower}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.drawingPower}
              onChange={(v) => updateField("drawingPower", v)}
              placeholder="Enter Drawing Power"
              error={errors.drawingPower}
            />
          </FieldShell>

          <FieldShell label="Loan Disbursed" labelHi="वितरित केलेले कर्ज" required error={errors.loanDisbursed}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.loanDisbursed}
              onChange={(v) => updateField("loanDisbursed", v)}
              placeholder="Enter Loan Disbursed"
              error={errors.loanDisbursed}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Transaction Details"
        titleHi="व्यवहाराचा तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<SectionIcon />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Disburse By" labelHi="याद्वारे वितरित करा" required error={errors.disburseBy}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={form.disburseBy}
              onChange={(v) => updateField("disburseBy", v)}
              options={DISBURSE_BY_OPTIONS}
              placeholder="Select Disburse By"
              error={errors.disburseBy}
            />
          </FieldShell>

          <FieldShell label="Transfer A/c Code" labelHi="बदली खाते कोड" required error={errors.transferAcCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.transferAcCode}
                  onChange={(v) => updateField("transferAcCode", v)}
                  placeholder="Enter Transfer A/c Code"
                  error={errors.transferAcCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("transferAcCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Transfer A/c Name" labelHi="बदली खाते नाव" required error={errors.transferAcName}>
            <TextInput icon={<User size={16} />} value={form.transferAcName} onChange={() => {}} readOnly error={errors.transferAcName} />
          </FieldShell>

          <FieldShell label="GL Account Code" labelHi="ठेव कालावधी" required error={errors.glAccountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.glAccountCode}
                  onChange={(v) => updateField("glAccountCode", v)}
                  placeholder="Enter GL Account Code"
                  error={errors.glAccountCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("glAccountCode")} />
            </div>
          </FieldShell>

          <FieldShell label="GL Account Name" labelHi="स्क्रोल क्रमांक" required error={errors.glAccountName}>
            <TextInput icon={<User size={16} />} value={form.glAccountName} onChange={() => {}} readOnly error={errors.glAccountName} />
          </FieldShell>

          <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required error={errors.txnLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.txnLedgerBalance}
              onChange={(v) => updateField("txnLedgerBalance", v)}
              placeholder="Enter Ledger Balance"
              error={errors.txnLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.txnAvailableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.txnAvailableBalance}
              onChange={(v) => updateField("txnAvailableBalance", v)}
              placeholder="Enter Available Balance"
              error={errors.txnAvailableBalance}
            />
          </FieldShell>

          <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required error={errors.newLedgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.newLedgerBalance}
              onChange={(v) => updateField("newLedgerBalance", v)}
              placeholder="Enter New Ledger Balance"
              error={errors.newLedgerBalance}
            />
          </FieldShell>

          <FieldShell label="GL Outlist No." labelHi="जीएल आऊटलिस्ट क्रमांक" required error={errors.glOutlistNo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glOutlistNo}
              onChange={(v) => updateField("glOutlistNo", v)}
              placeholder="Enter GL Outlist No."
              error={errors.glOutlistNo}
            />
          </FieldShell>

          <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required error={errors.glOutlistDescription}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.glOutlistDescription}
              onChange={(v) => updateField("glOutlistDescription", v)}
              options={GL_OUTLIST_DESCRIPTIONS}
              placeholder="Select GL Outlist Description"
              error={errors.glOutlistDescription}
            />
          </FieldShell>

          <FieldShell label="Outlist Doc No." labelHi="आऊटलिस्ट दस्तऐवज क्रमांक" required error={errors.outlistDocNo}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.outlistDocNo}
              onChange={(v) => updateField("outlistDocNo", v)}
              placeholder="Enter Outlist Doc No."
              error={errors.outlistDocNo}
            />
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

          <FieldShell label="Advice Number" labelHi="लिंग" required error={errors.adviceNumber}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.adviceNumber}
              onChange={(v) => updateField("adviceNumber", v)}
              placeholder="Enter Advice Number"
              error={errors.adviceNumber}
            />
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="लिंग" required error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={(v) => updateField("adviceDate", v)} error={errors.adviceDate} />
          </FieldShell>

          <FieldShell label="Particular" labelHi="तपशील" required error={errors.particular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.particular}
              onChange={(v) => updateField("particular", v)}
              placeholder="Enter Particular"
              error={errors.particular}
            />
          </FieldShell>

          <FieldShell label="O & R" labelHi="लिंग" required error={errors.oAndR}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.oAndR}
              onChange={(v) => updateField("oAndR", v)}
              options={O_AND_R_OPTIONS}
              placeholder="Select O & R"
              error={errors.oAndR}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Validate <Check size={16} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
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
              : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
        </button>
      </div>

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: "Account Type" },
            { key: "name", label: "Name" },
          ]}
          rows={ACCOUNT_PICK_LIST}
          onSelect={handlePickAccount}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddTransactionMaster;
