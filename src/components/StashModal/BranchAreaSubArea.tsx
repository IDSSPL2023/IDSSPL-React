import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import Image from "@/components/ui/Image";
import {
  X,
  Check,
  ChevronDown,
  ThumbsUp,
  Landmark,
  Building2,
  MoreVertical,
  type LucideIcon,
  Search,
} from "lucide-react";

export interface BranchFormData {
  branchCode: string;
  branchName: string;
  areaCode: string;
  areaDescription: string;
  subareaCode: string;
  subareaDescription: string;
}

export const emptyBranchFormData: BranchFormData = {
  branchCode: "0100",
  branchName: "Ikkal Branch",
  areaCode: "",
  areaDescription: "",
  subareaCode: "",
  subareaDescription: "",
};

export type BranchModalMode = "add" | "view";

type RequiredFieldKey = keyof BranchFormData;

const REQUIRED_FIELDS: RequiredFieldKey[] = [
  "branchCode",
  "branchName",
  "areaCode",
  "areaDescription",
  "subareaCode",
  "subareaDescription",
];

interface TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

function TextField({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  required = true,
  readOnly = false,
}: TextFieldProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[1rem] font-medium text-black dark:text-slate-100">
        {labelEn}{" "}
        <span className="font-medium text-gray-500 dark:text-slate-400">
          / {labelHi}
        </span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex h-12 items-center rounded-xl border px-3 transition-colors border-[#6A7282] ${
          hasError
            ? "border-red-400 bg-white dark:bg-slate-900"
            : readOnly
              ? "bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              : "bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700"
        }`}
      >
        <Icon
          size={18}
          className="shrink-0 text-[#6B7280] dark:text-slate-400"
        />
        {readOnly ? (
          <span
            className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}
          >
            {value || placeholder}
          </span>
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
          />
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          This field is required
        </p>
      )}
    </div>
  );
}

const ToolPick = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary hover:bg-primary-200"
  >
    <MoreVertical size={20} />
  </button>
);

/* ------------------------------------------------------------------ */
/*  ListModal — generic pickup list (search box, pill IDs, Select btn)  */
/* ------------------------------------------------------------------ */

interface AreaItem {
  id: string;
  areaCode: string;
  areaName: string;
}

interface SubAreaItem {
  id: string;
  subAreaCode: string;
  subAreaName: string;
}

type ListItem = AreaItem | SubAreaItem;

interface ListModalProps {
  title: string;
  rows: ListItem[];
  columns: { key: keyof ListItem; label: string }[];
  onSelect: (row: ListItem) => void;
  onClose: () => void;
}

function ListModal({
  title,
  rows,
  columns,
  onSelect,
  onClose,
}: ListModalProps) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, columns, searchText]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-180 flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">{title}</h2>
          <div className="relative w-full max-w-65 ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Table */}
        <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                {columns.map((col, idx) => (
                  <th
                    key={String(col.key)}
                    className={`px-4 py-3 font-semibold ${idx === 0 ? "rounded-l-lg" : "text-center"}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-slate-50 last:border-0"
                >
                  {columns.map((col, idx) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 ${idx === 0 ? "" : "text-center text-slate-700"}`}
                    >
                      {idx === 0 ? (
                        <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {String(row[col.key] ?? "")}
                        </span>
                      ) : (
                        String(row[col.key] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-md bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sample Area Data
const AREA_DATA: AreaItem[] = [
  { id: "1", areaCode: "01", areaName: "Main Bilagi" },
  { id: "2", areaCode: "02", areaName: "0002 Recovery" },
  { id: "3", areaCode: "03", areaName: "Downtown Area" },
  { id: "4", areaCode: "04", areaName: "Industrial Zone" },
  { id: "5", areaCode: "05", areaName: "Residential Colony" },
];

// Sample Sub-Area Data
const SUB_AREA_DATA: SubAreaItem[] = [
  { id: "1", subAreaCode: "01", subAreaName: "Aanadinni" },
  { id: "2", subAreaCode: "02", subAreaName: "Aanegundi" },
  { id: "3", subAreaCode: "03", subAreaName: "Achanur" },
  { id: "4", subAreaCode: "04", subAreaName: "Adavi Sangapur" },
  { id: "5", subAreaCode: "05", subAreaName: "MUDHOLAdihal BRANCH" },
  { id: "6", subAreaCode: "06", subAreaName: "Advi Sangapur" },
  { id: "7", subAreaCode: "07", subAreaName: "Agara" },
  { id: "8", subAreaCode: "08", subAreaName: "Agasanakoppa" },
  { id: "9", subAreaCode: "09", subAreaName: "RAMDURG BRANCH" },
  { id: "10", subAreaCode: "10", subAreaName: "Ahmedabad" },
];

export interface BranchAreaSubAreaModalProps {
  open: boolean;
  mode?: BranchModalMode;
  initialData?: BranchFormData;
  onClose?: () => void;
  onSave?: (data: BranchFormData) => void;
}

function BranchAreaSubAreaModal({
  open,
  mode = "add",
  initialData = emptyBranchFormData,
  onClose,
  onSave,
}: BranchAreaSubAreaModalProps) {
  const [formData, setFormData] = useState<BranchFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<RequiredFieldKey, boolean>>
  >({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"area" | "subarea">("subarea");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof BranchFormData>(
    key: K,
    value: BranchFormData[K],
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey])
      setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  const handleOpenList = (type: "area" | "subarea") => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListItem) => {
    if (listType === "area") {
      // Only set the code, not the description
      handleChange("areaCode", (row as AreaItem).areaCode);
      // Don't set areaDescription - it should be filled manually
    } else {
      // For sub-area, set both code and description
      handleChange("subareaCode", (row as SubAreaItem).subAreaCode);
      handleChange("subareaDescription", (row as SubAreaItem).subAreaName);
    }
    setOpenList(false);
  };

  // Get the appropriate data and columns based on list type
  const getListData = () => {
    if (listType === "area") {
      return {
        title: "Area List",
        rows: AREA_DATA,
        columns: [
          { key: "areaCode" as keyof ListItem, label: "Area Code" },
          { key: "areaName" as keyof ListItem, label: "Area Name" },
        ],
      };
    } else {
      return {
        title: "Sub-Area List",
        rows: SUB_AREA_DATA,
        columns: [
          { key: "subAreaCode" as keyof ListItem, label: "Sub-Area Code" },
          { key: "subAreaName" as keyof ListItem, label: "Sub-Area Name" },
        ],
      };
    }
  };

  const listData = getListData();

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <div
          className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="shrink-0 p-6 pb-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Image src="/add-icn.png" alt="" width={64} height={64} />
                <div>
                  <h2 className="text-[2rem] font-bold text-[#101828] dark:text-slate-100">
                    Branch Area / Sub-Area{" "}
                    <span className="font-bold text-[#64748B] dark:text-slate-400">
                      / शाखा क्षेत्र / उप-क्षेत्र
                    </span>
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content - Middle */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="rounded-[20px] border-x border-b space-y-4 border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
              <TextField
                labelEn="Branch Code"
                labelHi="शाखा कोड"
                icon={Landmark}
                placeholder="Enter Branch Code"
                value={formData.branchCode}
                onChange={(v) => handleChange("branchCode", v)}
                hasError={errors.branchCode}
                readOnly={true}
              />

              <TextField
                labelEn="Branch Name"
                labelHi="शाखेचे नाव"
                icon={Landmark}
                placeholder="Enter Branch Name"
                value={formData.branchName}
                onChange={(v) => handleChange("branchName", v)}
                hasError={errors.branchName}
                readOnly={true}
              />

              <div className="flex gap-2 items-end">
                <TextField
                  labelEn="Area Code"
                  labelHi="क्षेत्रीय कोड"
                  icon={Building2}
                  placeholder="Enter Area Code"
                  value={formData.areaCode}
                  onChange={(v) => handleChange("areaCode", v)}
                  hasError={errors.areaCode}
                  readOnly={isView}
                />
                <ToolPick onClick={() => handleOpenList("area")} />
              </div>

              <TextField
                labelEn="Area Description"
                labelHi="क्षेत्राचे वर्णन"
                icon={Building2}
                placeholder="Area Description"
                value={formData.areaDescription}
                onChange={(v) => handleChange("areaDescription", v)}
                hasError={errors.areaDescription}
                readOnly={isView}
              />

              <div className="flex gap-2 items-end">
                <TextField
                  labelEn="Sub-Area Code"
                  labelHi="उप-क्षेत्रीय कोड"
                  icon={Building2}
                  placeholder="Enter Sub-Area Code"
                  value={formData.subareaCode}
                  onChange={(v) => handleChange("subareaCode", v)}
                  hasError={errors.subareaCode}
                  readOnly={isView}
                />
                <ToolPick onClick={() => handleOpenList("subarea")} />
              </div>

              <TextField
                labelEn="Sub-Area Description"
                labelHi="उप-क्षेत्रीय वर्णन"
                icon={Building2}
                placeholder="Sub-Area Description"
                value={formData.subareaDescription}
                onChange={(v) => handleChange("subareaDescription", v)}
                hasError={errors.subareaDescription}
                readOnly={isView}
              />
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="shrink-0 p-6 pt-4">
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              {isView ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Ok, Got It <ThumbsUp size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Validate <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Cancel <X size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={!validated}
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      validated
                        ? "bg-primary-100 text-primary hover:bg-primary-200"
                        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
                    }`}
                  >
                    Save <ChevronDown size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Modal */}
      {openList && (
        <ListModal
          title={listData.title}
          rows={listData.rows}
          columns={listData.columns}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}

export default BranchAreaSubAreaModal;
