import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import PicklistField from "./PicklistField";
import PicklistModal from "./PicklistModal";
import { fetchStates, type StateRecord } from "@/lib/masterMaintenanceApi";

export interface StatePicklistFieldProps {
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
  onSelect: (state: StateRecord) => void;
  /** Pre-fetch countries on mount (default: false) */
  preFetch?: boolean;
}

const COLUMNS = [
  { key: "stateName", header: "State Name" },
  { key: "stateCode", header: "State Code", width: "180px" },
];

// PicklistModal's radio "value" (lowercase, matches column keys) mapped to
// whatever the API expects in the "searchBy" field.
const SEARCH_BY_OPTIONS = [
  { label: "Code", value: "stateCode" },
  { label: "Name", value: "stateName" },
];

const SEARCH_BY_API_MAP: Record<string, string> = {
  stateCode: "CODE",
  name: "NAME",
};

export default function StatePicklistField({
  label = "State",
  labelHi,
  icon,
  value,
  placeholder = "Select State",
  required,
  readOnly,
  disabled,
  error,
  onSelect,
  preFetch = false,
}: StatePicklistFieldProps) {
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState<StateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Pre-fetch on mount if enabled
  useEffect(() => {
    if (preFetch && !loaded && !loading) {
      fetchStates()
        .then((list) => {
          setStates(list);
          setLoaded(true);
        })
        .catch(() => setLoadError("Failed to pre-load countries"))
        .finally(() => setLoading(false));
    }
  }, [preFetch]);

  const openPicklist = () => {
    setOpen(true);
    if (loaded || loading) return;

    setLoading(true);
    setLoadError("");
    fetchStates()
      .then((list) => {
        if (list.length === 0) {
          setLoadError("No states available");
        } else {
          setStates(list);
          setLoaded(true);
        }
      })
      .catch((err) => {
        setLoadError(err.message || "Failed to load states");
      })
      .finally(() => setLoading(false));
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

    fetchStates()
      .then((list) => {
        setStates(list);
        if (list.length === 0) {
          setLoadError("No states found");
        }
      })
      .catch((err) => {
        setLoadError(err.message || "Search failed");
      })
      .finally(() => setLoading(false));
  };

  // Find display name for current value
  const displayValue =
    states.find((c) => c.stateCode === value)?.stateName || value;

  console.log(value);

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
        <PicklistModal<StateRecord>
          title=""
          columns={COLUMNS}
          rows={states}
          rowKey={(row) => row.stateCode || row.stateName}
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
