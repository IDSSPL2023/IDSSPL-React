import React from "react";
import TextInput from "@/components/shared/Inputs/TextInput";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import { LucideIcon } from "lucide-react";

export interface FormField {
  id: string;
  type: "text" | "picker" | "select";
  labelEn: string;
  labelHi: string;
  icon: LucideIcon | string;
  placeholder: string;
  key: string;
  readOnly?: boolean;
  required?: boolean;
  options?: string[];
  handleOpenList?: () => void;
}

interface ReusableFormProps {
  fields: FormField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  columns?: number;
}

function ReusableForm({
  fields,
  values,
  onChange,
  columns = 3,
}: ReusableFormProps) {
  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.id}
            labelEn={field.labelEn}
            labelHi={field.labelHi}
            icon={field.icon}
            placeholder={field.placeholder}
            value={values[field.key] || ""}
            onChange={(v) => onChange(field.key, v)}
            readOnly={field.readOnly || false}
            required={field.required || false}
          />
        );

      case "picker":
        return (
          <PickerInput
            key={field.id}
            labelEn={field.labelEn}
            labelHi={field.labelHi}
            icon={field.icon}
            placeholder={field.placeholder}
            value={values[field.key] || ""}
            onChange={(v) => onChange(field.key, v)}
            readOnly={field.readOnly || false}
            handleOpenList={field.handleOpenList || (() => {})}
          />
        );

      default:
        return null;
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-4`}>
      {fields.map((field) => renderField(field))}
    </div>
  );
}

export default ReusableForm;