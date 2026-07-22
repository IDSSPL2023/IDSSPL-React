import { IMAGES } from "@/assets";
import { useState } from "react";
import {
  User,
  Hash,
  IndianRupee,
  CreditCard,
  MoreVertical,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { FieldShell, TextInput, DateInput, SectionCard } from "../shared/FormFields";
import AccountCodePickerModal from "../AccountMaster/ListModal";
import SuccessModal from "../shared/SuccessModal";

/* ===================== Picker data ===================== */

export interface CasaAccountOption {
  code: string;
  name: string;
  ledgerBalance: string;
  availableBalance: string;
}

const ACCOUNT_OPTIONS: CasaAccountOption[] = [
  { code: "AC101", name: "Savings - Ramesh Kulkarni", ledgerBalance: "24500", availableBalance: "24000" },
  { code: "AC102", name: "Savings - Sunita Patil", ledgerBalance: "18200", availableBalance: "18200" },
  { code: "AC103", name: "Savings - Vikram Joshi", ledgerBalance: "9800", availableBalance: "9500" },
];

export interface TransferAccountOption {
  code: string;
  name: string;
}

const TRANSFER_ACCOUNT_OPTIONS: TransferAccountOption[] = [
  { code: "00021010000163", name: "MATURED JEEVAN SIRI DEPOSIT" },
  { code: "00021010000171", name: "SUSPENSE ACCOUNT" },
  { code: "00021010000188", name: "SUNDRY DEPOSIT ACCOUNT" },
];

export interface ChequeTypeOption {
  code: string;
  name: string;
}

const CHEQUE_TYPE_OPTIONS: ChequeTypeOption[] = [
  { code: "SELF", name: "Self Cheque" },
  { code: "BEARER", name: "Bearer Cheque" },
  { code: "ORDER", name: "Order Cheque" },
  { code: "CROSSED", name: "Crossed Cheque" },
];

/* ===================== Local Select field ===================== */
/*
  No shared Select exists in FormFields yet, so a small local one is
  used here to match the same visual language (icon, border, focus ring)
  as TextInput. Swap this out for a shared component if one gets added.
*/
interface SelectFieldProps {
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

function SelectField({ icon, value, onChange, options, placeholder, error, disabled }: SelectFieldProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors ${
        error ? "border-red-400" : "border-slate-600"
      } ${disabled ? "bg-slate-50 text-slate-400" : "focus-within:border-blue-500"}`}
    >
      {icon && <span className="text-slate-400">{icon}</span>}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full flex-1 appearance-none bg-transparent text-slate-700 outline-none disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          {placeholder || "Select"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="shrink-0 text-slate-400" />
    </div>
  );
}

/* ===================== Reusable picklist field ===================== */
/* Same pattern as the Account Code lookup: a read-only text field with the
   "..." picker button kept outside the input box, opening a list modal. */
interface PickerCodeFieldProps {
  label: string;
  labelHi: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  onPickerClick: () => void;
}

function PickerCodeField({ label, labelHi, value, placeholder, error, onPickerClick }: PickerCodeFieldProps) {
  return (
    <FieldShell label={label} labelHi={labelHi} required error={error}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <TextInput icon={<User size={16} />} value={value} onChange={() => {}} readOnly placeholder={placeholder} />
        </div>
        <button
          type="button"
          onClick={onPickerClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </FieldShell>
  );
}

/* ===================== Types ===================== */

export interface CasaClosingFormData {
  // Scroll Details
  fromDate: string;
  serialNo: string;
  scrollNumber: string;
  accountCode: string;
  accountName: string;
  ledgerBalance: string;
  availableBalance: string;

  // Interest Details
  closingInterest: string;
  closingBalance: string;
  againstEffectInt: string;
  todInterest: string;
  serviceCharges: string;
  otherCharges: string;
  serviceTax: string;

  // Payment Details
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  adviceNumber: string;
  chequeType: string;
  chequeSeries: string;
  chequeNumber: string;
  chequeDate: string;

  // Product Details
  particular: string;
  oAndR: string;
  productFirst: string;
  interestFirst: string;
  productSecond: string;
  interestSecond: string;
  productThird: string;
  interestThird: string;
  productFourth: string;
  interestFourth: string;
  productFifth: string;
  interestFifth: string;
  productSixth: string;
  interestSixth: string;
}

const DEFAULT_DATA: CasaClosingFormData = {
  fromDate: "",
  serialNo: "",
  scrollNumber: "",
  accountCode: "",
  accountName: "",
  ledgerBalance: "",
  availableBalance: "",

  closingInterest: "",
  closingBalance: "",
  againstEffectInt: "",
  todInterest: "",
  serviceCharges: "",
  otherCharges: "",
  serviceTax: "",

  modeOfPayment: "",
  transferAcCode: "",
  transferAcName: "",
  adviceNumber: "",
  chequeType: "",
  chequeSeries: "",
  chequeNumber: "",
  chequeDate: "",

  particular: "",
  oAndR: "",
  productFirst: "",
  interestFirst: "",
  productSecond: "",
  interestSecond: "",
  productThird: "",
  interestThird: "",
  productFourth: "",
  interestFourth: "",
  productFifth: "",
  interestFifth: "",
  productSixth: "",
  interestSixth: "",
};

const REQUIRED_FIELDS: (keyof CasaClosingFormData)[] = [
  "fromDate",
  "serialNo",
  "scrollNumber",
  "accountCode",
  "accountName",
  "ledgerBalance",
  "availableBalance",

  "closingInterest",
  "closingBalance",
  "againstEffectInt",
  "todInterest",
  "serviceCharges",
  "otherCharges",
  "serviceTax",

  "modeOfPayment",
  "transferAcCode",
  "transferAcName",
  "adviceNumber",
  "chequeType",
  "chequeSeries",
  "chequeNumber",
  "chequeDate",

  "particular",
  "oAndR",
  "productFirst",
  "interestFirst",
  "productSecond",
  "interestSecond",
  "productThird",
  "interestThird",
  "productFourth",
  "interestFourth",
  "productFifth",
  "interestFifth",
  "productSixth",
  "interestSixth",
];

const CLOSING_INTEREST_OPTIONS = [
  { label: "5%", value: "5" },
  { label: "6%", value: "6" },
  { label: "7%", value: "7" },
  { label: "8%", value: "8" },
];

const MODE_OF_PAYMENT_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
  { label: "NEFT", value: "neft" },
  { label: "RTGS", value: "rtgs" },
  { label: "Transfer", value: "transfer" },
];

/* ===================== CASAClosingModal ===================== */

export interface CASAClosingModalProps {
  open: boolean;
  initialData?: Partial<CasaClosingFormData>;
  onClose?: () => void;
  onSubmit?: (data: CasaClosingFormData) => void;
}

export default function CASAClosingModal({ open, initialData, onClose, onSubmit }: CASAClosingModalProps) {
  const [data, setData] = useState<CasaClosingFormData>({ ...DEFAULT_DATA, ...initialData });
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [transferAccountPickerOpen, setTransferAccountPickerOpen] = useState(false);
  const [chequeTypePickerOpen, setChequeTypePickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  if (showSuccess) {
    return (
      <SuccessModal
        title="CASA Account Closed Successfully"
        subtitle=""
        onClose={() => {
          setShowSuccess(false);
          onClose?.();
        }}
        onDone={() => {
          setShowSuccess(false);
          onClose?.();
        }}
      />
    );
  }

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };

  const set =
    <K extends keyof CasaClosingFormData>(key: K) =>
    (val: CasaClosingFormData[K]) => {
      setData((prev) => ({ ...prev, [key]: val }));
      clearError(key as string);
    };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    REQUIRED_FIELDS.forEach((key) => {
      if (!data[key].trim()) {
        nextErrors[key] = "required";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => setIsValidated(validate());

  const handleSave = () => {
    if (!isValidated) return;
    onSubmit?.(data);
    setShowSuccess(true);
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-3";

  const footer = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={handleValidate}
        disabled={isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Validate <Check size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
      >
        Cancel <X size={16} />
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save <ChevronDown size={16} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
        {/* Scroll Details */}
        <SectionCard
          titleEn="Scroll Details"
          titleHi="स्क्रोल तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid3}>
            <FieldShell label="From Date" labelHi="प्रारंभ दिनांक" required error={!!errors.fromDate}>
              <DateInput value={data.fromDate} onChange={set("fromDate")} error={!!errors.fromDate} />
            </FieldShell>

            <FieldShell label="Serial No" labelHi="अनुक्रमांक" required error={!!errors.serialNo}>
              <TextInput icon={<User size={16} />} value={data.serialNo} onChange={set("serialNo")} placeholder="Serial No" error={!!errors.serialNo} />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required error={!!errors.scrollNumber}>
              <TextInput icon={<User size={16} />} value={data.scrollNumber} onChange={set("scrollNumber")} placeholder="Scroll Number" error={!!errors.scrollNumber} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <PickerCodeField
              label="Account Code"
              labelHi="खाते कोड"
              value={data.accountCode}
              placeholder="Select Account Code"
              error={!!errors.accountCode}
              onPickerClick={() => setAccountPickerOpen(true)}
            />

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required error={!!errors.accountName}>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly placeholder="Account Name" error={!!errors.accountName} />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="उपलब्ध शिल्लक" required error={!!errors.ledgerBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly trailing={<IndianRupee size={16} />} error={!!errors.ledgerBalance} />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="ठेव कालावधी" required error={!!errors.availableBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly trailing={<IndianRupee size={16} />} error={!!errors.availableBalance} />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Interest Details */}
        <SectionCard
          titleEn="Interest Details"
          titleHi="व्याज तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Closing Interest" labelHi="अंतिम व्याज" required error={!!errors.closingInterest}>
              <SelectField
                icon={<User size={16} />}
                value={data.closingInterest}
                onChange={set("closingInterest")}
                placeholder="Interest Rate %"
                options={CLOSING_INTEREST_OPTIONS}
                error={!!errors.closingInterest}
              />
            </FieldShell>

            <FieldShell label="Closing Balance" labelHi="अंतिम शिल्लक" required error={!!errors.closingBalance}>
              <TextInput icon={<IndianRupee size={16} />} value={data.closingBalance} onChange={set("closingBalance")} placeholder="Applicable Interest Rate %" error={!!errors.closingBalance} />
            </FieldShell>

            <FieldShell label="Against Effect Int." labelHi="प्रभावी व्याज समायोजन" required error={!!errors.againstEffectInt}>
              <TextInput icon={<IndianRupee size={16} />} value={data.againstEffectInt} onChange={set("againstEffectInt")} placeholder="Interest Payable %" error={!!errors.againstEffectInt} />
            </FieldShell>

            <FieldShell label="TOD Interest" labelHi="ओव्हरड्राफ्ट (TOD) व्याज" required error={!!errors.todInterest}>
              <TextInput icon={<IndianRupee size={16} />} value={data.todInterest} onChange={set("todInterest")} placeholder="Interest Paid ₹" error={!!errors.todInterest} />
            </FieldShell>
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="Service Charges" labelHi="सेवा शुल्क" required error={!!errors.serviceCharges}>
              <TextInput icon={<IndianRupee size={16} />} value={data.serviceCharges} onChange={set("serviceCharges")} placeholder="Pending Cash Interest %" error={!!errors.serviceCharges} />
            </FieldShell>

            <FieldShell label="Other Charges" labelHi="इतर शुल्क" required error={!!errors.otherCharges}>
              <TextInput icon={<IndianRupee size={16} />} value={data.otherCharges} onChange={set("otherCharges")} placeholder="Additional Interest %" error={!!errors.otherCharges} />
            </FieldShell>

            <FieldShell label="Service Tax" labelHi="सेवा कर" required error={!!errors.serviceTax}>
              <TextInput icon={<IndianRupee size={16} />} value={data.serviceTax} onChange={set("serviceTax")} placeholder="New Interest %" error={!!errors.serviceTax} />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Payment Details */}
        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Mode of Payment" labelHi="पेमेंट पद्धत" required error={!!errors.modeOfPayment}>
              <SelectField
                icon={<CreditCard size={16} />}
                value={data.modeOfPayment}
                onChange={set("modeOfPayment")}
                placeholder="Select Mode of Payment"
                options={MODE_OF_PAYMENT_OPTIONS}
                error={!!errors.modeOfPayment}
              />
            </FieldShell>

            <PickerCodeField
              label="Transfer A/c Code"
              labelHi="बदली खाते कोड"
              value={data.transferAcCode}
              placeholder="Transfer A/c Code"
              error={!!errors.transferAcCode}
              onPickerClick={() => setTransferAccountPickerOpen(true)}
            />

            <FieldShell label="Transfer A/c Name" labelHi="बदली खाते नाव" required error={!!errors.transferAcName}>
              <TextInput icon={<User size={16} />} value={data.transferAcName} onChange={() => {}} readOnly placeholder="Transfer A/c Name" error={!!errors.transferAcName} />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required error={!!errors.adviceNumber}>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={set("adviceNumber")} placeholder="Advice Number" error={!!errors.adviceNumber} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <PickerCodeField
              label="Cheque Type"
              labelHi="धनादेश प्रकार"
              value={data.chequeType}
              placeholder="Placeholder text"
              error={!!errors.chequeType}
              onPickerClick={() => setChequeTypePickerOpen(true)}
            />

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required error={!!errors.chequeSeries}>
              <TextInput icon={<User size={16} />} value={data.chequeSeries} onChange={set("chequeSeries")} placeholder="Placeholder text" error={!!errors.chequeSeries} />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required error={!!errors.chequeNumber}>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={set("chequeNumber")} placeholder="ABCD1234567" error={!!errors.chequeNumber} />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required error={!!errors.chequeDate}>
              <DateInput value={data.chequeDate} onChange={set("chequeDate")} error={!!errors.chequeDate} />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Product Details */}
        <SectionCard
          titleEn="Product Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
          icon={IMAGES.PERSON_ICON}
        >
          <div className={grid4}>
            <FieldShell label="Particular" labelHi="तपशील" required error={!!errors.particular} className="lg:col-span-3">
              <TextInput icon={<User size={16} />} value={data.particular} onChange={set("particular")} placeholder="Enter Particular" error={!!errors.particular} />
            </FieldShell>

            <FieldShell label="O & R" labelHi="पहिले व्याज" required error={!!errors.oAndR}>
              <TextInput icon={<IndianRupee size={16} />} value={data.oAndR} onChange={set("oAndR")} placeholder="Original" error={!!errors.oAndR} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Product First" labelHi="पहिले उत्पादन" required error={!!errors.productFirst}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productFirst} onChange={set("productFirst")} placeholder="0.0" error={!!errors.productFirst} />
            </FieldShell>

            <FieldShell label="Interest First" labelHi="पहिले व्याज" required error={!!errors.interestFirst}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestFirst} onChange={set("interestFirst")} placeholder="0.0" error={!!errors.interestFirst} />
            </FieldShell>

            <FieldShell label="Product Second" labelHi="धनादेश क्रमांक" required error={!!errors.productSecond}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productSecond} onChange={set("productSecond")} placeholder="0.0" error={!!errors.productSecond} />
            </FieldShell>

            <FieldShell label="Interest Second" labelHi="पहिले व्याज" required error={!!errors.interestSecond}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestSecond} onChange={set("interestSecond")} placeholder="0.0" error={!!errors.interestSecond} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Product Third" labelHi="पहिले उत्पादन" required error={!!errors.productThird}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productThird} onChange={set("productThird")} placeholder="0.0" error={!!errors.productThird} />
            </FieldShell>

            <FieldShell label="Interest Third" labelHi="पहिले व्याज" required error={!!errors.interestThird}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestThird} onChange={set("interestThird")} placeholder="0.0" error={!!errors.interestThird} />
            </FieldShell>

            <FieldShell label="Product Fourth" labelHi="धनादेश क्रमांक" required error={!!errors.productFourth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productFourth} onChange={set("productFourth")} placeholder="0.0" error={!!errors.productFourth} />
            </FieldShell>

            <FieldShell label="Interest Fourth" labelHi="पहिले व्याज" required error={!!errors.interestFourth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestFourth} onChange={set("interestFourth")} placeholder="0.0" error={!!errors.interestFourth} />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Product Fifth" labelHi="पहिले उत्पादन" required error={!!errors.productFifth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productFifth} onChange={set("productFifth")} placeholder="0.0" error={!!errors.productFifth} />
            </FieldShell>

            <FieldShell label="Interest Fifth" labelHi="पहिले व्याज" required error={!!errors.interestFifth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestFifth} onChange={set("interestFifth")} placeholder="0.0" error={!!errors.interestFifth} />
            </FieldShell>

            <FieldShell label="Product Sixth" labelHi="धनादेश क्रमांक" required error={!!errors.productSixth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.productSixth} onChange={set("productSixth")} placeholder="0.0" error={!!errors.productSixth} />
            </FieldShell>

            <FieldShell label="Interest Sixth" labelHi="पहिले व्याज" required error={!!errors.interestSixth}>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestSixth} onChange={set("interestSixth")} placeholder="0.0" error={!!errors.interestSixth} />
            </FieldShell>
          </div>
        </SectionCard>

        {footer}

      {accountPickerOpen && (
        <AccountCodePickerModal
          title="Account Code List"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={ACCOUNT_OPTIONS}
          onClose={() => setAccountPickerOpen(false)}
          onSelect={(account: CasaAccountOption) => {
            setData((prev) => ({
              ...prev,
              accountCode: account.code,
              accountName: account.name,
              ledgerBalance: account.ledgerBalance,
              availableBalance: account.availableBalance,
            }));
            clearError("accountCode");
            setAccountPickerOpen(false);
          }}
        />
      )}

      {transferAccountPickerOpen && (
        <AccountCodePickerModal
          title="Transfer A/c Code List"
          columns={[
            { key: "code", label: "A/c Code" },
            { key: "name", label: "A/c Name" },
          ]}
          rows={TRANSFER_ACCOUNT_OPTIONS}
          onClose={() => setTransferAccountPickerOpen(false)}
          onSelect={(account: TransferAccountOption) => {
            setData((prev) => ({
              ...prev,
              transferAcCode: account.code,
              transferAcName: account.name,
            }));
            clearError("transferAcCode");
            setTransferAccountPickerOpen(false);
          }}
        />
      )}

      {chequeTypePickerOpen && (
        <AccountCodePickerModal
          title="Cheque Type List"
          columns={[
            { key: "code", label: "Code" },
            { key: "name", label: "Cheque Type" },
          ]}
          rows={CHEQUE_TYPE_OPTIONS}
          onClose={() => setChequeTypePickerOpen(false)}
          onSelect={(type: ChequeTypeOption) => {
            setData((prev) => ({ ...prev, chequeType: type.name }));
            clearError("chequeType");
            setChequeTypePickerOpen(false);
          }}
        />
      )}
    </div>
  );
}