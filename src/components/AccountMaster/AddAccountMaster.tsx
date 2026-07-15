import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import {
  X,
  MapPin,
  AlignLeft,
  MoreVertical,
  Upload,
  Plus,
  User,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SuccessModal from "../shared/SuccessModal";
import Image from "@/components/ui/Image";
import ListModal from "./ListModal";
import AddSavingAccountModal from "./AddSavingAccountModal";
import { useBilingual } from "@/i18n/useBilingual";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

type ListRow = {
  code: string;
  name?: string;
  description?: string;
};

type ListColumn = {
  key: keyof ListRow;
  label: string;
};

type ListModalProps = {
  title: string;
  columns: ListColumn[];
  rows: ListRow[];
  onSelect: (row: ListRow) => void;
  onClose: () => void;
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
  { code: "AL", name: "All" },
  { code: "BL", name: "Bill Discounting" },
  { code: "BG", name: "Bill Guarantee" },
  { code: "BR", name: "Branch" },
  { code: "CA", name: "Current Account" },
  { code: "CC", name: "Cash Credit" },
  { code: "FA", name: "Fixed Asset" },
  { code: "GL", name: "General Ledger" },
  { code: "IN", name: "Investment" },
  { code: "OG", name: "Over Draft" },
  { code: "PG", name: "Pigmy Deposit" },
];

const SUB_PRODUCTS: Record<string, ListRow[]> = {
  AL: [{ code: "201", description: "Saving Deposit" }],
  BR: [{ code: "BR", description: "Branch" }],
  CA: [{ code: "CA", description: "Saving Deposit" }],
  CC: [{ code: "CC", description: "Cash Credit" }],
  FA: [{ code: "FA", description: "Fixed Asset" }],
};
const DEFAULT_SUB_PRODUCTS: ListRow[] = [
  { code: "201", description: "Saving Deposit" },
  { code: "BR", description: "Branch" },
  { code: "CA", description: "Current Account" },
  { code: "CC", description: "Cash Credit" },
  { code: "FA", description: "Fixed Asset" },
];


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
      {/* Label */}
      <label className="block text-[16px] font-semibold text-black dark:text-slate-100">
        {field.label}
        {field.labelHi ? (
          <span className="text-gray-500 font-semibold dark:text-slate-400">
            {" "}
            <span className="text-black dark:text-slate-100">/</span> {field.labelHi}
          </span>
        ) : null}
        <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-3">
        {/* Input */}
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
            bg-white
            dark:bg-slate-900
            dark:border-slate-700
            px-4
            transition-all
            duration-200
            hover:border-primary
            focus-within:border-primary
            focus-within:ring-2
            focus-within:ring-primary/10
            ${
              isMenuField
                ? "cursor-pointer"
                : ""
            }
          `}
        >
          <Icon
            size={18}
            className="text-[#6A7282] shrink-0"
          />

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
              ${
                isMenuField
                  ? "pointer-events-none cursor-pointer"
                  : ""
              }
            `}
          />
        </Wrapper>

        {/* Right Button */}
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
              text-primary
              transition-all
              duration-200
              hover:bg-[#DDEAFF]
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
/* Main Add Account form                                               */
/* ------------------------------------------------------------------ */

type AddAccountFlowProps = {
  onClose?: () => void;
};

type Step =
  | "form"
  | "accountTypeList"
  | "subProductList"
  | "savingAccount"
  | "success";

export default function AddAccountFlow({ onClose = () => { } }: AddAccountFlowProps) {
  const { en, t, tRaw } = useBilingual();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    accountType: "",
    accountCode: "",
    accountDescription: "",
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
      label: en("fields.accountType"),
      labelHi: t("fields.accountType"),
      placeholder: tRaw("accountMaster.addForm.accountTypePlaceholder"),
      icon: MapPin,
      readOnly: true,
      onMenuClick: () => setStep("accountTypeList"),
    },
    {
      key: "accountDescription",
      label: en("fields.description"),
      labelHi: t("fields.description"),
      placeholder: tRaw("fields.description"),
      icon: AlignLeft,
    },
    {
      key: "productType",
      label: en("fields.productType"),
      labelHi: t("fields.productType"),
      placeholder: tRaw("accountMaster.addForm.productTypePlaceholder"),
      icon: MapPin,
      readOnly: true,
      onMenuClick: () => setStep("subProductList"),
    },
    {
      key: "productDescription",
      label: en("fields.description"),
      labelHi: t("fields.description"),
      placeholder: tRaw("fields.description"),
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
      {/* Base form modal — stays mounted underneath the list/saving-account/success modals */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-start gap-3 mb-6">
            <Image src="/add-icn.png" alt="Account Icon" width={50} height={50} />

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {en("accountMaster.addForm.title")}
                {t("accountMaster.addForm.title") ? (
                  <span className="font-bold text-[#64748B] dark:text-slate-400"> / {t("accountMaster.addForm.title")}</span>
                ) : null}
              </h2>
              <p className="text-sm text-gray-700 dark:text-slate-400">
                {en("accountMaster.addForm.subtitle")}
                {t("accountMaster.addForm.subtitle") ? (
                  <>
                    {" "}
                    / <span>{t("accountMaster.addForm.subtitle")}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
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
              {en("common.cancel")} <X size={16} />
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => setStep("savingAccount")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition ${isFormValid
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
                }`}
            >
              {en("common.submit")} <Upload size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Type List overlay */}
      {step === "accountTypeList" && (
        <ListModal
          title={tRaw("accountMaster.addForm.accountTypeListTitle")}
          columns={[
            { key: "code", label: tRaw("fields.accountType") },
            { key: "name", label: tRaw("fields.name") },
          ]}
          rows={ACCOUNT_TYPES}
          onSelect={handleSelectAccountType}
          onClose={() => setStep("form")}
        />
      )}

      {/* Sub Product List overlay */}
      {step === "subProductList" && (
        <ListModal
          title={tRaw("accountMaster.addForm.subProductListTitle")}
          columns={[
            { key: "code", label: tRaw("fields.productCode") },
            { key: "description", label: tRaw("fields.description") },
          ]}
          rows={subProductRows}
          onSelect={handleSelectSubProduct}
          onClose={() => setStep("form")}
        />
      )}

      {/* Add Saving Account overlay — shown after Submit, before the success screen */}
      {step === "savingAccount" && (
        <AddSavingAccountModal
          onClose={() => setStep("form")}
          onSave={() => setStep("success")}
        />
      )}

      {/* Success overlay after the saving account details are saved */}
      {step === "success" && (
        <SuccessModal data={formData} onClose={() => setStep("form")} onDone={onClose} />
      )}
    </>
  );
}