import { IMAGES } from "@/assets";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { X, MapPin, AlignLeft, MoreVertical, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import SuccessModal from "../shared/SuccessModal";
import ListModal from "../AccountMaster/ListModal";
import AddLoanAccountModal from "./AddLoanAccountModal";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

type ListRow = {
  code: string;
  name?: string;
  description?: string;
};

type FormData = {
  accountType: string;
  accountCode: string;
  accountDescription: string;
  productType: string;
  productDescription: string;
};

type FieldConfig = {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  readOnly?: boolean;
  onMenuClick?: () => void;
};

const ACCOUNT_TYPES: ListRow[] = [
  { code: "TL", name: "Term Loan" },
  { code: "CC", name: "Cash Credit" },
  { code: "OD", name: "Over Draft" },
  { code: "BL", name: "Bill Discounting" },
  { code: "BG", name: "Bill Guarantee" },
];

const SUB_PRODUCTS: Record<string, ListRow[]> = {
  TL: [
    { code: "501", description: "Personal Loan" },
    { code: "502", description: "Pay Deduction Loan" },
    { code: "503", description: "Deposit Loan" },
    { code: "504", description: "Staff Housing Loan" },
    { code: "505", description: "Gold Loan" },
    { code: "506", description: "Vehicle Loan" },
    { code: "507", description: "Domestic Items Loan" },
    { code: "508", description: "Small Scale Industry Loan" },
    { code: "509", description: "Loan on Govt Securities" },
    { code: "510", description: "Secured Medium Term Commercial" },
    { code: "512", description: "Secured Short Term Sugar Cane" },
  ],

  CC: [
    { code: "601", description: "Cash Credit Hypothecation" },
  ],

  OD: [
    { code: "701", description: "Overdraft Against FD" },
  ],

  BL: [
    { code: "801", description: "Bill Discounting" },
  ],

  BG: [
    { code: "901", description: "Bill Guarantee" },
  ],
};
const DEFAULT_SUB_PRODUCTS: ListRow[] = SUB_PRODUCTS.TL;

/* ------------------------------------------------------------------ */
/* Reusable form field (icon + input + optional menu trigger)          */
/* ------------------------------------------------------------------ */

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const Icon = field.icon;
  const isMenuField = Boolean(field.onMenuClick);
  const Wrapper = isMenuField ? "button" : "div";

  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-[16px] font-semibold text-black dark:text-slate-100">
        {field.label}
        <span className="text-gray-500 font-semibold dark:text-slate-400">
          {" "}
          <span className="text-black dark:text-slate-100">/</span> {field.labelHi}
        </span>
        <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-3">
        <Wrapper
          type={isMenuField ? "button" : undefined}
          onClick={field.onMenuClick}
          className={`
            group
            flex
            items-center
            w-full
            h-10
            rounded-[12px]
            border
            border-[#6A7282]
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-4
            transition-all
            duration-200
            hover:border-primary
            focus-within:border-primary
            focus-within:ring-2
            focus-within:ring-primary/10
            ${isMenuField ? "cursor-pointer" : ""}
          `}
        >
          <Icon size={18} className="text-[#6A7282] dark:text-slate-400 shrink-0" />

          <input
            type="text"
            readOnly={field.readOnly}
            placeholder={field.placeholder}
            value={value}
            onChange={field.readOnly ? undefined : onChange}
            className={`
              ml-3
              w-full
              bg-transparent
              placeholder:font-medium
              text-[16px]
              text-[#4B5563]
              dark:text-slate-100
              placeholder:text-[#6A7282]
              dark:placeholder-slate-500
              outline-none
              ${isMenuField ? "pointer-events-none cursor-pointer" : ""}
            `}
          />
        </Wrapper>

        {isMenuField && (
          <button
            type="button"
            onClick={field.onMenuClick}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-[#EEF4FF]
              dark:bg-slate-800
              text-primary
              transition-all
              duration-200
              hover:bg-[#DDEAFF]
              dark:hover:bg-slate-700
              active:scale-95
            "
          >
            <MoreVertical size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Add Term Loan Account form                                     */
/* ------------------------------------------------------------------ */

type AddTermLoanFlowProps = {
  onClose?: () => void;
};

type Step =
  | "form"
  | "accountTypeList"
  | "subProductList"
  | "loanAccount"
  | "success";

export default function AddTermLoanFlow({ onClose = () => {} }: AddTermLoanFlowProps) {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    accountType: "Term Loan",
    accountCode: "TL",
    accountDescription: "Term Loan",
    productType: "",
    productDescription: "",
  });

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelectAccountType = (row: ListRow) => {
    setFormData((prev) => ({
      ...prev,
      accountCode: row.code,
      accountType: row.name ?? "",
      accountDescription: row.name ?? "",
    }));
    setStep("form");
  };

  const handleSelectSubProduct = (row: ListRow) => {
    setFormData((prev) => ({
      ...prev,
      productType: `${row.code} - ${row.description ?? ""}`,
      productDescription: row.description ?? "",
    }));
    setStep("form");
  };

  const subProductRows: ListRow[] = SUB_PRODUCTS[formData.accountCode] || DEFAULT_SUB_PRODUCTS;

  const fields: FieldConfig[] = [
    {
      key: "accountType",
      label: "Account Type",
      labelHi: "खाते प्रकार",
      placeholder: "Select Account Type",
      icon: MapPin,
      readOnly: true,
      onMenuClick: () => setStep("accountTypeList"),
    },
    {
      key: "accountDescription",
      label: "Description",
      labelHi: "वर्णन",
      placeholder: "Description",
      icon: AlignLeft,
    },
    {
      key: "productType",
      label: "Product Type",
      labelHi: "उत्पादनाचा प्रकार",
      placeholder: "Select Product Type",
      icon: MapPin,
      readOnly: true,
      onMenuClick: () => setStep("subProductList"),
    },
    {
      key: "productDescription",
      label: "Description",
      labelHi: "वर्णन",
      placeholder: "Description",
      icon: AlignLeft,
    },
  ];

  const isFormValid =
    formData.accountType &&
    formData.accountDescription &&
    formData.productType &&
    formData.productDescription;

  return (
    <>
      {/* Base form modal — stays mounted underneath the list/loan-account/success modals */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full border-2 border-gray-300 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-start gap-3 mb-6">
            <Image src={IMAGES.ADD_ICON} alt="Account Icon" width={50} height={50} />

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Add Account <span className="font-bold text-[#64748B] dark:text-slate-400">/ खाते जोडा</span>
              </h2>
              <p className="text-sm text-gray-700 dark:text-slate-400">
                Add some basic information related to the Employee /{" "}
                <span>कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती</span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            {fields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={formData[field.key]}
                onChange={handleChange(field.key)}
              />
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary-500 text-primary font-medium text-sm hover:bg-primary-50 transition"
            >
              Cancel <X size={16} />
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => setStep("loanAccount")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition ${
                isFormValid
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
              }`}
            >
              Submit <Upload size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Type List overlay */}
      {step === "accountTypeList" && (
        <ListModal
          title="Account Type List"
          columns={[
            { key: "code", label: "Account Type" },
            { key: "name", label: "Name" },
          ]}
          rows={ACCOUNT_TYPES}
          onSelect={handleSelectAccountType}
          onClose={() => setStep("form")}
        />
      )}

      {/* Sub Product List overlay */}
      {step === "subProductList" && (
        <ListModal
          title="Sub Product List"
          columns={[
            { key: "code", label: "Product Code" },
            { key: "description", label: "Description" },
          ]}
          rows={subProductRows}
          onSelect={handleSelectSubProduct}
          onClose={() => setStep("form")}
        />
      )}

      {/* Add Loan Account overlay — shown after Submit, before the success screen */}
      {step === "loanAccount" && (
        <AddLoanAccountModal
          productDescription={formData.productDescription}
          onClose={() => setStep("form")}
          onSave={() => setStep("success")}
        />
      )}

      {/* Success overlay after the loan account details are saved */}
      {step === "success" && (
        <SuccessModal data={formData} onClose={() => setStep("form")} onDone={onClose} />
      )}
    </>
  );
}
