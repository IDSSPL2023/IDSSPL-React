// CityPicklistField.tsx

import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import FormField, { READONLY_FIELD_CLASSES } from "./FormField";
import PicklistField from "./PicklistField";
import PicklistModal from "./PicklistModal";
import { fetchCities, type CityRecord } from "@/api/globalmaster.api";

export interface CityPicklistFieldProps {
  label?: string;
  labelHi?: string;
  icon?: ReactNode;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  /** Fires with the selected city's name and code. */
  onSelect: (city: CityRecord) => void;
  /** Pre-fetch cities on mount (default: false) */
  preFetch?: boolean;
  /** Optional: Filter cities by country code */
  countryCode?: string;
}

const COLUMNS = [
  { key: "name", header: "City Name" },
  { key: "cityCode", header: "City Code", width: "180px" },
];

// PicklistModal's radio "value" (lowercase, matches column keys) mapped to
// whatever the API expects in the "searchBy" field.
const SEARCH_BY_OPTIONS = [
  { label: "Code", value: "cityCode" },
  { label: "Name", value: "name" },
];

// Map frontend search values to API expected values
const SEARCH_BY_API_MAP: Record<string, "CODE" | "NAME"> = {
  cityCode: "CODE",
  name: "NAME",
};

const PAGE_SIZE = 10;

export default function CityPicklistField({
  label = "City",
  labelHi,
  icon,
  value,
  placeholder = "Select City",
  required,
  readOnly,
  disabled,
  error,
  onSelect,
  preFetch = false,
  countryCode,
}: CityPicklistFieldProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);

  const displayedCities = filteredCities.length > 0 ? filteredCities : cities;
  const totalPages = Math.max(1, Math.ceil(displayedCities.length / PAGE_SIZE));
  const pagedCities = useMemo(
    () => displayedCities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [displayedCities, page],
  );

  // Pre-fetch on mount if enabled
  useEffect(() => {
    if (preFetch && !loaded && !loading) {
      loadCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preFetch]);

  const loadCities = async () => {
    setLoading(true);
    setLoadError("");
    
    try {
      // Fetch all cities (empty search)
      const list = await fetchCities({ searchBy: "NAME", textToSearch: "" });
      
      // Filter by country code if provided
      let filtered = list;
      if (countryCode) {
        filtered = list.filter(city => city.countryCode === countryCode);
      }
      
      if (filtered.length === 0) {
        setLoadError(countryCode ? "No cities found for this country" : "No cities available");
      } else {
        setCities(list);
        setFilteredCities(filtered);
        setLoaded(true);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  // Opening the picklist never calls the API — results only load once the
  // user presses Submit inside the picklist's own search form (or, if
  // preFetch is enabled, once on mount).
  const openPicklist = () => {
    setOpen(true);
    setPage(1);
  };

  // Called when the user clicks "Submit" inside the picklist modal.
  const handleSearchSubmit = async (searchBy: string, textToSearch: string) => {
    setLoading(true);
    setLoadError("");

    try {
      // Map the searchBy value to API expected format
      const apiSearchBy = SEARCH_BY_API_MAP[searchBy] ?? "NAME";
      
      // Call API with search parameters
      const list = await fetchCities({
        searchBy: apiSearchBy,
        textToSearch: textToSearch.trim(),
      });
      
      // Apply country filter if provided
      let filtered = list;
      if (countryCode) {
        filtered = filtered.filter(city => city.countryCode === countryCode);
      }
      
      setFilteredCities(filtered);
      setCities(list);
      setPage(1);
      
      if (filtered.length === 0) {
        setLoadError("No cities found matching your search");
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Find display name for current value
  const displayValue = cities.find(c => c.cityCode === value || c.name === value)?.name || value;

  // View and authorization screens must show a plain read-only field rather
  // than a disabled picklist button.
  if (readOnly) {
    const field = (
      <div className={`flex h-11 items-center gap-2 rounded-lg border px-3 ${READONLY_FIELD_CLASSES}`}>
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <span className={`w-full min-w-0 truncate text-sm ${displayValue ? "text-slate-700" : "text-slate-400"}`}>
          {displayValue || placeholder}
        </span>
      </div>
    );

    return label ? (
      <FormField label={label} labelHi={labelHi} required={required} error={error}>{field}</FormField>
    ) : field;
  }

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
      {open && (
        <PicklistModal<CityRecord>
          title=""
          columns={COLUMNS}
          rows={pagedCities}
          rowKey={(row) => row.cityCode || row.name}
          searchByOptions={SEARCH_BY_OPTIONS}
          onSearchSubmit={handleSearchSubmit}
          loading={loading}
          emptyMessage={loadError || "No cities found"}
          pagination={{ page, totalPages, onPageChange: setPage }}
          modalHeightClassName="h-[930px]"
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
