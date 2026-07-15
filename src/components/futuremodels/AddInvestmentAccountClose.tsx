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
  ChevronDown,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
  RadioYesNo,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

const PAYMENT_MODE_OPTIONS = ["Cash", "Transfer"];
const ACCOUNT_CLOSE_OPTIONS = ["Yes", "No"];
const TRANSFER_BY_CHEQUE_OPTIONS = ["Yes", "No"];

const ACCOUNT_CODE_ROWS = [
  { code: "401", name: "Sample Account" },
  { code: "402", name: "Current Account" },
  { code: "403", name: "Savings Account" },
];

const PRINCIPAL_ACCOUNT_ROWS = [
  { code: "401", name: "Sample Customer" },
  { code: "402", name: "Test Customer" },
  { code: "403", name: "Demo Customer" },
];

const CHEQUE_TYPE_ROWS = [
  { type: "Original", description: "Original Cheque" },
  { type: "Duplicate", description: "Duplicate Cheque" },
  { type: "Cancelled", description: "Cancelled Cheque" },
];

export interface InvestmentAccountCloseFormData {
  accountCode: string;
  accountName: string;
  glAccountCode: string;
  scrollNumber: string;
  accountOpenDate: string;
  period: string;
  unitOfPeriod: string;
  isAccountClose: boolean;
  ledgerBalance: string;
  availableBalance: string;
  depositAmount: string;
  maturityValue: string;
  interestRate: string;
  interestPayable: string;
  interestCalculated: string;
  totalInterestPaid: string;
  lastInterestDate: string;
  interestUptoDate: string;
  pendingCashInterest: string;
  completedMonths: string;
  completedDays: string;
  paymentMode: string;
  principalAccountCode: string;
  principalDescription: string;
  particular: string;
  interestCreditAccount: string;
  interestDescription: string;
  glOutlistNo: string;
  glOutlistDescription: string;
  outlistDocNo: string;
  adviceNumber: string;
  adviceDate: string;
  transferByCheque: boolean;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;
}

export const DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA: InvestmentAccountCloseFormData = {
  accountCode: "401",
  accountName: "Sample Customer",
  glAccountCode: "8001",
  scrollNumber: "12",
  accountOpenDate: "2024-01-10",
  period: "12",
  unitOfPeriod: "Months",
  isAccountClose: true,
  ledgerBalance: "250000",
  availableBalance: "250000",
  depositAmount: "250000",
  maturityValue: "250000",
  interestRate: "8",
  interestPayable: "8",
  interestCalculated: "8",
  totalInterestPaid: "20000",
  lastInterestDate: "2026-05-20",
  interestUptoDate: "2026-05-20",
  pendingCashInterest: "0",
  completedMonths: "24",
  completedDays: "730",
  paymentMode: "Transfer",
  principalAccountCode: "401",
  principalDescription: "Sample Customer",
  particular: "By Cash",
  interestCreditAccount: "401",
  interestDescription: "Interest Account",
  glOutlistNo: "GL123",
  glOutlistDescription: "Outlist Description",
  outlistDocNo: "DOC123",
  adviceNumber: "12",
  adviceDate: "2026-05-22",
  transferByCheque: false,
  chequeType: "Original",
  chequeSeries: "BY CASH",
  chequeNumber: "123456",
  chequeDate: "2026-05-22",
};

