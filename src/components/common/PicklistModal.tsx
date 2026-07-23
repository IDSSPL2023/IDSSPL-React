import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import BaseModal from "./BaseModal";
import PaginationModal from "./PaginationModal";
import type { PaginationState } from "./table.types";

export interface PicklistColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
  isAction?: boolean;
}

export interface PicklistModalProps<T> {
  title: string;
  onClose: () => void;
  onSelect: (row: T) => void;
  columns: PicklistColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationState;
  // Action configuration
  actions?: {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    show?: (row: T) => boolean;
  }[];
  showDefaultAction?: boolean;
  actionColumnWidth?: string;
  // Search by configuration
  searchByOptions?: { label: string; value: string }[];
  onSearchSubmit?: (searchBy: string, textToSearch: string) => void;
  searchByValue?: string;
  onSearchByChange?: (value: string) => void;
  textToSearch?: string;
  onTextToSearchChange?: (value: string) => void;
  /** Fixed modal height for lookups that use paged result sets. */
  modalHeightClassName?: string;
}

export default function PicklistModal<T>({
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
    { label: "Branch Code", value: "code" },
    { label: "Name", value: "name" },
  ],
  onSearchSubmit,
  searchByValue,
  onSearchByChange,
  textToSearch,
  onTextToSearchChange,
  modalHeightClassName,
}: PicklistModalProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSearchBy, setInternalSearchBy] = useState(
    searchByValue ?? searchByOptions[0]?.value ?? "code"
  );
  const [internalTextToSearch, setInternalTextToSearch] = useState(textToSearch ?? "");

  const isControlled = searchValue !== undefined;
  const search = isControlled ? searchValue! : internalSearch;
  const setSearch = isControlled ? onSearchChange! : setInternalSearch;

  const isSearchByControlled = searchByValue !== undefined;
  const searchBy = isSearchByControlled ? searchByValue! : internalSearchBy;
  const setSearchBy = (value: string) => {
    if (isSearchByControlled) {
      onSearchByChange?.(value);
    } else {
      setInternalSearchBy(value);
    }
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
      onSearchSubmit(searchBy, textSearch);
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
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const filteredRows = useMemo(() => {
    if (isControlled || !search.trim()) return rows;

    const q = search.trim().toLowerCase();
    const colonIndex = q.indexOf(':');
    if (colonIndex > 0) {
      const searchByKey = q.substring(0, colonIndex);
      const searchTerm = q.substring(colonIndex + 1);

      return rows.filter((row) => {
        const rowData = row as Record<string, unknown>;
        const matchingCol = columns.find(col => col.key === searchByKey);
        if (matchingCol) {
          const value = rowData[matchingCol.key];
          return value !== undefined && String(value).toLowerCase().includes(searchTerm);
        }
        return columns.some((col) => {
          const raw = col.render ? undefined : rowData[col.key];
          return raw !== undefined && String(raw).toLowerCase().includes(searchTerm);
        });
      });
    }

    return rows.filter((row) =>
      columns.some((col) => {
        const raw = col.render ? undefined : (row as Record<string, unknown>)[col.key];
        return raw !== undefined && String(raw).toLowerCase().includes(q);
      })
    );
  }, [rows, search, columns, isControlled]);

  const hasActions = actions.length > 0 || showDefaultAction;

  const getVariantStyles = (variant: string = 'primary') => {
    const styles = {
      primary: "bg-primary-50 text-primary hover:bg-primary-100",
      secondary: "bg-gray-50 text-gray-700 hover:bg-gray-100",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
      success: "bg-green-50 text-green-600 hover:bg-green-100",
      warning: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
    };
    return styles[variant as keyof typeof styles] || styles.primary;
  };

  const renderActions = (row: T) => {
    if (actions.length === 0 && showDefaultAction) {
      return (
        <button
          type="button"
          onClick={() => onSelect(row)}
          className="rounded-sm cursor-pointer bg-primary-50 px-3 py-1 text-[15px] font-medium text-primary transition hover:bg-primary-100"
        >
          Select
        </button>
      );
    }

    if (actions.length > 0) {
      const visibleActions = actions.filter(action =>
        !action.show || action.show(row)
      );

      if (visibleActions.length === 0) return null;

      return (
        <div className="flex items-center gap-1.5">
          {visibleActions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={() => action.onClick(row)}
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
              onClick={() => onSelect(row)}
              className="rounded-md bg-primary-50 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary-100"
            >
              Select
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={841}
      ariaLabel={title}
      contentClassName={`rounded-[36px] p-6 min-h-[600px] max-h-[852px] ${modalHeightClassName ?? ""}`}
      bodyClassName="flex flex-1 flex-col overflow-hidden"
      showCloseButton={false}
    >
      <div className="relative flex flex-1 flex-col overflow-hidden">

        {/* Header with Centered Title */}
        <div className="relative z-10 flex flex-col gap-6 rounded-[15px] px-2">


          {/* Search Section */}
          <div className="w-full  border border-gray-400 text-sm">
            {/* Search By Row */}
            <div className="flex border-b border-gray-400">
              {/* Left Label */}
              <div className="w-48 border-r border-gray-400 bg-[#DCEBFC] px-3 py-2 font-semibold">
                Search By
              </div>

              {/* Right Content */}
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
                        setTextSearch("");
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Text To Search Row */}
            <div className="flex">
              {/* Left Label */}
              <div className="w-48 border-r border-gray-400 bg-[#DCEBFC] px-3 py-2 font-semibold">
                Text To Search
              </div>

              {/* Right Content */}
              <div className="flex flex-1 items-center gap-2 bg-[#DCEBFC] p-2">
                <input
                  type="text"
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Enter ${searchBy === "code" ? "Branch Code" : "Name"}`}
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

        {/* Table Section - Border only around the table */}
        <div className="relative z-10 mt-4 flex flex-1 flex-col overflow-hidden rounded-md border border-gray-300">
          {/* Table Header */}
          <div className="flex h-[40px] shrink-0 items-center bg-[#DCEBFC]">
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
              <div className="flex h-[50px] items-center justify-center text-sm text-gray-400">Loading…</div>
            ) : filteredRows.length === 0 ? (
              <div className="flex h-[50px] items-center justify-center text-sm text-gray-400">{emptyMessage}</div>
            ) : (
              filteredRows.map((row) => (
                <div
                  key={rowKey(row)}
                  className="flex h-[50px] items-center border-b border-gray-300 px-0 last:border-b-0"
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="truncate px-4 text-sm text-gray-800"
                      style={{ width: col.width, flex: col.width ? undefined : 1 }}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </div>
                  ))}
                  {hasActions && (
                    <div className="shrink-0 px-4" style={{ width: actionColumnWidth }}>
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
            <PaginationModal page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
