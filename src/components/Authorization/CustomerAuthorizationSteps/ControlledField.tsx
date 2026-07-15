import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { FieldShell, TextInput, SelectInput, DateInput } from "@/components/shared/FormFields";

interface ControlledFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelHi?: string;
  required?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  options?: string[];
  kind?: "text" | "select" | "date";
}

export default function ControlledField<T extends FieldValues>({
  control,
  name,
  label,
  labelHi,
  required = true,
  icon,
  placeholder,
  options,
  kind = "text",
}: ControlledFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field, fieldState }) => (
        <FieldShell label={label} labelHi={labelHi} required={required} error={!!fieldState.error}>
          {kind === "select" ? (
            <SelectInput
              icon={icon}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              options={options ?? []}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          ) : kind === "date" ? (
            <DateInput
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          ) : (
            <TextInput
              icon={icon}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
              error={!!fieldState.error}
            />
          )}
        </FieldShell>
      )}
    />
  );
}