const validateInvestmentAccountClose = (
  data: InvestmentAccountCloseFormData
): Record<keyof InvestmentAccountCloseFormData, boolean> => {
  const isEmpty = (value: string) => value.trim() === "";
  return {
    accountCode: isEmpty(data.accountCode),
    accountName: isEmpty(data.accountName),
    glAccountCode: isEmpty(data.glAccountCode),
    scrollNumber: isEmpty(data.scrollNumber),
    accountOpenDate: isEmpty(data.accountOpenDate),
    period: isEmpty(data.period),
    unitOfPeriod: isEmpty(data.unitOfPeriod),
    isAccountClose: false,
    ledgerBalance: isEmpty(data.ledgerBalance),
    availableBalance: isEmpty(data.availableBalance),
    depositAmount: isEmpty(data.depositAmount),
    maturityValue: isEmpty(data.maturityValue),
    interestRate: isEmpty(data.interestRate),
    interestPayable: isEmpty(data.interestPayable),
    interestCalculated: isEmpty(data.interestCalculated),
    totalInterestPaid: isEmpty(data.totalInterestPaid),
    lastInterestDate: isEmpty(data.lastInterestDate),
    interestUptoDate: isEmpty(data.interestUptoDate),
    pendingCashInterest: isEmpty(data.pendingCashInterest),
    completedMonths: isEmpty(data.completedMonths),
    completedDays: isEmpty(data.completedDays),
    paymentMode: isEmpty(data.paymentMode),
    principalAccountCode: isEmpty(data.principalAccountCode),
    principalDescription: isEmpty(data.principalDescription),
    particular: isEmpty(data.particular),
    interestCreditAccount: isEmpty(data.interestCreditAccount),
    interestDescription: isEmpty(data.interestDescription),
    glOutlistNo: isEmpty(data.glOutlistNo),
    glOutlistDescription: isEmpty(data.glOutlistDescription),
    outlistDocNo: isEmpty(data.outlistDocNo),
    adviceNumber: isEmpty(data.adviceNumber),
    adviceDate: isEmpty(data.adviceDate),
    transferByCheque: false,
    chequeType: isEmpty(data.chequeType),
    chequeSeries: isEmpty(data.chequeSeries),
    chequeNumber: isEmpty(data.chequeNumber),
    chequeDate: isEmpty(data.chequeDate),
  };
};

const saveInvestmentAccountClose = (data: InvestmentAccountCloseFormData) =>
  new Promise<InvestmentAccountCloseFormData>((resolve) =>
    setTimeout(() => resolve(data), 600)
  );

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

export interface AddInvestmentAccountCloseProps {
  onClose: () => void;
  onSave?: (data: InvestmentAccountCloseFormData) => void;
  variant?: "modal" | "page";
}

