import { useEffect, useState, type FC, type ReactNode } from "react";
import {
  X,
  Check,
  Landmark,
  ScrollText,
  UserRound,
  FileText,
  RotateCcw,
  ClipboardList,
  ArrowLeftRight,
  Banknote,
  CalendarCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileInput,
  Inbox,
  AlertTriangle,
  Send,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import ListModal from "@/components/AccountMaster/ListModal";
import {
  CLEARING_PICKERS,
  getClearingMaster,
  type ClearingField,
  type ClearingPickerKey,
} from "./masterConfig";
import { TextField, AmountField, DateField, ReadOnlyField, PickerField } from "./ClearingFields";

const ICON_MAP: Record<string, FC<{ size?: number }>> = {
  ScrollText,
  ArrowLeftRight,
  Banknote,
  Landmark,
  ClipboardList,
  CalendarCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileInput,
  Inbox,
  AlertTriangle,
  Send,
};

const SECTION_ICON_MAP: Record<string, FC<{ size?: number }>> = {
  branchInformation: Landmark,
  clearingDetails: ScrollText,
  customerAccountDetails: UserRound,
  instrumentDetails: FileText,
  returnDetails: RotateCcw,
  details: ClipboardList,
};

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const SectionCard: FC<{ titleKey: string; subtitleKey?: string; children: ReactNode }> = ({
  titleKey,
  subtitleKey,
  children,
}) => {
  const { en, t } = useBilingual();
  const segment = titleKey.split(".").slice(-2, -1)[0];
  const Icon = SECTION_ICON_MAP[segment] ?? ClipboardList;
  return (
    <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
            {en(titleKey)}
            {t(titleKey) ? <span className="font-normal text-slate-500 dark:text-slate-400"> / {t(titleKey)}</span> : null}
          </h3>
          {subtitleKey && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {en(subtitleKey)}
              {t(subtitleKey) ? ` / ${t(subtitleKey)}` : ""}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

interface ClearingFormModalProps {
  masterKey: string;
  mode?: "entry" | "authorize";
  initialData?: Record<string, string>;
  onClose: () => void;
  onSave?: (data: Record<string, string>) => void;
  onAuthorize?: (data: Record<string, string>) => void;
  onReject?: (data: Record<string, string>, reason: string) => void;
}

const ClearingFormModal: FC<ClearingFormModalProps> = ({
  masterKey,
  mode = "entry",
  initialData,
  onClose,
  onSave,
  onAuthorize,
  onReject,
}) => {
  const { en, t } = useBilingual();
  const master = getClearingMaster(masterKey);
  const isAuthorize = mode === "authorize";

  const allFields: ClearingField[] = master ? master.sections.flatMap((s) => s.fields) : [];

  const buildDefaults = (): Record<string, string> => {
    const defaults: Record<string, string> = {};
    allFields.forEach((field) => {
      defaults[field.key] = "";
    });
    return { ...defaults, ...initialData };
  };

  const [formData, setFormData] = useState<Record<string, string>>(buildDefaults);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [validated, setValidated] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [authorizeResult, setAuthorizeResult] = useState<"authorized" | "rejected" | null>(null);
  const [activePicker, setActivePicker] = useState<ClearingPickerKey | null>(null);
  const [activePickerFieldKey, setActivePickerFieldKey] = useState<string | null>(null);

  // Reload form state whenever the master/mode/initialData changes — e.g.
  // reusing one mounted modal instance for different rows from a table.
  useEffect(() => {
    setFormData(buildDefaults());
    setErrors({});
    setValidated(false);
    setActivePicker(null);
    setActivePickerFieldKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterKey, mode, initialData]);

  if (!master) return null;

  const handleChange = (key: string, value: string) => {
    if (isAuthorize) return; // authorize mode is strictly read-only
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  };

  const openPicker = (field: ClearingField) => {
    if (isAuthorize) return; // no picking in authorize mode
    if (!field.picker) return;
    setActivePicker(field.picker);
    setActivePickerFieldKey(field.key);
  };

  const derivedFieldFor = (codeFieldKey: string): string | null => {
    const idx = allFields.findIndex((f) => f.key === codeFieldKey);
    const next = allFields[idx + 1];
    return next && next.type === "readonly" ? next.key : null;
  };

  const handlePick = (row: { code: string; name: string }) => {
    if (!activePickerFieldKey) return;
    const nameField = derivedFieldFor(activePickerFieldKey);
    setFormData((prev) => ({
      ...prev,
      [activePickerFieldKey]: row.code,
      ...(nameField ? { [nameField]: row.name } : {}),
    }));
    setValidated(false);
    setErrors((prev) => ({
      ...prev,
      [activePickerFieldKey]: false,
      ...(nameField ? { [nameField]: false } : {}),
    }));
    setActivePicker(null);
    setActivePickerFieldKey(null);
  };

  const runValidation = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    allFields.forEach((field) => {
      if (!formData[field.key]?.toString().trim()) newErrors[field.key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleValidate = () => {
    runValidation();
  };

  const handleSave = () => {
    if (!validated) return;
    const isValid = runValidation();
    if (!isValid) return;
    onSave?.(formData);
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

  const handleAuthorize = () => {
    onAuthorize?.(formData);
    setAuthorizeResult("authorized");
  };

  const handleReject = () => setShowRejectReason(true);

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    onReject?.(formData, reason);
    setAuthorizeResult("rejected");
  };

  const handleAuthorizeDone = () => {
    setAuthorizeResult(null);
    onClose();
  };

  const renderField = (field: ClearingField) => {
    const value = formData[field.key] ?? "";
    const hasError = errors[field.key];

    // "readonly"-type fields (derived/lookup values) are always displayed
    // via ReadOnlyField, in every mode. Everything else keeps its normal
    // component but goes into a disabled/locked state during Authorize —
    // same layout, value still visible, just not editable.
    switch (field.type) {
      case "readonly":
        return <ReadOnlyField key={field.key} labelKey={field.labelKey} value={value} />;
      case "picker":
        return (
          <PickerField
            key={field.key}
            labelKey={field.labelKey}
            value={value}
            hasError={hasError}
            disabled={isAuthorize}
            onOpen={() => openPicker(field)}
          />
        );
      case "date":
        return (
          <DateField
            key={field.key}
            labelKey={field.labelKey}
            value={value}
            hasError={hasError}
            disabled={isAuthorize}
            onChange={(v) => handleChange(field.key, v)}
          />
        );
      case "amount":
        return (
          <AmountField
            key={field.key}
            labelKey={field.labelKey}
            value={value}
            hasError={hasError}
            disabled={isAuthorize}
            onChange={(v) => handleChange(field.key, v)}
          />
        );
      default:
        return (
          <TextField
            key={field.key}
            labelKey={field.labelKey}
            value={value}
            hasError={hasError}
            disabled={isAuthorize}
            onChange={(v) => handleChange(field.key, v)}
          />
        );
    }
  };

  const HeaderIcon = ICON_MAP[master.icon] ?? Landmark;
  const activePickerConfig = activePicker ? CLEARING_PICKERS[activePicker] : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
        <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <HeaderIcon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                  {en(master.modalTitleKey)}{" "}
                  {t(master.modalTitleKey) ? (
                    <span className="font-bold text-[#64748B] dark:text-slate-400">/ {t(master.modalTitleKey)}</span>
                  ) : null}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {en(master.modalSubtitleKey)}
                  {t(master.modalSubtitleKey) ? ` / ${t(master.modalSubtitleKey)}` : ""}
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
          {master.sections.map((section, idx) => (
            <SectionCard key={idx} titleKey={section.titleKey} subtitleKey={section.subtitleKey}>
              <div className={`grid grid-cols-1 gap-x-8 gap-y-5 ${COLUMN_CLASS[section.columns]}`}>
                {section.fields.map(renderField)}
              </div>
            </SectionCard>
          ))}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            {isAuthorize ? (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  {en("Reject")} <ThumbsDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                >
                  {en("common.cancel")} <X size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleAuthorize}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  {en("common.authorize")} <ThumbsUp size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleValidate}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  {en("common.validate")} <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                >
                  {en("common.cancel")} <X size={16} />
                </button>
                <button
                  type="button"
                  disabled={!validated}
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    validated
                      ? "bg-primary text-white hover:bg-primary-700"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  {en(master.primaryActionLabelKey)} <Check size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {activePickerConfig && (
        <ListModal
          title={en(activePickerConfig.titleKey)}
          columns={activePickerConfig.columnKeys.map((c) => ({ key: c.key, label: en(c.labelKey) }))}
          rows={activePickerConfig.rows}
          onSelect={handlePick}
          onClose={() => {
            setActivePicker(null);
            setActivePickerFieldKey(null);
          }}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={en(master.successTitleKey)}
          subtitle=""
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}

      {showRejectReason && (
        <RejectReasonModal
          onClose={() => setShowRejectReason(false)}
          onConfirm={handleConfirmReject}
        />
      )}

      {authorizeResult === "authorized" && (
        <SuccessModal
          variant="success"
          title={`${en(master.cardTitleKey)} Authorized Successfully`}
          subtitle=""
          onClose={handleAuthorizeDone}
          onDone={handleAuthorizeDone}
        />
      )}

      {authorizeResult === "rejected" && (
        <SuccessModal
          variant="critical"
          title={`${en(master.cardTitleKey)} Authorization Rejected`}
          subtitle=""
          onClose={handleAuthorizeDone}
          onDone={handleAuthorizeDone}
        />
      )}
    </>
  );
};

export default ClearingFormModal;