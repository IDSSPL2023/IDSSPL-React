import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import {
  X,
  IdCard,
  FileText,
  CalendarDays,
  Percent,
  Zap,
  ChevronDown,
  MoreVertical,
  Calculator,
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TLCalculatorModalProps {
  onClose?: () => void;
  onCalculate?: () => void;
}

interface InstallmentListRow {
  id: string;
  description: string;
}

function useCloseHandler(onClose?: () => void) {
  const router = useRouter();
  return () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };
}

const INSTALLMENT_TYPE_LIST: InstallmentListRow[] = [
  { id: "0", description: "NOT SPECIFIED" },
  { id: "101", description: "EMI" },
  { id: "105", description: "PLAIN PRINCIPAL" },
  { id: "201", description: "REDUCING INSTALLMENT" },
  { id: "301", description: "BULLON" },
  { id: "401", description: "VERIABLE" },
  { id: "501", description: "WITH INT" },
];

function HeaderIcon() {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <Image
        src="/Frame%201618867441.png"
        alt=""
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}

function BilingualLabel({
  en,
  mr,
  required = true,
}: {
  en: string;
  mr?: string;
  required?: boolean;
}) {
  return (
    <label
      className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858] dark:text-slate-100"
      title={mr ? `${en} / ${mr}` : en}
    >
      {en}
      {mr && (
        <>
          <span className="text-slate-400 dark:text-slate-500"> / </span>
          <span className="text-[#64748B] dark:text-slate-400">{mr}</span>
        </>
      )}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

interface FieldWrapProps {
  label: string;
  labelHi?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldWrap({ label, labelHi, required = true, children }: FieldWrapProps) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={label} mr={labelHi} required={required} />
      {children}
    </div>
  );
}

interface TextFieldProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
}

