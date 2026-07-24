import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { PicklistField, PicklistModal } from "../common";
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
  /** Optional country code to filter cities by country */
  countryCode?: string;
  /** Fires with the selected city's name and code. */
  onSelect: (city: CityRecord) => void;
  /** Pre-fetch cities on mount (default: false) */
  preFetch?: boolean;
}

// Updated columns to match CountryPicklistField pattern
const COLUMNS = [
  { key: "name", header: "City Name" },
  { key: "cityCode", header: "City Code", width: "200px" },
];
// const COLUMNS = [
//   { key: "name", header: "Country Name" },
//   { key: "code", header: "Country Code", width: "180px" },
// ];

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
  countryCode,
  onSelect,
  preFetch = false,
}: CityPicklistFieldProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Pre-fetch on mount if enabled
  useEffect(() => {
    if (preFetch && !loaded && !loading) {
      fetchCities()
        .then((list) => {
          const filtered = countryCode 
            ? list.filter(city => city.countryCode === countryCode)
            : list;
          setCities(filtered);
          setLoaded(true);
        })
        .catch(() => setLoadError("Failed to pre-load cities"))
        .finally(() => setLoading(false));
    }
  }, [preFetch, countryCode]);

  // Reset loaded state when countryCode changes
  useEffect(() => {
    if (preFetch) {
      setLoaded(false);
      setCities([]);
    }
  }, [countryCode, preFetch]);

  const openPicklist = () => {
    setOpen(true);
    if (loaded || loading) return;
    
    setLoading(true);
    setLoadError("");
    fetchCities()
      .then((list) => {
        const filtered = countryCode 
          ? list.filter(city => city.countryCode === countryCode)
          : list;
        
        if (filtered.length === 0) {
          setLoadError(countryCode ? "No cities available for this country" : "No cities available");
        } else {
          setCities(filtered);
          setLoaded(true);
        }
      })
      .catch((err) => {
        setLoadError(err.message || "Failed to load cities");
      })
      .finally(() => setLoading(false));
  };

  const displayValue = cities.find(c => c.cityCode === value)?.name || value;

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
          title="Select City"
          columns={COLUMNS}
          rows={cities}
          rowKey={(row) => row.cityCode || row.name}
          searchPlaceholder="Search city"
          loading={loading}
          emptyMessage={loadError || "No cities found"}
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