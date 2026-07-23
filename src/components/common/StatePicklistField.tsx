import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import PicklistField from "./PicklistField";
import { fetchStates, type StateRecord } from "@/lib/masterMaintenanceApi";
import StatePicklistModal from "./StatePicklistModal";

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
  /** Fires with the selected state */
  onSelect: (state: StateRecord) => void;
  /** Pre-fetch states on mount (default: false) */
  preFetch?: boolean;
}

const COLUMNS = [
  { key: "stateCode", header: "State Code" },
  { key: "stateName", header: "State Name", width: "180px" },
  { key: "countryCode", header: "Country Code" },
];

const SEARCH_BY_OPTIONS = [
  { label: "Code", value: "CODE" },
  { label: "State Name", value: "STATE_NAME" },
  { label: "Country Code", value: "COUNTRY_CODE" },
];

export default function StatePicklistField({
  label = "State",
  labelHi,
  icon,
  value,
  placeholder = "Select State",
  required,
  readOnly = false,
  disabled = false,
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
    if (preFetch && !loaded && !loading && !readOnly && !disabled) {
      fetchStates({ searchBy: "CODE", textToSearch: "" })
        .then((list) => {
          setStates(list);
          setLoaded(true);
        })
        .catch(() => setLoadError("Failed to pre-load states"))
        .finally(() => setLoading(false));
    }
  }, [preFetch, readOnly, disabled]);

  const openPicklist = () => {
    // Don't open if readOnly or disabled
    if (readOnly || disabled) return;

    setOpen(true);
    if (loaded || loading) return;

    setLoading(true);
    setLoadError("");
    fetchStates({ searchBy: "CODE", textToSearch: "" })
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

  const handleSearchSubmit = (
    searchBy: "CODE" | "STATE_NAME" | "COUNTRY_CODE",
    textToSearch: string,
  ) => {
    // Don't search if readOnly or disabled
    if (readOnly || disabled) return;

    setLoading(true);
    setLoadError("");

    const payload = {
      searchBy,
      textToSearch,
    };

    fetchStates(payload)
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

  return (
    <>
      <PicklistField
        label={label}
        labelHi={labelHi}
        icon={icon}
        value={displayValue}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        error={error}
        onOpenPicklist={openPicklist}
      />
      {open && !readOnly && !disabled && (
        <StatePicklistModal
          title=""
          columns={COLUMNS}
          rows={states}
          rowKey={(row) => row.stateCode || row.stateName}
          searchByOptions={SEARCH_BY_OPTIONS}
          onSearchSubmit={handleSearchSubmit}
          loading={loading}
          emptyMessage={loadError || "No states found"}
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