function TextField({ icon, value, onChange, placeholder, prefix, disabled }: TextFieldProps) {
  return (
    <div className="relative flex flex-1 min-w-0 items-center">
      {(icon || prefix) && (
        <span className="pointer-events-none absolute left-3 flex items-center gap-1 text-slate-400 dark:text-slate-500">
          {icon}
          {prefix && <span className="text-sm text-slate-400 dark:text-slate-500">{prefix}</span>}
        </span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[42px] rounded-lg border border-slate-600 dark:border-slate-700 px-3 py-2.5 ${
          icon || prefix ? "pl-10" : "pl-3"
        } pr-3 text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
          disabled ? "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100"
        }`}
      />
    </div>
  );
}

function TextFieldWithMenu({
  icon,
  value,
  onChange,
  onMenuClick,
  menuActive,
}: {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onMenuClick: () => void;
  menuActive?: boolean;
}) {
  return (
    <div className="flex flex-1 items-stretch gap-2">
      <TextField icon={icon} value={value} onChange={onChange} />
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="More options"
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg border transition-colors ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 dark:border-slate-700 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

interface SelectFieldProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function SelectField({ icon, value, onChange, options }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-[42px] w-full items-center rounded-lg border bg-white dark:bg-slate-900 px-3 text-left transition-all ${
          isOpen ? "border-primary ring-2 ring-primary/10" : "border-slate-600 dark:border-slate-700 hover:border-primary"
        }`}
      >
        {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
        <span className={`flex-1 truncate text-sm ${icon ? "ml-3" : ""} ${value ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
          {value || "Select"}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 dark:text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                option === value ? "bg-primary-50 text-primary" : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function InstallmentTypeListModal({
  onSelect,
  onClose,
}: {
  onSelect: (row: InstallmentListRow) => void;
  onClose: () => void;
}) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return INSTALLMENT_TYPE_LIST;
    const q = searchText.trim().toLowerCase();
    return INSTALLMENT_TYPE_LIST.filter(
      (row) => row.id.toLowerCase().includes(q) || row.description.toLowerCase().includes(q)
    );
  }, [searchText]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[560px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">Installment Type List</h2>
          <div className="relative w-full max-w-[260px]">
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
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[40%]" />
              <col className="w-[40%]" />
            </colgroup>
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 font-semibold">Installment Type Id</th>
                <th className="px-4 py-3 text-center font-semibold">Description</th>
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {row.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{row.description}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-lg bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary-100"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">
                    No installment types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function CalculatorPage({ onClose, onCalculate = () => {} }: TLCalculatorModalProps) {
  const handleClose = useCloseHandler(onClose);
  const [installmentType, setInstallmentType] = useState("401");
  const [description, setDescription] = useState("Fixed Deposit Monthly");
  const [loanAmount, setLoanAmount] = useState("60 Months");
  const [rate, setRate] = useState("0");
  const [repayMode, setRepayMode] = useState("Monthly");
  const [period, setPeriod] = useState("0");
  const [totalInstallment, setTotalInstallment] = useState("");

  const [isInstallmentListOpen, setIsInstallmentListOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1150px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <HeaderIcon />
            <div>
              <h2 className="text-[20px] font-semibold leading-6 tracking-[0.0025em] text-slate-800 dark:text-slate-100">
                TL Calculator
                <span className="text-slate-400 dark:text-slate-500"> / </span>
                <span className="text-[#64748B] dark:text-slate-400">मुदत कर्ज कॅल्क्युलेटर</span>
              </h2>
              <p className="mt-1 text-sm font-normal leading-5 tracking-[0.0025em] text-slate-500 dark:text-slate-400">
                All Information&apos;s are related to Maturity Amount / सर्व माहिती परिपक्वतेच्या रकमेशी संबंधित आहे
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          <div className="grid grid-cols-1 gap-4 rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white dark:bg-slate-900 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:grid-cols-2 [&>*]:min-w-0">
            <FieldWrap label="Installment Type" labelHi="हप्त्याचा प्रकार">
              <TextFieldWithMenu
                icon={<IdCard size={16} />}
                value={installmentType}
                onChange={setInstallmentType}
                menuActive={isInstallmentListOpen}
                onMenuClick={() => setIsInstallmentListOpen(true)}
              />
            </FieldWrap>

            <FieldWrap label="Description" labelHi="वर्णन">
              <TextField icon={<FileText size={16} />} value={description} onChange={setDescription} placeholder="Fixed Deposit Monthly" />
            </FieldWrap>

            <FieldWrap label="Loan Amount" labelHi="कर्ज रक्कम" required={false}>
              <TextField icon={<CalendarDays size={16} />} value={loanAmount} onChange={setLoanAmount} />
            </FieldWrap>

            <FieldWrap label="Rate" labelHi="दर">
              <TextField prefix="%" value={rate} onChange={setRate} />
            </FieldWrap>

            <FieldWrap label="Repay Mode" labelHi="परतफेड वारंवारिता">
              <SelectField icon={<Zap size={16} />} value={repayMode} onChange={setRepayMode} options={["Monthly", "Quarterly", "Half Yearly", "Yearly"]} />
            </FieldWrap>

            <FieldWrap label="Period" labelHi="कालावधी">
              <TextField prefix="%" value={period} onChange={setPeriod} />
            </FieldWrap>

            <FieldWrap label="Total Installment" labelHi="एकूण हप्ता">
              <TextField icon={<Zap size={16} />} value={totalInstallment} onChange={setTotalInstallment} placeholder="Enter Amount" disabled />
            </FieldWrap>
          </div>
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Footer */}
        <div className="flex items-center justify-end gap-6 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onCalculate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
          >
            Calculate
            <Calculator className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isInstallmentListOpen && (
        <InstallmentTypeListModal
          onSelect={(item) => {
            setInstallmentType(item.id);
            setDescription(item.description);
            setIsInstallmentListOpen(false);
          }}
          onClose={() => setIsInstallmentListOpen(false)}
        />
      )}
    </div>
  );
}