import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import PicklistField from "../common/PicklistField";
import PicklistModal from "../common/PicklistModal";
import { fetchCountries, type CountryOption } from "@/api/globalmaster.api";

export interface CountryPicklistFieldProps {
  label?: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  /** Fires with the selected country's name and code. */
  onSelect: (country: CountryOption) => void;
  /** Pre-fetch countries on mount (default: false) */
  preFetch?: boolean;
}

const COLUMNS = [
  { key: "name", header: "Country Name" },
  { key: "code", header: "Country Code", width: "180px" },
];

// PicklistModal's radio "value" (lowercase, matches column keys) mapped to
// whatever the API expects in the "searchBy" field.
const SEARCH_BY_OPTIONS = [
  { label: "Code", value: "code" },
  { label: "Name", value: "name" },
];

const SEARCH_BY_API_MAP: Record<string, string> = {
  code: "CODE",
  name: "NAME",
};

export default function CountryPicklistField({
  label = "Country",
  labelHi,
  icon,
  value,
  placeholder = "Select Country",
  required,
  readOnly,
  disabled,
  error,
  onSelect,
  preFetch = false,
}: CountryPicklistFieldProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Pre-fetch on mount if enabled
  useEffect(() => {
    if (preFetch) {
      setLoading(true);
      fetchCountries()
        .then((list) => setCountries(list))
        .catch(() => setLoadError("Failed to pre-load countries"))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preFetch]);

  const openPicklist = () => {
    setOpen(true);
  };

  // Called when the user clicks "Submit" inside the picklist modal.
  // searchBy comes in as "code" | "name" (from SEARCH_BY_OPTIONS values);
  // textToSearch is exactly what the user typed into the input.
  const handleSearchSubmit = (searchBy: string, textToSearch: string) => {
    setLoading(true);
    setLoadError("");

    const payload = {
      searchBy: SEARCH_BY_API_MAP[searchBy] ?? searchBy.toUpperCase(),
      textToSearch,
    };

    fetchCountries(payload)
      .then((list) => {
        setCountries(list);
        if (list.length === 0) {
          setLoadError("No countries found");
        }
      })
      .catch((err) => {
        setLoadError(err.message || "Search failed");
      })
      .finally(() => setLoading(false));
  };

  // Find display name for current value
  const displayValue = countries.find(c => c.code === value)?.name || value;

  return (
    <>
      <PicklistField
        label={label}
        labelHi={labelHi}
        icon={icon}
        value={displayValue} // Show name instead of code
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        error={error}
        onOpenPicklist={openPicklist}
      />
      {open && (
        <PicklistModal<CountryOption>
          title=""
          columns={COLUMNS}
          rows={countries}
          rowKey={(row) => row.code || row.name}
          searchByOptions={SEARCH_BY_OPTIONS}
          onSearchSubmit={handleSearchSubmit}
          loading={loading}
          emptyMessage={loadError || "No countries found"}
          onSelect={(row) => {
            onSelect(row);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}