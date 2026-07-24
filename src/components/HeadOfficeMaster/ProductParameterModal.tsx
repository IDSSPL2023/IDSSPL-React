// @ts-nocheck
import { IMAGES } from "@/assets";
import { useState } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen, ShieldCheck, Copy, FileText, Coins, Percent } from "lucide-react";
import PicklistModal from "@/components/common/PicklistModal";
import { fetchProducts, searchGlAccounts } from "@/api/headoffice.api";

const PAGE_SIZE = 10;

export const ACCOUNT_TYPES = [
  { code: "SB", description: "Saving Deposit" },
  { code: "CA", description: "Current Account" },
  { code: "TD", description: "Term Deposit" },
  { code: "RD", description: "Recurring Deposit" },
  { code: "CC", description: "Cash Credit" },
  { code: "OD", description: "Over Draft" },
  { code: "TL", description: "Term Loan" },
  { code: "PG", description: "Pigmy Deposit" },
  { code: "GL", description: "General Ledger" },
  { code: "FA", description: "Fixed Asset" },
];

const MODAL_META = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    useImage: true,
  },
  edit: {
    titleEn: "Edit Parameter",
    titleHi: "पॅरामीटर संपादित करा",
    subtitleEn: "Review and update the details below as needed.",
    subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा.",
    useImage: false,
    Icon: SquarePen,
  },
  view: {
    titleEn: "View Parameter",
    titleHi: "पॅरामीटर पहा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    useImage: false,
    Icon: UserRound,
  },
};

const emptyForm = () => ({
  accountType: "",
  accountTypeDescription: "",
  productCode: "",
  description: "",
  copyFrom: "",
  copyFromDescription: "",
  glAccountCode: "",
  glAccountDescription: "",
  defaultMinimumBalanceId: "",
  maxCashLimit: "",
  maxWithdrawalLimit: "",
  interestRoundingFactor: "",
  implemented: "N",
  nomineeRequired: "N",
  cashTransactionAllowed: "Y",
  inwardClearingAllowed: "Y",
});

const formFromRecord = (record) => ({
  ...emptyForm(),
  accountType: record.accountType ?? "",
  accountTypeDescription: ACCOUNT_TYPES.find((a) => a.code === record.accountType)?.description ?? record.accountType ?? "",
  productCode: record.productCode ?? "",
  description: record.description ?? "",
  defaultMinimumBalanceId: record.defaultMinimumBalanceId != null ? String(record.defaultMinimumBalanceId) : "",
  interestRoundingFactor: record.interestRoundingFactor != null ? String(record.interestRoundingFactor) : "",
  implemented: record.implemented ?? "N",
  nomineeRequired: record.nomineeRequired ?? "N",
  cashTransactionAllowed: record.cashTransactionAllowed ?? "Y",
  inwardClearingAllowed: record.inwardClearingAllowed ?? "Y",
});

const ADD_REQUIRED_KEYS = [
  "accountType",
  "accountTypeDescription",
  "productCode",
  "description",
  "copyFrom",
  "copyFromDescription",
  "glAccountCode",
  "glAccountDescription",
  "defaultMinimumBalanceId",
  "maxCashLimit",
  "maxWithdrawalLimit",
  "interestRoundingFactor",
];

const EDIT_REQUIRED_KEYS = [
  "accountType",
  "accountTypeDescription",
  "productCode",
  "description",
  "defaultMinimumBalanceId",
  "interestRoundingFactor",
];

