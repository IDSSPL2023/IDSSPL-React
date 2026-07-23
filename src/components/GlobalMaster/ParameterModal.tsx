// @ts-nocheck
import { IMAGES } from "@/assets";
import { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen, ChevronRight } from "lucide-react";
import { getMasterConfig, getFieldIcon } from "./masterConfig";

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

const RadioField = ({ field, value, onChange, readOnly, hasError }) => (
  <div className="flex gap-6 pt-1">
    {(field.options || ["Yes", "No"]).map((opt) => (
      <label
        key={opt}
        className={`flex items-center gap-2 text-sm ${readOnly ? "cursor-default text-slate-500 dark:text-slate-400" : "cursor-pointer text-gray-700 dark:text-slate-300"}`}
      >
        <input
          type="radio"
          name={field.key}
          value={opt}
          checked={value === opt}
          disabled={readOnly}
          onChange={() => onChange(opt)}
          className="h-4 w-4 accent-primary"
        />
        {opt}
      </label>
    ))}
  </div>
);

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

  const formCols = config.formColumns || 1;
  const maxWidth = formCols >= 3 ? "max-w-6xl" : "max-w-2xl";

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
    setSaveMenuOpen(false);
  }, [initialData, mode, masterKey]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      const val = formData[field.key];
      if (field.type === "radio") {
        if (!val) newErrors[field.key] = true;
      } else if (!val?.toString().trim()) {
        newErrors[field.key] = true;
      }
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  const HeaderIcon = meta.useImage ? null : meta.icon;

  const renderField = (field) => {
    const Icon = getFieldIcon(field.icon);
    const isReadOnly = isView || (isEdit && field.readOnlyOnEdit);
    const hasError = errors[field.key];
    const fieldType = field.type || "text";

    return (
      <div key={field.key} className="mb-4 last:mb-0">
        <label className="mb-1.5 block text-[15px] font-semibold text-[#1F2858] dark:text-slate-100">
          {field.labelEn}
          <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
          <span className="text-red-500">*</span>
        </label>

        {fieldType === "radio" ? (
          <RadioField
            field={field}
            value={formData[field.key] ?? "No"}
            onChange={(v) => handleChange(field.key, v)}
            readOnly={isReadOnly}
            hasError={hasError}
          />
        ) : fieldType === "select" ? (
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white px-3 dark:bg-slate-900 ${
              hasError ? "border-red-400" : isReadOnly ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" : "border-[#B8C2D6] dark:border-slate-700"
            }`}
          >
            <Icon size={18} className="shrink-0 text-[#6B7280]" />
            <select
              value={formData[field.key] ?? ""}
              disabled={isReadOnly}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`ml-3 w-full bg-transparent text-[15px] outline-none ${isReadOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] dark:text-slate-100"}`}
            >
              <option value="">{field.placeholder}</option>
              {(field.options || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {!isReadOnly && <ChevronRight size={16} className="rotate-90 text-gray-400" />}
          </div>
        ) : (
          <div
            className={`flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
              hasError
                ? "border-red-400"
                : isReadOnly
                  ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
            }`}
          >
            <Icon size={18} className="shrink-0 text-[#6B7280]" />
            <input
              type="text"
              value={formData[field.key] ?? ""}
              readOnly={isReadOnly}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`ml-3 w-full bg-transparent text-[15px] outline-none ${
                isReadOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
              }`}
            />
          </div>
        )}
        {hasError && <p className="mt-1 text-xs text-red-500">This field is required</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900`}>
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
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border-2 border-t-4 border-primary p-5">
          <div className={`grid gap-x-4 ${formCols >= 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
            {config.fields.map(renderField)}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {isView ? (
            <>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
                Cancel <X size={16} />
              </button>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Validate <Check size={16} />
              </button>
              <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
                Cancel <X size={16} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={!validated}
                  onClick={() => validated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  Save <ChevronDown size={16} />
                </button>
                {saveMenuOpen && validated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button type="button" onClick={handleSave} className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800">Save</button>
                    <button type="button" onClick={handleSave} className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800">Save & New</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterModal;
