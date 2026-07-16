import { useState } from "react";
import { User, IdCard, CreditCard, Hash, FileText, IndianRupee, Smartphone } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, RadioYesNo, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

const CHEQUE_TYPE_OPTIONS = ["CTS", "Non-CTS"];

export interface StopChequePaymentData {
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

const DEFAULT_DATA: StopChequePaymentData = {
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

type StopChequePaymentStringField = {
  [K in keyof StopChequePaymentData]: StopChequePaymentData[K] extends string ? K : never;
}[keyof StopChequePaymentData];

const REQUIRED_FIELDS: StopChequePaymentStringField[] = [
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

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const ChequeIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <IdCard size={20} className="text-primary" />
  </div>
);

export interface StopChequePaymentProps {
  onClose: () => void;
  onSave?: (data: StopChequePaymentData) => void;
  variant?: "modal" | "page";
}

export default function StopChequePayment({ onClose, onSave, variant = "modal" }: StopChequePaymentProps) {
  const [data, setData] = useState<StopChequePaymentData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof StopChequePaymentData, boolean>>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clearError = (key: keyof StopChequePaymentData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof StopChequePaymentData) =>
    (value: string) => {
      setData((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof StopChequePaymentData, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
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
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<SectionIcon />}>
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

      <SectionCard titleEn="Cheque Details" titleHi="तपशील तपासा" icon={<ChequeIcon />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FieldShell label="Cheque Type" labelHi="चेक प्रकार" required error={!!errors.chequeType}>
            <SelectInput
              icon={<CreditCard size={16} />}
              value={data.chequeType}
                            onChange={() => {}}
              readOnly
              options={CHEQUE_TYPE_OPTIONS}
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
