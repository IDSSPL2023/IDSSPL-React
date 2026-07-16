import { useState } from "react";
import { X, UserRound, MoreVertical, IndianRupee, FileText, ChevronDown } from "lucide-react";
import { getFormSectionsConfig } from "./masterConfig";
import ListModal from "../AccountMaster/ListModal"; // adjust path to wherever ListModal actually lives
import SuccessModal from "../shared/SuccessModal";
import ModalFooterActions from "./ModalFooterActions";

const FIELD_ICONS = {
  picker: UserRound,
  readonly: UserRound,
  text: FileText,
  amount: IndianRupee,
};

/**
 * Generic "one or more bordered form sections, each a grid of fields, with
 * Validate / Cancel / Display" modal. Driven entirely by FORM_SECTIONS_CONFIG
 * in masterConfig.js — any master flagged `uiType: "formSections"` can reuse
 * this without a new component. Supports picker-backed lookup fields (with
 * derived read-only fields), free text, amount, date and select fields.
 */
const FormSectionsModal = ({ masterKey, onClose, onSave }) => {
  const config = getFormSectionsConfig(masterKey);

  const [formData, setFormData] = useState(() => {
    const defaults = {};
    (config?.sections ?? []).forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === "select" && field.options?.length) {
          defaults[field.key] = field.options[0].value;
        }
      });
    });
    return defaults;
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const allFields = config ? config.sections.flatMap((s) => s.fields) : [];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
    setValidated(false);
  };

  const handlePick = (pickerKey, row) => {
    const picker = config.pickers[pickerKey];
    setFormData((prev) => {
      const next = { ...prev, [picker.setField]: row[picker.valueKey ?? "code"] };
      Object.entries(picker.deriveMap ?? {}).forEach(([rowKey, targetField]) => {
        next[targetField] = row[rowKey];
      });
      return next;
    });
    setErrors((prev) => ({ ...prev, [picker.setField]: false }));
    setValidated(false);
    setActivePicker(null);
  };

  const validateForm = () => {
    const newErrors = {};
    allFields.forEach((field) => {
      if (field.type === "readonly" || field.required === false) return;
      const value = formData[field.key];
      if (!value || !value.toString().trim()) {
        newErrors[field.key] = true;
      } else if (field.type === "amount" && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
        newErrors[field.key] = true;
      }
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleDisplay = () => {
    console.log("Display clicked with formData:", formData);
    if (!validated) return;
    onSave?.(formData);
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

  if (!config) return null;

  const renderField = (field) => {
    const Icon = FIELD_ICONS[field.type] ?? FileText;
    const hasError = errors[field.key];
    const value = formData[field.key] ?? "";

    if (field.type === "readonly") {
      return (
        <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
          <Icon size={18} className="shrink-0 text-[#6B7280]" />
          <input
            type="text"
            readOnly
            value={value}
            placeholder={field.placeholder ?? "Auto-filled"}
            className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
          />
        </div>
      );
    }

    if (field.type === "picker") {
      return (
        <div className="flex items-center gap-2">
          <div className={`flex h-11 flex-1 items-center rounded-lg border px-3 ${hasError ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
            <Icon size={18} className="shrink-0 text-[#6B7280]" />
            <input
              type="text"
              readOnly
              value={value}
              placeholder={field.placeholder ?? `Enter ${field.labelEn}`}
              onClick={() => setActivePicker(field.picker)}
              className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            title={`Search ${field.labelEn}`}
            onClick={() => setActivePicker(field.picker)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full appearance-none rounded-lg border border-[#B8C2D6] bg-white px-3 py-2.5 pr-9 text-sm text-[#1F2858] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.labelEn}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm ${hasError ? "border-red-400" : "border-[#B8C2D6]"} bg-white text-[#1F2858] outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
        />
      );
    }

    // text / amount
    return (
      <div className={`flex h-11 items-center rounded-lg border px-3 ${hasError ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
        <Icon size={18} className="shrink-0 text-[#6B7280]" />
        <input
          type="text"
          inputMode={field.type === "amount" ? "decimal" : "text"}
          value={value}
          placeholder={field.placeholder ?? (field.type === "amount" ? "Enter Amount" : `Enter ${field.labelEn}`)}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={`ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500 ${field.type === "amount" ? "text-right" : ""}`}
        />
      </div>
    );
  };

  const activePickerConfig = activePicker ? config.pickers[activePicker] : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
        <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <UserRound size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                  {config.titleEn}{" "}
                  <span className="font-bold text-[#64748B] dark:text-slate-400">/ {config.titleHi}</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.subtitleEn} / {config.subtitleHi}
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

          {/* Sections */}
          {config.sections.map((section, idx) => (
            <div
              key={idx}
              className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900"
            >
              {section.titleEn && (
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                    <UserRound size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
                      {section.titleEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {section.titleHi}</span>
                    </h3>
                    {section.subtitleEn && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {section.subtitleEn} / {section.subtitleHi}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
                  section.columns === 3 ? "lg:grid-cols-3" : section.columns === 4 ? "lg:grid-cols-4" : ""
                }`}
              >
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                      {field.labelEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {field.labelHi}</span>
                      {field.required !== false && field.type !== "readonly" && <span className="text-red-500"> *</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.key] && <p className="mt-1 text-xs text-red-500">This field is required</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <ModalFooterActions
            onValidate={validateForm}
            onCancel={onClose}
            onDisplay={handleDisplay}
            canDisplay={validated}
          />
        </div>
      </div>

      {activePickerConfig && (
        <ListModal
          title={activePickerConfig.titleEn}
          columns={activePickerConfig.columns}
          rows={activePickerConfig.rows}
          onSelect={(row) => handlePick(activePicker, row)}
          onClose={() => setActivePicker(null)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={`${config.titleEn} Modified Successfully`}
          subtitle="The details have been updated successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </>
  );
};

export default FormSectionsModal;