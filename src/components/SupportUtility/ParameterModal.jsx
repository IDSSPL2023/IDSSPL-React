import { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { X, Check, ChevronDown, ThumbsUp, UserRound, SquarePen } from "lucide-react";
import { getMasterConfig, getFieldIcon } from "./masterConfig";
import SuccessModal from "../shared/SuccessModal.tsx"; // adjust path to wherever your SuccessModal lives

const MODAL_META = {
  add: {
    titleEn: "Add New Parameter",
    titleHi: "नवीन मापदंड जोडा",
    subtitleEn: "Fill in the details below to create a new parameter.",
    subtitleHi: "नवीन पॅरामीटर जोडण्यासाठी खालील तपशील प्रविष्ट करा.",
    icon: "/add-icn.png",
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

  // NEW: controls the SuccessModal, and which flow triggered it
  // ("save" -> close both modals & notify parent, "saveAndNew" -> reset the form and keep this modal open)
  const [successOpen, setSuccessOpen] = useState(false);
  const [saveIntent, setSaveIntent] = useState(null);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, mode, masterKey]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false); // any edit invalidates the previous validation
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Returns true only if every required field is actually filled
  const runValidation = () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      if (!formData[field.key]?.toString().trim()) {
        newErrors[field.key] = true;
      }
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleValidate = () => {
    runValidation();
  };

  // Shared save routine used by both "Save" and "Save & New"
  const performSave = (intent) => {
    setSaveMenuOpen(false);

    // Re-run validation defensively in case formData changed without
    // re-clicking Validate (guards against stale `validated` state).
    const isValid = runValidation();
    if (!isValid) return;

    onSave?.(formData);
    setSaveIntent(intent);
    setSuccessOpen(true);
  };

  const handleSave = () => performSave("save");
  const handleSaveAndNew = () => performSave("saveAndNew");

  const handleSuccessDone = () => {
    setSuccessOpen(false);

    if (saveIntent === "saveAndNew") {
      // Reset form so the user can add another parameter without closing the modal
      setFormData({});
      setValidated(false);
      setErrors({});
    } else {
      onClose();
    }
    setSaveIntent(null);
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
          {config.fields.map((field) => {
            const Icon = getFieldIcon(field.icon);
            const isReadOnly =
              isView || (isEdit && field.readOnlyOnEdit);
            const hasError = errors[field.key];

            return (
              <div key={field.key} className="mb-4 last:mb-0">
                <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                  {field.labelEn}
                  <span className="font-medium text-gray-500 dark:text-slate-400"> / {field.labelHi}</span>
                  <span className="text-red-500">*</span>
                </label>
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
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>
            );
          })}
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
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
              <div className="relative">
                <button
                  type="button"
                  disabled={!validated}
                  onClick={() => validated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated
                      ? "bg-primary text-white hover:bg-primary-700"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  Save <ChevronDown size={16} />
                </button>
                {saveMenuOpen && validated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndNew}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save & New
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success modal, shown after a real, validated save */}
      {successOpen  (
        <SuccessModal
          variant="success"
          title={mode === "add" ? "Parameter Added Successfully" : "Parameter Updated Successfully"}
          subtitle=""
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default ParameterModal;