const AddInvestmentAccountClose = ({
  onClose,
  onSave,
  variant = "modal",
}: AddInvestmentAccountCloseProps) => {
  const [form, setForm] = useState<InvestmentAccountCloseFormData>(
    DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA
  );
  const [errors, setErrors] = useState<Partial<Record<keyof InvestmentAccountCloseFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accountCodePickerOpen, setAccountCodePickerOpen] = useState(false);
  const [principalAccountPickerOpen, setPrincipalAccountPickerOpen] = useState(false);
  const [chequeTypePickerOpen, setChequeTypePickerOpen] = useState(false);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const updateField = (field: keyof InvestmentAccountCloseFormData, value: string) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateBoolField = (field: "isAccountClose" | "transferByCheque", value: boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAccountCodeSelect = (row: { code: string; name: string }) => {
    setForm((current) => ({ ...current, accountCode: row.code, accountName: row.name }));
    setAccountCodePickerOpen(false);
  };

  const handlePrincipalAccountSelect = (row: { code: string; name: string }) => {
    setForm((current) => ({ ...current, principalAccountCode: row.code, principalDescription: row.name }));
    setPrincipalAccountPickerOpen(false);
  };

  const handleChequeTypeSelect = (row: { type: string; description: string }) => {
    setForm((current) => ({ ...current, chequeType: row.type }));
    setChequeTypePickerOpen(false);
  };

  const handleValidate = () => {
    const validation = validateInvestmentAccountClose(form);
    setErrors(validation);
    const hasError = Object.values(validation).some(Boolean);
    setIsValidated(!hasError);
    if (hasError) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = async () => {
    if (!isValidated || isSaving) return;
    setIsSaving(true);
    await saveInvestmentAccountClose(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA);
    setErrors({});
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
        title="Investment Account Close Saved Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="Investment Account Close"
      titleHi="गुंतवणूक खाते बंद"
      subtitleEn="Close an existing investment account with payment and settlement details."
      subtitleHi="पेमेंट आणि सेटलमेंट तपशीलांसह विद्यमान गुंतवणूक खाते बंद करा."
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
        icon={<User size={20} className="text-primary" />}
      >
        <div className={`${grid4} mt-2`}>
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
              <LookupTrigger onClick={() => setAccountCodePickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Account Name" labelHi="खाते नाव" required error={errors.accountName}>
            <TextInput
              icon={<User size={16} />}
              value={form.accountName}
              onChange={() => {}}
              readOnly
              placeholder="Enter Account Name"
              error={errors.accountName}
            />
          </FieldShell>

          <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required error={errors.glAccountCode}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glAccountCode}
              onChange={() => {}}
              readOnly
              placeholder="Enter GL Account Code"
              error={errors.glAccountCode}
            />
          </FieldShell>

          <FieldShell label="Scroll Number" labelHi="स्क्रोल नंबर" required error={errors.scrollNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.scrollNumber}
              onChange={() => {}}
              readOnly
              placeholder="Enter Scroll Number"
              error={errors.scrollNumber}
            />
          </FieldShell>

          <FieldShell label="Account Open Date" labelHi="खाते उघडण्याची तारीख" required error={errors.accountOpenDate}>
            <DateInput
              value={form.accountOpenDate}
              onChange={() => {}}
              readOnly
              error={errors.accountOpenDate}
            />
          </FieldShell>

          <FieldShell label="Period" labelHi="अवधि" required error={errors.period}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.period}
              onChange={() => {}}
              readOnly
              placeholder="Enter Period"
              error={errors.period}
            />
          </FieldShell>

          <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required error={errors.unitOfPeriod}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.unitOfPeriod}
              onChange={(v) => updateField("unitOfPeriod", v)}
              placeholder="Enter Unit Of Period"
              error={errors.unitOfPeriod}
            />
          </FieldShell>


            <RadioYesNo
              label="Is Account Close"
              labelHi="खाते बंद आहे"
              value={form.isAccountClose}
              onChange={(v) => updateBoolField("isAccountClose", v)}
            />
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Investment Summary"
        titleHi="गुंतवणूक सारांश"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<User size={20} className="text-primary" />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Ledger Balance" labelHi="लेजर शिल्लक" required error={errors.ledgerBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.ledgerBalance}
              onChange={() => {}}
              readOnly
              placeholder="Enter Ledger Balance"
              error={errors.ledgerBalance}
            />
          </FieldShell>

          <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required error={errors.availableBalance}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.availableBalance}
              onChange={() => {}}
              readOnly
              placeholder="Enter Available Balance"
              error={errors.availableBalance}
            />
          </FieldShell>

          <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required error={errors.depositAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.depositAmount}
              onChange={() => {}}
              readOnly
              placeholder="Enter Deposit Amount"
              error={errors.depositAmount}
            />
          </FieldShell>

          <FieldShell label="Maturity Value" labelHi="परिपक्वतेचे मूल्य" required error={errors.maturityValue}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.maturityValue}
              onChange={() => {}}
              readOnly
              placeholder="Enter Maturity Value"
              error={errors.maturityValue}
            />
          </FieldShell>

          <FieldShell label="Interest Rate" labelHi="व्याज दर" required error={errors.interestRate}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.interestRate}
              onChange={() => {}}
              readOnly
              placeholder="Enter Interest Rate"
              error={errors.interestRate}
            />
          </FieldShell>

          <FieldShell label="Interest Payable" labelHi="देय व्याज" required error={errors.interestPayable}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.interestPayable}
              onChange={() => {}}
              readOnly
              placeholder="Enter Interest Payable"
              error={errors.interestPayable}
            />
          </FieldShell>

          <FieldShell label="Interest Calculated" labelHi="व्याज गणना" required error={errors.interestCalculated}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.interestCalculated}
              onChange={() => {}}
              readOnly
              placeholder="Enter Interest Calculated"
              error={errors.interestCalculated}
            />
          </FieldShell>

          <FieldShell label="Total Interest Paid" labelHi="देय व्याज" required error={errors.totalInterestPaid}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.totalInterestPaid}
              onChange={() => {}}
              readOnly
              placeholder="Enter Total Interest Paid"
              error={errors.totalInterestPaid}
            />
          </FieldShell>

          <FieldShell label="Last Interest Date" labelHi="शेवटची व्याज तारीख" required error={errors.lastInterestDate}>
            <DateInput
              value={form.lastInterestDate}
              onChange={() => {}}
              readOnly
              error={errors.lastInterestDate}
            />
          </FieldShell>

          <FieldShell label="Interest Upto Date" labelHi="व्याज तारीख पर्यंत" required error={errors.interestUptoDate}>
            <DateInput
              value={form.interestUptoDate}
              onChange={() => {}}
              readOnly
              error={errors.interestUptoDate}
            />
          </FieldShell>

          <FieldShell label="Pending Cash Interest" labelHi="बकाया रोकड व्याज" required error={errors.pendingCashInterest}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.pendingCashInterest}
              onChange={() => {}}
              readOnly
              placeholder="Enter Pending Cash Interest"
              error={errors.pendingCashInterest}
            />
          </FieldShell>

          <FieldShell label="Completed Months" labelHi="पूर्ण झालेले महिने" required error={errors.completedMonths}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.completedMonths}
              onChange={() => {}}
              readOnly
              placeholder="Enter Completed Months"
              error={errors.completedMonths}
            />
          </FieldShell>

          <FieldShell label="Completed Days" labelHi="पूर्ण झालेले दिवस" required error={errors.completedDays}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.completedDays}
              onChange={() => {}}
              readOnly
              placeholder="Enter Completed Days"
              error={errors.completedDays}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Payment Details"
        titleHi="पेमेंट तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={<FileText size={20} className="text-primary" />}
      >
        <div className={`${grid4} mt-2`}>
          <FieldShell label="Mode Of Payment" labelHi="पेमेंटची पद्धत" required error={errors.paymentMode}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.paymentMode}
              onChange={(v) => updateField("paymentMode", v)}
              options={PAYMENT_MODE_OPTIONS}
              placeholder="Select Mode Of Payment"
              error={errors.paymentMode}
            />
          </FieldShell>

          <FieldShell label="Principal A/c Code" labelHi="मुख्य खाते कोड" required error={errors.principalAccountCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={form.principalAccountCode}
                  onChange={(v) => updateField("principalAccountCode", v)}
                  placeholder="Enter Principal A/c Code"
                  error={errors.principalAccountCode}
                />
              </div>
              <LookupTrigger onClick={() => setPrincipalAccountPickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Principal Description" labelHi="मुख्य वर्णन" required error={errors.principalDescription}>
            <TextInput
              icon={<User size={16} />}
              value={form.principalDescription}
              onChange={() => {}}
              readOnly
              placeholder="Enter Principal Description"
              error={errors.principalDescription}
            />
          </FieldShell>

          <FieldShell label="Particular" labelHi="विशेष" required error={errors.particular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.particular}
              onChange={() => {}}
              readOnly
              placeholder="Enter Particular"
              error={errors.particular}
            />
          </FieldShell>

          <FieldShell label="Interest Credit A/c" labelHi="व्याज क्रेडिट खाते" required error={errors.interestCreditAccount}>
            <TextInput
              icon={<CreditCard size={16} />}
              value={form.interestCreditAccount}
              onChange={() => {}}
              readOnly
              placeholder="Enter Interest Credit A/c"
              error={errors.interestCreditAccount}
            />
          </FieldShell>

          <FieldShell label="Interest Description" labelHi="व्याज वर्णन" required error={errors.interestDescription}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.interestDescription}
              onChange={() => {}}
              readOnly
              placeholder="Enter Interest Description"
              error={errors.interestDescription}
            />
          </FieldShell>

          <FieldShell label="GL Outlist No." labelHi="GL आउटलिस्ट क्रमांक" required error={errors.glOutlistNo}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.glOutlistNo}
              onChange={() => {}}
              readOnly
              placeholder="Enter GL Outlist No."
              error={errors.glOutlistNo}
            />
          </FieldShell>

          <FieldShell label="GL Outlist Description" labelHi="GL आउटलिस्ट वर्णन" required error={errors.glOutlistDescription}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.glOutlistDescription}
              onChange={() => {}}
              readOnly
              placeholder="Enter GL Outlist Description"
              error={errors.glOutlistDescription}
            />
          </FieldShell>

          <FieldShell label="Outlist Doc. No." labelHi="आउटलिस्ट कागद क्रमांक" required error={errors.outlistDocNo}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.outlistDocNo}
              onChange={() => {}}
              readOnly
              placeholder="Enter Outlist Doc. No."
              error={errors.outlistDocNo}
            />
          </FieldShell>

          <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required error={errors.adviceNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.adviceNumber}
              onChange={() => {}}
              readOnly
              placeholder="Enter Advice Number"
              error={errors.adviceNumber}
            />
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="सल्ल्याची तारीख" required error={errors.adviceDate}>
            <DateInput
              value={form.adviceDate}
              onChange={() => {}}
              readOnly
              error={errors.adviceDate}
            />
          </FieldShell>

            <RadioYesNo
              label="Transfer by Cheque"
              labelHi="चेकद्वारे हस्तांतरण"
              value={form.transferByCheque}
              onChange={(v) => updateBoolField("transferByCheque", v)}
            />

          <FieldShell label="Cheque Type" labelHi="चेक प्रकार" required error={errors.chequeType}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<FileText size={16} />}
                  value={form.chequeType}
                  onChange={(v) => updateField("chequeType", v)}
                  placeholder="Enter Cheque Type"
                  error={errors.chequeType}
                />
              </div>
              <LookupTrigger onClick={() => setChequeTypePickerOpen(true)} />
            </div>
          </FieldShell>

          <FieldShell label="Cheque Series" labelHi="चेक मालिक" required error={errors.chequeSeries}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.chequeSeries}
              onChange={() => {}}
              readOnly
              placeholder="Enter Cheque Series"
              error={errors.chequeSeries}
            />
          </FieldShell>

          <FieldShell label="Cheque Number" labelHi="चेक नंबर" required error={errors.chequeNumber}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.chequeNumber}
              onChange={() => {}}
              readOnly
              placeholder="Enter Cheque Number"
              error={errors.chequeNumber}
            />
          </FieldShell>

          <FieldShell label="Cheque Date" labelHi="चेक तारीख" required error={errors.chequeDate}>
            <DateInput
              value={form.chequeDate}
              onChange={() => {}}
              readOnly
              error={errors.chequeDate}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
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
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
        </button>
      </div>

      {accountCodePickerOpen && (
        <ListModal
          title="Account Code"
          columns={[{ key: "code", label: "Code" }, { key: "name", label: "Name" }]}
          rows={ACCOUNT_CODE_ROWS}
          onSelect={handleAccountCodeSelect}
          onClose={() => setAccountCodePickerOpen(false)}
        />
      )}
      {principalAccountPickerOpen && (
        <ListModal
          title="Principal A/c Code"
          columns={[{ key: "code", label: "Code" }, { key: "name", label: "Name" }]}
          rows={PRINCIPAL_ACCOUNT_ROWS}
          onSelect={handlePrincipalAccountSelect}
          onClose={() => setPrincipalAccountPickerOpen(false)}
        />
      )}
      {chequeTypePickerOpen && (
        <ListModal
          title="Cheque Type"
          columns={[{ key: "type", label: "Type" }, { key: "description", label: "Description" }]}
          rows={CHEQUE_TYPE_ROWS}
          onSelect={handleChequeTypeSelect}
          onClose={() => setChequeTypePickerOpen(false)}
        />
      )}
    </FormModal>
  );
};

export default AddInvestmentAccountClose;
