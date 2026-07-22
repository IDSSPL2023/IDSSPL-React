import { useEffect, useState } from "react";
import { SquarePen, UserRound } from "lucide-react";
import Image from "@/components/ui/Image";
import {
  NormalFormModal,
  TextField,
  SelectField,
  RadioGroupField,
  validateFields,
  isFormValid,
  required,
  type Validator,
} from "@/components/common";
import { getMasterConfig, getFieldIcon, type MasterField } from "./masterConfig";

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
} as const;

interface MasterParameterModalProps {
  mode: "add" | "edit";
  masterKey: string;
  initialData: Record<string, string>;
  onClose: () => void;
  onSave: (formData: Record<string, string>) => void;
}

export default function MasterParameterModal({ mode, masterKey, initialData, onClose, onSave }: MasterParameterModalProps) {
  const config = getMasterConfig(masterKey);
  const meta = MODAL_META[mode];
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [validated, setValidated] = useState(false);
  const [loadingField, setLoadingField] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setValidated(false);
  }, [initialData, mode, masterKey]);

  const isEdit = mode === "edit";

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleDropdownFocus = (field: MasterField) => {
    if (!field.loadOptions || loadingField === field.key) return;
    setLoadingField(field.key);
    field.loadOptions().finally(() => setLoadingField(null));
  };

  const handleValidate = () => {
    const rules: Partial<Record<string, Validator>> = {};
    config.fields.forEach((field) => {
      rules[field.key] = required();
    });
    const nextErrors = validateFields(formData, rules);
    setErrors(nextErrors);
    setValidated(isFormValid(nextErrors));
  };

  const handleSave = () => {
    if (!validated) return;
    onSave(formData);
  };

  const formCols = config.formColumns || 1;
  const gridClass = formCols >= 3 ? "grid grid-cols-1 gap-x-4 md:grid-cols-3" : "grid grid-cols-1 gap-x-4";

  const renderField = (field: MasterField) => {
    const Icon = getFieldIcon(field.icon);
    const isReadOnly = isEdit && field.readOnlyOnEdit;
    const value = formData[field.key] ?? "";
    const error = errors[field.key];

    if (field.type === "radio") {
      return (
        <div key={field.key} className="mb-4 last:mb-0">
          <RadioGroupField
            label={field.labelEn}
            labelHi={field.labelHi}
            value={value || "No"}
            onChange={(v) => handleChange(field.key, v)}
            options={field.options ?? ["Yes", "No"]}
            disabled={isReadOnly}
            required
            error={error}
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key} className="mb-4 last:mb-0">
          <SelectField
            label={field.labelEn}
            labelHi={field.labelHi}
            icon={<Icon size={18} />}
            value={value}
            onChange={(v) => handleChange(field.key, v)}
            onFocus={() => handleDropdownFocus(field)}
            options={field.options ?? []}
            placeholder={loadingField === field.key ? "Loading..." : field.placeholder}
            required
            readOnly={isReadOnly}
            error={error}
          />
        </div>
      );
    }

    return (
      <div key={field.key} className="mb-4 last:mb-0">
        <TextField
          label={field.labelEn}
          labelHi={field.labelHi}
          icon={<Icon size={18} />}
          value={value}
          onChange={(v) => handleChange(field.key, v)}
          placeholder={field.placeholder}
          required
          readOnly={isReadOnly}
          error={error}
        />
      </div>
    );
  };

  return (
    <NormalFormModal
      onClose={onClose}
      titleEn={meta.titleEn}
      titleHi={meta.titleHi}
      subtitleEn={meta.subtitleEn}
      subtitleHi={meta.subtitleHi}
      headerIcon={
        meta.useImage ? (
          <Image src={meta.icon} alt="" width={50} height={50} />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary">
            {meta.icon === SquarePen ? <SquarePen size={24} /> : <UserRound size={24} />}
          </div>
        )
      }
      onValidate={handleValidate}
      onSave={handleSave}
      isValid={validated}
    >
      <div className={gridClass}>{config.fields.map(renderField)}</div>
    </NormalFormModal>
  );
}