function TextField({ label, labelHi, icon: Icon, value, onChange, placeholder, error, readOnly }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <span className="font-medium text-gray-500 dark:text-slate-400"> / {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div
        className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
          error
            ? "border-red-400"
            : readOnly
              ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
        }`}
      >
        <Icon size={18} className="shrink-0 text-[#6B7280]" />
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
            readOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">This field is required</p>}
    </div>
  );
}

function PicklistTriggerField({ label, labelHi, icon: Icon, value, placeholder, error, onOpen, readOnly }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <span className="font-medium text-gray-500 dark:text-slate-400"> / {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`flex h-11 flex-1 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
            error
              ? "border-red-400"
              : readOnly
                ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                : "border-[#B8C2D6] dark:border-slate-700"
          }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280]" />
          <span className={`ml-3 truncate text-[15px] ${value ? "text-[#4B5563] dark:text-slate-100" : "text-[#7C879B] dark:text-slate-500"}`}>
            {value || placeholder}
          </span>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${label} list`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary transition-colors hover:bg-primary-200 dark:bg-primary-950/40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="5" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="12" cy="19" r="1.2" />
            </svg>
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">This field is required</p>}
    </div>
  );
}

function RadioField({ label, labelHi, value, onChange, disabled }) {
  return (
    <div>
      <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
        {label}
        <br />
        <span className="text-[13px] font-medium text-gray-500 dark:text-slate-400">{labelHi}</span>
      </label>
      <div className="flex h-11 items-center gap-6">
        {[
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              checked={value === opt.value}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ProductParameterModal({ mode = "add", initialData = null, onClose, onSave }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";
  const meta = MODAL_META[mode];
  const requiredKeys = isAdd ? ADD_REQUIRED_KEYS : EDIT_REQUIRED_KEYS;

  const [form, setForm] = useState(() => (initialData ? formFromRecord(initialData) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [picklist, setPicklist] = useState(null); // "accountType" | "copyFrom" | "glAccountCode"
  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [glAccounts, setGlAccounts] = useState([]);
  const [glAccountsPage, setGlAccountsPage] = useState(1);
  const [picklistLoading, setPicklistLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  // Opening a picklist never calls the API — results only load once the user
  // presses Submit inside the picklist's own search form.
  const openPicklist = (which) => {
    setPicklist(which);
  };

  const handleCopyFromSearch = async (searchBy, textToSearch) => {
    setPicklistLoading(true);
    try {
      const all = await fetchProducts();
      const q = textToSearch.trim().toLowerCase();
      const filtered = !q
        ? all
        : all.filter((p) =>
            searchBy === "DESCRIPTION"
              ? p.description.toLowerCase().includes(q)
              : p.productCode.toLowerCase().includes(q)
          );
      setProducts(filtered);
      setProductsPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setPicklistLoading(false);
    }
  };

  const handleGlAccountSearch = async (searchBy, textToSearch) => {
    setPicklistLoading(true);
    try {
      setGlAccounts(await searchGlAccounts({ searchBy, textToSearch }));
      setGlAccountsPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setPicklistLoading(false);
    }
  };

  const handleValidate = () => {
    const nextErrors = {};
    requiredKeys.forEach((key) => {
      if (!form[key]?.toString().trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    setValidated(Object.keys(nextErrors).length === 0);
  };

  const handleSave = async () => {
    if (!validated || saving) return;
    setSaving(true);
    try {
      const product = {
        productCode: form.productCode,
        description: form.description,
        shortDescription: form.description.slice(0, 10),
        accountType: form.accountType,
        implemented: form.implemented,
        cashTransactionAllowed: form.cashTransactionAllowed,
        defaultMinimumBalanceId: Number(form.defaultMinimumBalanceId) || 0,
        interestRoundingFactor: Number(form.interestRoundingFactor) || 0,
        nomineeRequired: form.nomineeRequired,
        inwardClearingAllowed: form.inwardClearingAllowed,
        panCardAllowed: "N",
        individual: "N",
      };
      if (isAdd) {
        await onSave({ product, glAccountCode: form.glAccountCode });
      } else {
        await onSave({ product });
      }
      onClose();
    } catch {
      // onSave surfaces the error; keep the modal open so the user can retry.
    } finally {
      setSaving(false);
    }
  };

  const applyCopyFrom = (product) => {
    setForm((prev) => ({
      ...prev,
      copyFrom: product.productCode,
      copyFromDescription: product.description,
      accountType: product.accountType,
      accountTypeDescription: ACCOUNT_TYPES.find((a) => a.code === product.accountType)?.description ?? product.accountType,
      defaultMinimumBalanceId: String(product.defaultMinimumBalanceId ?? ""),
      interestRoundingFactor: String(product.interestRoundingFactor ?? ""),
      implemented: product.implemented ?? prev.implemented,
      cashTransactionAllowed: product.cashTransactionAllowed ?? prev.cashTransactionAllowed,
      nomineeRequired: product.nomineeRequired ?? prev.nomineeRequired,
      inwardClearingAllowed: product.inwardClearingAllowed ?? prev.inwardClearingAllowed,
    }));
    setPicklist(null);
  };

  const HeaderIcon = meta.useImage ? null : meta.Icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            {meta.useImage ? (
              <Image src={IMAGES.ADD_ICON} alt="" width={50} height={50} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <HeaderIcon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {meta.titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {meta.titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {meta.subtitleEn} / {meta.subtitleHi}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <PicklistTriggerField
              label="Account Type"
              labelHi="खाते प्रकार"
              icon={UserRound}
              value={form.accountType}
              placeholder="Select Account Type"
              error={errors.accountType}
              readOnly={isView}
              onOpen={() => openPicklist("accountType")}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.accountTypeDescription}
              readOnly
              placeholder="Enter Account Type Description"
              error={errors.accountTypeDescription}
              onChange={() => {}}
            />

            <TextField
              label="Product Code"
              labelHi="उत्पादन कोड"
              icon={ShieldCheck}
              value={form.productCode}
              placeholder="Enter Product Code"
              error={errors.productCode}
              readOnly={isView || isEdit}
              onChange={(v) => update("productCode", v)}
            />
            <TextField
              label="Description"
              labelHi="वर्णन"
              icon={FileText}
              value={form.description}
              placeholder="Enter Product Code Description"
              error={errors.description}
              readOnly={isView}
              onChange={(v) => update("description", v)}
            />

            {isAdd && (
              <>
                <PicklistTriggerField
                  label="Copy From"
                  labelHi="यावरून प्रत तयार करा"
                  icon={Copy}
                  value={form.copyFrom}
                  placeholder="Select Copy From"
                  error={errors.copyFrom}
                  onOpen={() => openPicklist("copyFrom")}
                />
                <TextField
                  label="Description"
                  labelHi="वर्णन"
                  icon={FileText}
                  value={form.copyFromDescription}
                  readOnly
                  placeholder="Enter Copy From Description"
                  error={errors.copyFromDescription}
                  onChange={() => {}}
                />

                <PicklistTriggerField
                  label="GL Account Code"
                  labelHi="जीएल खाते कोड"
                  icon={UserRound}
                  value={form.glAccountCode}
                  placeholder="Select GL Account Code"
                  error={errors.glAccountCode}
                  onOpen={() => openPicklist("glAccountCode")}
                />
                <TextField
                  label="Description"
                  labelHi="वर्णन"
                  icon={FileText}
                  value={form.glAccountDescription}
                  readOnly
                  placeholder="Enter GL Account Code Description"
                  error={errors.glAccountDescription}
                  onChange={() => {}}
                />
              </>
            )}

            <TextField
              label="Default Minimum Balance ID"
              labelHi="डीफॉल्ट किमान शिल्लक ID"
              icon={Coins}
              value={form.defaultMinimumBalanceId}
              placeholder="Enter Default Minimum Balance ID"
              error={errors.defaultMinimumBalanceId}
              readOnly={isView}
              onChange={(v) => update("defaultMinimumBalanceId", v)}
            />
            {isAdd ? (
              <TextField
                label="Max Cash Limit"
                labelHi="कमाल रोख मर्यादा"
                icon={Coins}
                value={form.maxCashLimit}
                placeholder="Enter Max Cash Limit"
                error={errors.maxCashLimit}
                onChange={(v) => update("maxCashLimit", v)}
              />
            ) : (
              <TextField
                label="Interest Rounding Factor"
                labelHi="व्याज गोलाई घटक"
                icon={Percent}
                value={form.interestRoundingFactor}
                placeholder="Enter Interest Rounding Factor"
                error={errors.interestRoundingFactor}
                readOnly={isView}
                onChange={(v) => update("interestRoundingFactor", v)}
              />
            )}

            {isAdd && (
              <>
                <TextField
                  label="Max Withdrawal Limit"
                  labelHi="कमाल पैसे काढण्याची मर्यादा"
                  icon={Coins}
                  value={form.maxWithdrawalLimit}
                  placeholder="Enter Max Withdrawal Limit"
                  error={errors.maxWithdrawalLimit}
                  onChange={(v) => update("maxWithdrawalLimit", v)}
                />
                <TextField
                  label="Interest Rounding Factor"
                  labelHi="व्याज गोलाई घटक"
                  icon={Percent}
                  value={form.interestRoundingFactor}
                  placeholder="Enter Interest Rounding Factor"
                  error={errors.interestRoundingFactor}
                  onChange={(v) => update("interestRoundingFactor", v)}
                />
              </>
            )}

            <RadioField
              label="Is Implemented"
              labelHi="अंमलात आणले आहे का"
              value={form.implemented}
              disabled={isView}
              onChange={(v) => update("implemented", v)}
            />
            <RadioField
              label="Is Nominee Required"
              labelHi="नामनिर्देशित व्यक्ती आवश्यक आहे का"
              value={form.nomineeRequired}
              disabled={isView}
              onChange={(v) => update("nomineeRequired", v)}
            />

            <RadioField
              label="Is Cash Transaction Allowed"
              labelHi="रोख व्यवहारास परवानगी आहे का"
              value={form.cashTransactionAllowed}
              disabled={isView}
              onChange={(v) => update("cashTransactionAllowed", v)}
            />
            <RadioField
              label="Is Inward Clearing Allowed"
              labelHi="आवक क्लिअरिंगस परवानगी आहे का"
              value={form.inwardClearingAllowed}
              disabled={isView}
              onChange={(v) => update("inwardClearingAllowed", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {isView ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
              >
                Cancel <X size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleValidate}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Validate <Check size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel <X size={16} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={!validated || saving}
                  onClick={() => validated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated && !saving
                      ? "bg-primary-100 text-primary hover:bg-primary-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  {saving ? "Saving..." : "Save"} <ChevronDown size={16} />
                </button>
                {saveMenuOpen && validated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        handleSave();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {picklist === "accountType" && (
        <PicklistModal
          title="Select Account Type"
          columns={[
            { key: "code", header: "Account Type", width: "180px" },
            { key: "description", header: "Description" },
          ]}
          rows={ACCOUNT_TYPES}
          rowKey={(row) => row.code}
          onSelect={(row) => {
            setForm((prev) => ({ ...prev, accountType: row.code, accountTypeDescription: row.description }));
            setPicklist(null);
          }}
          onClose={() => setPicklist(null)}
        />
      )}

      {picklist === "copyFrom" && (
        <PicklistModal
          title="Select Copy From"
          columns={[
            { key: "productCode", header: "Product Code", width: "160px" },
            { key: "description", header: "Description" },
            { key: "accountType", header: "Account Type", width: "140px" },
          ]}
          rows={products.slice((productsPage - 1) * PAGE_SIZE, productsPage * PAGE_SIZE)}
          rowKey={(row) => row.productCode}
          loading={picklistLoading}
          emptyMessage="No products found"
          searchByOptions={[
            { label: "Product Code", value: "PRODUCT_CODE" },
            { label: "Description", value: "DESCRIPTION" },
          ]}
          onSearchSubmit={handleCopyFromSearch}
          onSelect={applyCopyFrom}
          onClose={() => setPicklist(null)}
          pagination={{
            page: productsPage,
            totalPages: Math.max(1, Math.ceil(products.length / PAGE_SIZE)),
            onPageChange: setProductsPage,
          }}
        />
      )}

      {picklist === "glAccountCode" && (
        <PicklistModal
          title="Select GL Account Code"
          columns={[
            { key: "glAccountCode", header: "GL Account Code", width: "200px" },
            { key: "description", header: "Description" },
          ]}
          rows={glAccounts.slice((glAccountsPage - 1) * PAGE_SIZE, glAccountsPage * PAGE_SIZE)}
          rowKey={(row) => row.glAccountCode}
          loading={picklistLoading}
          emptyMessage="No GL accounts found"
          searchByOptions={[
            { label: "GL Account Code", value: "GL_ACCOUNT_CODE" },
            { label: "Description", value: "DESCRIPTION" },
          ]}
          onSearchSubmit={handleGlAccountSearch}
          onSelect={(row) => {
            setForm((prev) => ({ ...prev, glAccountCode: row.glAccountCode, glAccountDescription: row.description }));
            setPicklist(null);
          }}
          onClose={() => setPicklist(null)}
          pagination={{
            page: glAccountsPage,
            totalPages: Math.max(1, Math.ceil(glAccounts.length / PAGE_SIZE)),
            onPageChange: setGlAccountsPage,
          }}
        />
      )}
    </div>
  );
}
