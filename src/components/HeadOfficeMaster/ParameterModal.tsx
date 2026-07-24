// @ts-nocheck
import { IMAGES } from "@/assets";
import { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen } from "lucide-react";
import { getMasterConfig, getFieldIcon, emptyFormData } from "./masterConfig";
import { validateBranchAccount, saveBranchAccount, updateBranchAccount } from "@/api/headoffice.api";

const MODAL_META = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    icon: IMAGES.ADD_ICON,
    useImage: true,
  },
  edit: {
    titleEn: "Edit Parameter",
    titleHi: "पॅरामीटर संपादित करा",
    subtitleEn: "Review and update the details below as needed.",
    subtitleHi: "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा.",
    icon: SquarePen,
    useImage: false,
  },
  view: {
    titleEn: "View Parameter",
    titleHi: "पॅरामीटर पहा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    icon: UserRound,
    useImage: false,
  },
};

const ParameterModal = ({
  mode = "add",
  masterKey,
  initialData = {},
  onClose,
  onSave,
}) => {
  const config = getMasterConfig(masterKey);
  const meta = MODAL_META[mode];
  const [formData, setFormData] = useState(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
    setValidationResult(null);
  }, [initialData, mode, masterKey]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleValidate = async () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      if (!formData[field.key]?.toString().trim()) {
        newErrors[field.key] = true;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Call validation API for defaultBranchAccounts
    if (masterKey === "defaultBranchAccounts") {
      try {
        setIsValidating(true);
        const result = await validateBranchAccount({
          branchCode: formData.branchCode,
          inwardClearingAccountCode: formData.inwardClearingAccountCode,
          outwardClearingAccountCode: formData.outwardClearingAccountCode,
        });
        setValidationResult(result);

        // Auto-fill form with validation response data (add only — in edit mode this
        // would overwrite the user's edited values with the existing saved mapping)
        if (result.addModifyEnabled && !isEdit) {
          setFormData((prev) => ({
            ...prev,
            inwardClearingAccountCode: result.inwardClearingAccountCode,
            outwardClearingAccountCode: result.outwardClearingAccountCode,
          }));
        }

        setValidated(result.addModifyEnabled);
      } catch (error) {
        console.error("Validation failed:", error);
        setValidationResult({ message: "Validation failed. Please try again.", addModifyEnabled: false });
      } finally {
        setIsValidating(false);
      }
    } else {
      setValidated(true);
    }
  };

  const resetForNewEntry = () => {
    setFormData(emptyFormData(masterKey));
    setValidated(false);
    setValidationResult(null);
    setErrors({});
  };

  const handleSave = async (keepOpen = false) => {
    if (!validated || isSaving) return;
    setSaveMenuOpen(false);

    // Call save/update API for defaultBranchAccounts
    if (masterKey === "defaultBranchAccounts") {
      try {
        setIsSaving(true);
        if (isEdit) {
          await updateBranchAccount(formData.branchCode, {
            inwardClearingAccountCode: formData.inwardClearingAccountCode,
            outwardClearingAccountCode: formData.outwardClearingAccountCode,
          });
        } else {
          await saveBranchAccount({
            branchCode: formData.branchCode,
            inwardClearingAccountCode: formData.inwardClearingAccountCode,
            outwardClearingAccountCode: formData.outwardClearingAccountCode,
          });
        }
        await onSave?.(formData);
        if (keepOpen) {
          resetForNewEntry();
        } else {
          onClose();
        }
      } catch (error) {
        console.error("Save failed:", error);
        setValidationResult({ message: "Save failed. Please try again.", addModifyEnabled: false });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(formData);
      if (keepOpen) {
        resetForNewEntry();
      } else {
        onClose();
      }
    } catch {
      // onSave is responsible for surfacing the error; keep the modal open so the user can retry.
    } finally {
      setIsSaving(false);
    }
  };

  const HeaderIcon = meta.useImage ? null : meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            {meta.useImage ? (
              <Image src={meta.icon} alt="" width={50} height={50} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <HeaderIcon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {meta.titleEn}{" "}
                <span className="font-bold text-[#64748B] dark:text-slate-400">/ {meta.titleHi}</span>
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
          {(() => {
            const isReadOnly = isView;
            const renderTextField = (field) => {
              const Icon = getFieldIcon(field.icon);
              const fieldReadOnly = isReadOnly || (isEdit && field.readOnlyOnEdit);
              const hasError = errors[field.key];
              return (
                <div key={field.key}>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    {field.labelEn}
                    <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
                      hasError
                        ? "border-red-400"
                        : fieldReadOnly
                          ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-[#6B7280]" />
                    <input
                      type="text"
                      value={formData[field.key] ?? ""}
                      readOnly={fieldReadOnly}
                      placeholder={field.placeholder}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
                        fieldReadOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                      }`}
                    />
                  </div>
                  {hasError && (
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  )}
                </div>
              );
            };

            const renderRadioField = (field) => {
              const fieldReadOnly = isReadOnly || (isEdit && field.readOnlyOnEdit);
              const value = formData[field.key] ?? "N";
              return (
                <div key={field.key}>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    {field.labelEn}
                    <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
                  </label>
                  <div className="flex h-11 items-center gap-6">
                    {[
                      { label: "Yes", value: "Y" },
                      { label: "No", value: "N" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 ${fieldReadOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name={field.key}
                          checked={value === opt.value}
                          disabled={fieldReadOnly}
                          onChange={() => handleChange(field.key, opt.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            };

            const renderSelectField = (field) => {
              const Icon = getFieldIcon(field.icon);
              const fieldReadOnly = isReadOnly || (isEdit && field.readOnlyOnEdit);
              const hasError = errors[field.key];
              return (
                <div key={field.key}>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    {field.labelEn}
                    <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
                      hasError
                        ? "border-red-400"
                        : fieldReadOnly
                          ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-[#6B7280]" />
                    <select
                      value={formData[field.key] ?? ""}
                      disabled={fieldReadOnly}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`ml-3 w-full appearance-none bg-transparent text-[15px] outline-none ${
                        formData[field.key] ? "text-[#4B5563] dark:text-slate-100" : "text-[#7C879B] dark:text-slate-500"
                      } ${fieldReadOnly ? "text-slate-500 dark:text-slate-400" : ""}`}
                    >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>
                      {(field.options ?? []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="shrink-0 text-[#6B7280]" />
                  </div>
                  {hasError && (
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  )}
                </div>
              );
            };

            const renderDateField = (field) => {
              const Icon = getFieldIcon(field.icon);
              const fieldReadOnly = isReadOnly || (isEdit && field.readOnlyOnEdit);
              const hasError = errors[field.key];
              return (
                <div key={field.key}>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    {field.labelEn}
                    <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
                      hasError
                        ? "border-red-400"
                        : fieldReadOnly
                          ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-[#6B7280]" />
                    <input
                      type="date"
                      value={formData[field.key] ?? ""}
                      readOnly={fieldReadOnly}
                      disabled={fieldReadOnly}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
                        fieldReadOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] dark:text-slate-100"
                      }`}
                    />
                  </div>
                  {hasError && (
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  )}
                </div>
              );
            };

            const renderField = (field) => {
              if (field.type === "radio") return renderRadioField(field);
              if (field.type === "select") return renderSelectField(field);
              if (field.type === "date") return renderDateField(field);
              return renderTextField(field);
            };

            const consumed = new Set();
            const items = [];
            config.fields.forEach((field) => {
              if (consumed.has(field.key)) return;

              if (field.pairWith) {
                const pairField = config.fields.find((f) => f.key === field.pairWith);
                consumed.add(field.pairWith);
                items.push(
                  <div key={field.key} className="mb-4 grid grid-cols-1 gap-4 last:mb-0 md:grid-cols-2">
                    {renderField(field)}
                    {pairField && renderField(pairField)}
                  </div>
                );
                return;
              }

              items.push(
                <div key={field.key} className="mb-4 last:mb-0">
                  {renderField(field)}
                </div>
              );
            });
            return items;
          })()}

          {/* Validation Result Display for defaultBranchAccounts */}
          {masterKey === "defaultBranchAccounts" && validationResult && (
            <div
              className={`mt-4 rounded-lg border p-4 ${
                validationResult.addModifyEnabled
                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
              }`}
            >
              {validationResult.branchName && (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Branch Name:</span> {validationResult.branchName}
                </p>
              )}
              <p
                className={`mt-1 text-sm ${
                  validationResult.addModifyEnabled ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}
              >
                {validationResult.message}
              </p>
              {validationResult.existingMapping && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Existing mapping found</p>
              )}
            </div>
          )}
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
                disabled={isValidating}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                  isValidating ? "cursor-not-allowed bg-slate-400" : "bg-primary hover:bg-primary-700"
                }`}
              >
                {isValidating ? "Validating..." : "Validate"} <Check size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel <X size={16} />
              </button>
              {isEdit ? (
                <button
                  type="button"
                  disabled={!validated || isSaving}
                  onClick={() => handleSave(false)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated && !isSaving
                      ? "bg-primary-100 text-primary hover:bg-primary-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"} <Check size={16} />
                </button>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    disabled={!validated || isSaving}
                    onClick={() => validated && !isSaving && setSaveMenuOpen((o) => !o)}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      validated && !isSaving
                        ? "bg-primary-100 text-primary hover:bg-primary-200"
                        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save"} <ChevronDown size={16} />
                  </button>
                  {saveMenuOpen && validated && !isSaving && (
                    <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => handleSave(false)}
                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(true)}
                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Save & New
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterModal;
