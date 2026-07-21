import { useState } from "react";
import { X, Filter as FilterIcon } from "lucide-react";
import BaseModal from "./BaseModal";
import type { FilterFieldDef, FilterValues } from "./filter.types";

export interface FilterModalProps {
  fields: FilterFieldDef[];
  initialValues?: FilterValues;
  onApply: (values: FilterValues) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const buildDefaults = (fields: FilterFieldDef[]): FilterValues =>
  Object.fromEntries(fields.map((f) => [f.id, ""]));

/**
 * Generic, schema-driven filter dialog: left selectable filter options, right
 * dynamic input panel per field `type`. Target: 1159x718, 36px radius,
 * border-t-4/border-2 primary, `shadow-[0_0_8px_#0000005C]`, 4px backdrop blur.
 */
export default function FilterModal({
  fields,
  initialValues,
  onApply,
  onClose,
  title = "Filter",
  subtitle = "Use filter for fast and efficient searching",
}: FilterModalProps) {
  const defaults = buildDefaults(fields);
  const [activeFieldId, setActiveFieldId] = useState(fields[0]?.id ?? "");
  const [values, setValues] = useState<FilterValues>({ ...defaults, ...initialValues });

  const active = fields.find((f) => f.id === activeFieldId);

  const setValue = (id: string, value: string) => setValues((prev) => ({ ...prev, [id]: value }));

  const handleClearAll = () => {
    setValues(defaults);
    onApply(defaults);
    onClose();
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <BaseModal
      onClose={onClose}
      size="lg"
      ariaLabel={title}
      overlayClassName="backdrop-blur-[4px]"
      contentClassName="rounded-[36px] border-2 border-t-4 border-primary shadow-[0_0_8px_#0000005C] min-h-[550px]"
      bodyClassName="px-8 py-8"
    >
      <div className="relative">
        <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC]" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
            <FilterIcon size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>
        </div>

        <div className="relative z-10 mt-5 border-b border-gray-200" />

        <div className="relative z-10 mt-8 flex items-start gap-0">
          <div className="flex w-full max-w-[470px] flex-col gap-4">
            {fields.map((field) => {
              const isActive = activeFieldId === field.id;
              return (
                <div key={field.id} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveFieldId(field.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                      isActive ? "border-primary bg-[#E8F1FD]" : "border-primary bg-white"
                    }`}
                  >
                    {field.icon}
                    <span className="text-lg font-medium text-gray-900">{field.label}</span>
                  </button>

                  {isActive && (
                    <div className="absolute -right-9 flex h-10 w-10 items-center justify-center">
                      <div className="h-0 w-0 border-y-[18px] border-l-[24px] border-y-transparent border-l-[#DCEBFC]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ml-10 flex min-h-[220px] w-full flex-col justify-center rounded-2xl bg-[#DCEBFC] p-6">
            {active && (
              <>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{active.label}</h3>
                <FilterFieldPanel field={active} value={values[active.id] ?? ""} onChange={(v) => setValue(active.id, v)} />
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-10 flex justify-center gap-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-full border border-primary px-8 py-3 font-semibold text-primary hover:bg-[#F2F8FE]"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
          >
            Apply
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

function FilterFieldPanel({
  field,
  value,
  onChange,
}: {
  field: FilterFieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "custom" && field.render) {
    return <>{field.render(value, onChange)}</>;
  }

  if (field.type === "status" || field.type === "select") {
    const options = field.options ?? [];
    return (
      <div className="flex flex-wrap items-center gap-6">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              checked={value === opt.value}
              onChange={() => onChange(value === opt.value ? "" : opt.value)}
            />
            <span className="ml-2 text-gray-900">{opt.label}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-4 py-3">
      {field.icon}
      <input
        type={field.type === "date" ? "date" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>
  );
}
