import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import BaseModal from "./BaseModal";
import PaginationModal from "./PaginationModal";
import type { PaginationState } from "./table.types";
import { StateRecord } from "@/api/globalmaster.api";

export interface PicklistColumn {
  key: string;
  header: string;
  width?: string;
  render?: (row: StateRecord) => ReactNode;
  isAction?: boolean;
}

export interface StatePicklistModalProps {
  title: string;
  onClose: () => void;
  onSelect: (row: StateRecord) => void;
  columns: PicklistColumn[];
  rows: StateRecord[];
  rowKey: (row: StateRecord) => string | number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationState;
  actions?: {
    label: string;
    icon?: ReactNode;
    onClick: (row: StateRecord) => void;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning";
    show?: (row: StateRecord) => boolean;
  }[];
  showDefaultAction?: boolean;
  actionColumnWidth?: string;
  searchByOptions?: { label: string; value: string }[];
  onSearchSubmit?: (
    searchBy: "CODE" | "STATE_NAME" | "COUNTRY_CODE",
    textToSearch: string,
  ) => void;
  searchByValue?: "CODE" | "STATE_NAME" | "COUNTRY_CODE";
  onSearchByChange?: (value: string) => void;
  textToSearch?: string;
  onTextToSearchChange?: (value: string) => void;
}

