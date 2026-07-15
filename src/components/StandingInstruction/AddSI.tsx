import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  CreditCard,
  Calendar,
  FileText,
  IndianRupee,
  Repeat,
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
  LookupButton,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

const SI_FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const CREDIT_ACCOUNT_CODES = ["00021010000008", "00024090001664", "00024090005522"];

export interface NewSIFormData {
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  maturityDate: string;
  debitParticular: string;
  creditParticular: string;
  amount: string;
  frequency: string;
}

export interface AddSIProps {
  onClose: () => void;
  onSave?: (data: NewSIFormData) => void;
  debitAccountCode?: string;
  debitName?: string;
}

const AddSI = ({ onClose, onSave, debitAccountCode = "022010014255", debitName = "Mirji Chandrashekar Bhimgouda" }: AddSIProps) => {
  const [account, setAccount] = useState({
    debitAccountCode,
    debitName,
    creditAccountCode: "",
    creditName: "",
  });

  const [si, setSi] = useState({
    startDate: "",
    endDate: "",
    nextDueDate: "",
    maturityDate: "",
    debitParticular: "",
    creditParticular: "",
    amount: "",
    frequency: "",
  });

  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);

const grid4 =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5";

  const markDirty = (field: string) => {
    setIsValidated(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const handleValidate = () => {
    const newErrors: Record<string, boolean> = {
      creditAccountCode: account.creditAccountCode.trim() === "",
      creditName: account.creditName.trim() === "",
      startDate: si.startDate.trim() === "",
      endDate: si.endDate.trim() === "",
      nextDueDate: si.nextDueDate.trim() === "",
      maturityDate: si.maturityDate.trim() === "",
      debitParticular: si.debitParticular.trim() === "",
      creditParticular: si.creditParticular.trim() === "",
      amount: si.amount.trim() === "",
      frequency: si.frequency.trim() === "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    onSave?.({ ...account, ...si });
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="Standing Instruction Added Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={onClose}
      titleEn="New Standing Instruction"
      titleHi="नवीन स्थायी सूचना"
      headerIcon={<Repeat size={24} className="text-primary" />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
    >
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<User size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Debit Account Code" labelHi="नावे खाते संकेत" required>
            <TextInput icon={<CreditCard size={16} />} value={account.debitAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={account.debitName} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Credit Account Code" labelHi="जमा खात्याचा कोड" required error={errors.creditAccountCode}>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <TextInput
                  icon={<CreditCard size={16} />}
                  value={account.creditAccountCode}
                  onChange={(v) => {
                    markDirty("creditAccountCode");
                    setAccount((a) => ({ ...a, creditAccountCode: v }));
                  }}
                  placeholder="Enter Credit Account Code"
                  error={errors.creditAccountCode}
                />
              </div>

              <LookupButton
                items={CREDIT_ACCOUNT_CODES}
                onPick={(code) => {
                  markDirty("creditAccountCode");
                  setAccount((a) => ({
                    ...a,
                    creditAccountCode: code,
                  }));
                }}
              />
            </div>
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required error={errors.creditName}>
            <TextInput
              icon={<User size={16} />}
              value={account.creditName}
              onChange={(v) => {
                markDirty("creditName");
                setAccount((a) => ({ ...a, creditName: v }));
              }}
              placeholder="Enter Name"
              error={errors.creditName}
            />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="SI Details" titleHi="SI तपशील" icon={<Repeat size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Start Date" labelHi="सुरुवात तारीख" required error={errors.startDate}>
            <DateInput value={si.startDate} onChange={(v) => { markDirty("startDate"); setSi((s) => ({ ...s, startDate: v })); }} error={errors.startDate} />
          </FieldShell>
          <FieldShell label="End Date" labelHi="समाप्तीची तारीख" required error={errors.endDate}>
            <DateInput value={si.endDate} onChange={(v) => { markDirty("endDate"); setSi((s) => ({ ...s, endDate: v })); }} error={errors.endDate} />
          </FieldShell>
          <FieldShell label="Next Due Date" labelHi="पुढील देय तारीख" required error={errors.nextDueDate}>
            <DateInput value={si.nextDueDate} onChange={(v) => { markDirty("nextDueDate"); setSi((s) => ({ ...s, nextDueDate: v })); }} error={errors.nextDueDate} />
          </FieldShell>
          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required error={errors.maturityDate}>
            <DateInput value={si.maturityDate} onChange={(v) => { markDirty("maturityDate"); setSi((s) => ({ ...s, maturityDate: v })); }} error={errors.maturityDate} />
          </FieldShell>
          <FieldShell label="Debit Acc. Particular" labelHi="नावे खात्याचा तपशील" required error={errors.debitParticular}>
            <TextInput
              icon={<FileText size={16} />}
              value={si.debitParticular}
              onChange={(v) => { markDirty("debitParticular"); setSi((s) => ({ ...s, debitParticular: v })); }}
              placeholder="Enter Debit Account Particular"
              error={errors.debitParticular}
            />
          </FieldShell>
          <FieldShell label="Credit Acc. Particular" labelHi="जमा खात्याचा तपशील" required error={errors.creditParticular}>
            <TextInput
              icon={<FileText size={16} />}
              value={si.creditParticular}
              onChange={(v) => { markDirty("creditParticular"); setSi((s) => ({ ...s, creditParticular: v })); }}
              placeholder="Enter Credit Account Particular"
              error={errors.creditParticular}
            />
          </FieldShell>
          <FieldShell label="Amount" labelHi="रक्कम" required error={errors.amount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={si.amount}
              onChange={(v) => { markDirty("amount"); setSi((s) => ({ ...s, amount: v })); }}
              placeholder="Enter Amount"
              error={errors.amount}
            />
          </FieldShell>
          <FieldShell label="SI Frequency" labelHi="SI वारंवारता" required error={errors.frequency}>
            <SelectInput
              icon={<Calendar size={16} />}
              value={si.frequency}
              onChange={(v) => { markDirty("frequency"); setSi((s) => ({ ...s, frequency: v })); }}
              options={SI_FREQUENCIES}
              placeholder="Select SI Frequency"
              error={errors.frequency}
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
          disabled={!isValidated}
          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors ${
            isValidated
              ? "bg-primary text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          Save <ChevronDown size={16} />
        </button>
      </div>
    </FormModal>
  );
};

export default AddSI;