export default function StatePicklistModal({
  title,
  onClose,
  onSelect,
  columns,
  rows,
  rowKey,
  searchValue,
  onSearchChange,
  loading = false,
  emptyMessage = "No records found",
  pagination,
  actions = [],
  showDefaultAction = true,
  actionColumnWidth = "120px",
  searchByOptions = [
    { label: "State Code", value: "CODE" },
    { label: "State Name", value: "STATE_NAME" },
    { label: "Country Code", value: "COUNTRY_CODE" },
  ],
  onSearchSubmit,
  searchByValue,
  onSearchByChange,
  textToSearch,
  onTextToSearchChange,
}: StatePicklistModalProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSearchBy, setInternalSearchBy] = useState(
    searchByValue || "CODE",
  );
  const [internalTextToSearch, setInternalTextToSearch] = useState(
    textToSearch ?? "",
  );

  const isControlled = searchValue !== undefined;
  const search = isControlled ? searchValue! : internalSearch;
  const setSearch = isControlled ? onSearchChange! : setInternalSearch;

  const isSearchByControlled = searchByValue !== undefined;
  const searchBy = isSearchByControlled ? searchByValue! : internalSearchBy;
  const setSearchBy = (value: string) => {
    if (isSearchByControlled) {
      onSearchByChange?.(value);
    } else {
      setInternalSearchBy(value as "CODE" | "STATE_NAME" | "COUNTRY_CODE");
    }
    // Clear text search when changing search by
    setTextSearch("");
  };

  const isTextControlled = textToSearch !== undefined;
  const textSearch = isTextControlled ? textToSearch! : internalTextToSearch;
  const setTextSearch = (value: string) => {
    if (isTextControlled) {
      onTextToSearchChange?.(value);
    } else {
      setInternalTextToSearch(value);
    }
  };

  const handleSearchSubmit = () => {
    if (onSearchSubmit) {
      onSearchSubmit(
        searchBy as "CODE" | "STATE_NAME" | "COUNTRY_CODE",
        textSearch,
      );
    } else {
      if (!textSearch.trim()) {
        setSearch("");
        return;
      }
      const searchTerm = `${searchBy}:${textSearch}`;
      setSearch(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    const q = search.trim().toLowerCase();
    const colonIndex = q.indexOf(":");

    if (colonIndex > 0) {
      const searchByKey = q.substring(0, colonIndex);
      const searchTerm = q.substring(colonIndex + 1);

      // Map searchBy to actual field names
      const fieldMap: Record<string, string> = {
        CODE: "stateCode",
        STATE_NAME: "stateName",
        COUNTRY_CODE: "countryCode",
      };

      const actualField = fieldMap[searchByKey] || searchByKey;

      return rows.filter((row) => {
        const value = (row as any)[actualField];
        return (
          value !== undefined &&
          String(value).toLowerCase().includes(searchTerm)
        );
      });
    }

    // Search across all fields
    return rows.filter((row) =>
      columns.some((col) => {
        const value = (row as any)[col.key];
        return value !== undefined && String(value).toLowerCase().includes(q);
      }),
    );
  }, [rows, search, columns]);

  const hasActions = actions.length > 0 || showDefaultAction;

  const getVariantStyles = (variant: string = "primary") => {
    const styles = {
      primary: "bg-primary-50 text-primary hover:bg-primary-100",
      secondary: "bg-gray-50 text-gray-700 hover:bg-gray-100",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
      success: "bg-green-50 text-green-600 hover:bg-green-100",
      warning: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
    };
    return styles[variant as keyof typeof styles] || styles.primary;
  };

  const renderActions = (row: StateRecord) => {
    if (actions.length === 0 && showDefaultAction) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(row);
          }}
          className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
        >
          Select
        </button>
      );
    }

    if (actions.length > 0) {
      const visibleActions = actions.filter(
        (action) => !action.show || action.show(row),
      );

      if (visibleActions.length === 0) return null;

      return (
        <div className="flex items-center gap-1.5">
          {visibleActions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${getVariantStyles(action.variant)}`}
              title={action.label}
            >
              {action.icon ? (
                <span className="flex items-center gap-1">
                  {action.icon}
                  <span className="sr-only">{action.label}</span>
                </span>
              ) : (
                action.label
              )}
            </button>
          ))}
          {showDefaultAction && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(row);
              }}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary-100"
            >
              Select
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const getPlaceholder = () => {
    if (searchBy === "CODE") return "Enter State Code";
    if (searchBy === "COUNTRY_CODE") return "Enter Country Code";
    return "Enter State Name";
  };

  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={841}
      ariaLabel={title}
      contentClassName="rounded-[36px] p-6 min-h-[600px] max-h-[952px]"
      bodyClassName="flex flex-1 flex-col overflow-hidden"
      showCloseButton={false}
    >
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#DCEBFC] opacity-70 blur-[1px]" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#DCEBFC] opacity-70 blur-[1px]" />

        <div className="relative z-10 flex flex-col gap-6 rounded-[20px] px-2">
          {/* Search Section */}
          <div className="w-full border border-gray-500 text-sm">
            {/* Search By Row */}
            <div className="flex border-b border-gray-600">
              <div className="w-48 border-r border-gray-600 bg-[#DCEBFC] px-3 py-2 font-semibold">
                Search By
              </div>
              <div className="flex flex-1 items-center gap-6 bg-[#DCEBFC] px-3 py-2">
                {searchByOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="searchBy"
                      value={option.value}
                      checked={searchBy === option.value}
                      onChange={(e) => {
                        setSearchBy(e.target.value);
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Text To Search Row */}
            <div className="flex">
              <div className="w-48 border-r border-gray-600 bg-[#DCEBFC] px-3 py-2 font-semibold">
                Text To Search
              </div>
              <div className="flex flex-1 items-center gap-2 bg-[#DCEBFC] p-2">
                <input
                  type="text"
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getPlaceholder()}
                  className="flex-1 border border-gray-400 px-2 py-1 outline-none"
                />
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="border border-gray-500 bg-gray-200 px-4 py-1 hover:bg-gray-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="relative z-10 mt-6 flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-300">
          {/* Table Header */}
          <div className="flex h-[46px] shrink-0 items-center bg-[#DCEBFC]">
            {columns.map((col) => (
              <div
                key={col.key}
                className="truncate px-4 text-sm font-semibold text-gray-700"
                style={{ width: col.width, flex: col.width ? undefined : 1 }}
              >
                {col.header}
              </div>
            ))}
            {hasActions && (
              <div
                className="shrink-0 truncate px-4 text-sm font-semibold text-gray-700"
                style={{ width: actionColumnWidth }}
              >
                Action
              </div>
            )}
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-[64px] items-center justify-center text-sm text-gray-400">
                Loading…
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex h-[64px] items-center justify-center text-sm text-gray-400">
                {emptyMessage}
              </div>
            ) : (
              filteredRows.map((row) => (
                <div
                  key={rowKey(row)}
                  className="flex h-[64px] items-center border-b border-gray-200 px-0 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelect(row)}
                >
                  {columns.map((col) => {
                    const value = (row as any)[col.key];
                    return (
                      <div
                        key={col.key}
                        className="truncate px-4 text-sm text-gray-800"
                        style={{
                          width: col.width,
                          flex: col.width ? undefined : 1,
                        }}
                      >
                        {col.render ? col.render(row) : String(value ?? "")}
                      </div>
                    );
                  })}
                  {hasActions && (
                    <div
                      className="shrink-0 px-4"
                      style={{ width: actionColumnWidth }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {renderActions(row)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {pagination && (
          <div className="relative z-10 mt-4 shrink-0">
            <PaginationModal
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
