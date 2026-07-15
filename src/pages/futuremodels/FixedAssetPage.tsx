import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import {
  X,
  IdCard,
  FileText,
  User,
  CalendarDays,
  Package,
  Users,
  IndianRupee,
  Receipt,
  ChevronDown,
  MoreVertical,
  Check,
  Search,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AddFixedAssetAccountModalProps {
  onClose?: () => void;
  onValidate?: () => void;
  onSave?: () => void;
}

type DeprecationMethod = "Day" | "Month";
type DeprecationCalculateOn = "Opening Balance" | "Current Balance";

interface CustomerListRow {
  customerId: string;
  name: string;
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

// Sample rows for the Customer pickup list, opened from the
// Customer ID field's menu button
const CUSTOMER_LIST: CustomerListRow[] = [
  { customerId: "000012", name: "BALAMI MANJUNATH IRANNA" },
  { customerId: "0002000001", name: "SAVAKAR RAMANNA FAKIRAPPA00000....." },
  { customerId: "0002000002", name: "JALI SHIVAPPA PARASAPPA" },
  { customerId: "0002000003", name: "CHALAWADI SANGAPPA YALLAVVA" },
  { customerId: "0002000004", name: "DESAI SUVARNA SANJAY" },
  { customerId: "0002000005", name: "BENNUR LAXMAVVA SHIVAPPA" },
  { customerId: "0002000006", name: "DIVANAJI KRISHNA VENKATESH" },
  { customerId: "0002000007", name: "KAMBAR KASTURI LAXMAN" },
  { customerId: "0002000008", name: "KURI SIDDAPPA GADIGEPPA" },
  { customerId: "0002000009", name: "PATIL MARENDRA RAMANAGOUDA" },
  { customerId: "0002000010", name: "SUNAGAD RUKMAVVA KASHAPPA" },
  { customerId: "0002000011", name: "SONNAD RAJASAB HASANASAB" },
  { customerId: "0002000012", name: "HANAMAR SURESH PAKEERAPPA" },
];



function HeaderIcon() {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 shadow-sm">
      <Image src="/add-icn.png" alt="" fill sizes="48px" className="object-contain" />
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
      className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858]"
      title={mr ? `${en} / ${mr}` : en}
    >
      {en}
      {mr && (
        <>
          <span className="text-slate-400"> / </span>
          <span className="text-[#64748B]">{mr}</span>
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
  error?: string;
  children: ReactNode;
}

function FieldWrap({ label, labelHi, required = true, error, children }: FieldWrapProps) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <BilingualLabel en={label} mr={labelHi} required={required} />
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
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
  error?: boolean;
}

function TextField({ icon, value, onChange, placeholder, prefix, disabled, error }: TextFieldProps) {
  return (
    <div className="relative flex flex-1 min-w-0 items-center">
      {(icon || prefix) && (
        <span className={`pointer-events-none absolute left-3 flex items-center gap-1 ${error ? "text-rose-400" : "text-slate-400"}`}>
          {icon}
          {prefix && <span className={`text-sm ${error ? "text-rose-400" : "text-slate-400"}`}>{prefix}</span>}
        </span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[42px] rounded-lg border px-3 py-2.5 ${
          icon || prefix ? "pl-10" : "pl-3"
        } pr-3 text-sm font-normal outline-none transition-colors ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
            : "border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
        } ${disabled ? "bg-slate-50 text-slate-600" : "bg-white text-slate-700"}`}
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
  error,
}: {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onMenuClick: () => void;
  menuActive?: boolean;
  error?: boolean;
}) {
  return (
    <div className="flex flex-1 items-stretch gap-2">
      <TextField icon={icon} value={value} onChange={onChange} error={error} />
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="More options"
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg border transition-colors ${
          menuActive
            ? "border-primary-200 bg-primary-100 text-primary"
            : "border-slate-200 bg-primary-50 text-primary hover:bg-primary-100"
        }`}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitive: SelectField — matches TLCalculatorModal's SelectField    */
/* ------------------------------------------------------------------ */

interface SelectFieldProps {
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
}

function SelectField({ icon, value, onChange, options, placeholder = "Select", error }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-[42px] w-full items-center rounded-lg border bg-white px-3 text-left transition-all ${
          error
            ? "border-rose-400 ring-1 ring-rose-200"
            : isOpen
              ? "border-primary ring-2 ring-primary/10"
              : "border-slate-600 hover:border-primary"
        }`}
      >
        {icon && <span className={error ? "text-rose-400" : "text-slate-400"}>{icon}</span>}
        <span className={`flex-1 truncate text-sm ${icon ? "ml-3" : ""} ${value ? "text-slate-600" : "text-slate-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                option === value ? "bg-primary-50 text-primary" : "hover:bg-slate-50"
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



function RadioOption<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: T;
  selected: T;
  onSelect: (v: T) => void;
}) {
  const checked = value === selected;
  return (
    <button type="button" onClick={() => onSelect(value)} className="flex items-center gap-2 text-sm text-slate-700">
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked ? "border-primary" : "border-slate-300"
        }`}
      >
        {checked && <span className="h-[9px] w-[9px] rounded-full bg-primary" />}
      </span>
      {label}
    </button>
  );
}

function CustomerListModal({
  onSelect,
  onClose,
}: {
  onSelect: (row: CustomerListRow) => void;
  onClose: () => void;
}) {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return CUSTOMER_LIST;
    const q = searchText.trim().toLowerCase();
    return CUSTOMER_LIST.filter(
      (row) => row.customerId.toLowerCase().includes(q) || row.name.toLowerCase().includes(q)
    );
  }, [searchText]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[85vh] w-[95vw] max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* Decorative corner circles — clipped to the card */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-100" />

        {/* Header — title, single search box, close circle */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 pb-5">
          <h2 className="shrink-0 text-lg font-bold text-slate-800">Customer List</h2>
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
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary-100 text-slate-700">
                <th className="rounded-l-lg px-4 py-3 font-semibold">Customer Id</th>
                <th className="px-4 py-3 text-center font-semibold">Name</th>
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.customerId} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {row.customerId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{row.name}</td>
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
                    No customers found.
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



function SuccessModal({
  title = "Save Successfully",
  message = "Your Account is Saved Successfully",
  buttonLabel = "OK",
  onClose,
}: {
  title?: string;
  message?: string;
  buttonLabel?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="relative flex w-[95vw] max-w-[380px] flex-col items-center overflow-hidden rounded-[24px] bg-white px-8 py-10 shadow-2xl">
        {/* Decorative corner circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-50" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-primary-50" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {/* Check icon with dotted sparkle accents */}
        <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center">
          <span className="absolute -top-1 left-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="absolute -top-2 right-2 h-1 w-1 rounded-full bg-primary/40" />
          <span className="absolute bottom-0 -left-2 h-1 w-1 rounded-full bg-primary/40" />
          <span className="absolute -bottom-1 right-0 h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="absolute -right-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary/30" />
          <span className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary/30" />

          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
            <Check className="h-8 w-8 text-white" strokeWidth={3} />
          </span>
        </div>

        {/* Title + message */}
        <h3 className="relative z-10 text-center text-lg font-bold text-slate-800">{title}</h3>
        <p className="relative z-10 mt-1 text-center text-sm text-slate-500">{message}</p>

        {/* OK button */}
        <button
          type="button"
          onClick={onClose}
          className="relative z-10 mt-6 h-10 w-[140px] rounded-lg bg-primary text-[14px] font-medium text-white transition hover:bg-primary-700"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: AddFixedAssetAccountModal                                    */
/* ------------------------------------------------------------------ */

export default function FixedAssetPage({
  onClose,
  onValidate = () => {},
  onSave = () => {},
}: AddFixedAssetAccountModalProps) {
  const handleClose = useCloseHandler(onClose);

  const [applicationNumber, setApplicationNumber] = useState("New");
  const [customerId, setCustomerId] = useState("00022");
  const [customerName, setCustomerName] = useState("Karan Mangesh Patil");
  const [dateOfApplication, setDateOfApplication] = useState("27-Feb-2026");

  const [itemName, setItemName] = useState("Self");
  const [minBalanceId, setMinBalanceId] = useState("200");
  const [purchaseDate, setPurchaseDate] = useState("27-Feb-2026");
  const [purchaseAmount, setPurchaseAmount] = useState("2,50,0000");

  const [deprecationRate, setDeprecationRate] = useState("0");
  const [description, setDescription] = useState("");
  const [billNumber, setBillNumber] = useState("0");

  const [deprecationMethod, setDeprecationMethod] = useState<DeprecationMethod>("Day");
  const [deprecationCalculateOn, setDeprecationCalculateOn] =
    useState<DeprecationCalculateOn>("Opening Balance");

  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleCustomerSelect = (row: CustomerListRow) => {
    setCustomerId(row.customerId);
    setCustomerName(row.name);
    setIsCustomerListOpen(false);
    setErrors((prev) => ({ ...prev, customerId: "", customerName: "" }));
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};

    if (!applicationNumber.trim()) next.applicationNumber = "Application Number is required";
    if (!customerId.trim()) next.customerId = "Customer ID is required";
    if (!customerName.trim()) next.customerName = "Customer Name is required";
    if (!dateOfApplication.trim()) next.dateOfApplication = "Date of Application is required";
    if (!itemName.trim()) next.itemName = "Item Name is required";
    if (!minBalanceId.trim()) next.minBalanceId = "Min Balance ID is required";
    if (!purchaseDate.trim()) next.purchaseDate = "Purchase Date is required";

    if (!deprecationRate.trim()) {
      next.deprecationRate = "Deprecation Rate is required";
    } else if (Number.isNaN(Number(deprecationRate)) || Number(deprecationRate) < 0) {
      next.deprecationRate = "Enter a valid rate";
    }

    if (!description.trim()) next.description = "Description is required";
    if (!billNumber.trim()) next.billNumber = "Bill Number is required";

    return next;
  };

  const handleValidate = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onValidate();
    }
  };

  const handleSave = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave();
      setIsSuccessOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1150px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <HeaderIcon />
            <div>
              <h2 className="text-[20px] font-semibold leading-6 tracking-[0.0025em] text-slate-800">
                Add Fixed Asset Account
                <span className="text-slate-400"> / </span>
                <span className="text-[#64748B]">स्थिर मालमत्ता खाते जोडा</span>
              </h2>
              <p className="mt-1 text-sm font-normal leading-5 tracking-[0.0025em] text-slate-500">
                Add some basic information related to the Employee
                <span className="text-slate-400"> / </span>
                कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          <div className="grid grid-cols-1 gap-4 rounded-[20px] border-x border-b-2 border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
            <FieldWrap label="Application Number" labelHi="अर्ज क्रमांक" error={errors.applicationNumber}>
              <TextField
                icon={<FileText size={16} />}
                value={applicationNumber}
                onChange={(v) => {
                  setApplicationNumber(v);
                  setErrors((prev) => ({ ...prev, applicationNumber: "" }));
                }}
                error={!!errors.applicationNumber}
              />
            </FieldWrap>

            <FieldWrap label="Customer ID" labelHi="ग्राहक आयडी" error={errors.customerId}>
              <TextFieldWithMenu
                icon={<IdCard size={16} />}
                value={customerId}
                onChange={(v) => {
                  setCustomerId(v);
                  setErrors((prev) => ({ ...prev, customerId: "" }));
                }}
                menuActive={isCustomerListOpen}
                onMenuClick={() => setIsCustomerListOpen(true)}
                error={!!errors.customerId}
              />
            </FieldWrap>

            <FieldWrap label="Customer Name" labelHi="ग्राहकाचे नाव" error={errors.customerName}>
              <TextField
                icon={<User size={16} />}
                value={customerName}
                onChange={(v) => {
                  setCustomerName(v);
                  setErrors((prev) => ({ ...prev, customerName: "" }));
                }}
                error={!!errors.customerName}
              />
            </FieldWrap>

            <FieldWrap label="Date of Application" labelHi="अर्जाची तारीख" error={errors.dateOfApplication}>
              <TextField
                icon={<CalendarDays size={16} />}
                value={dateOfApplication}
                onChange={(v) => {
                  setDateOfApplication(v);
                  setErrors((prev) => ({ ...prev, dateOfApplication: "" }));
                }}
                error={!!errors.dateOfApplication}
              />
            </FieldWrap>

            <FieldWrap label="Item Name" labelHi="वस्तूचे नाव" error={errors.itemName}>
              <TextField
                icon={<Package size={16} />}
                value={itemName}
                onChange={(v) => {
                  setItemName(v);
                  setErrors((prev) => ({ ...prev, itemName: "" }));
                }}
                error={!!errors.itemName}
              />
            </FieldWrap>

            <FieldWrap label="Min Balance ID" labelHi="किमान शिल्लक आयडी" error={errors.minBalanceId}>
              <SelectField
                icon={<Users size={16} />}
                value={minBalanceId}
                onChange={(v) => {
                  setMinBalanceId(v);
                  setErrors((prev) => ({ ...prev, minBalanceId: "" }));
                }}
                options={["200", "500", "1000"]}
                error={!!errors.minBalanceId}
              />
            </FieldWrap>

            <FieldWrap label="Purchase Date" labelHi="खरेदीची तारीख" error={errors.purchaseDate}>
              <TextField
                icon={<CalendarDays size={16} />}
                value={purchaseDate}
                onChange={(v) => {
                  setPurchaseDate(v);
                  setErrors((prev) => ({ ...prev, purchaseDate: "" }));
                }}
                error={!!errors.purchaseDate}
              />
            </FieldWrap>

            <FieldWrap label="Purchase Amount" labelHi="खरेदीची तारीख" required={false}>
              <TextField icon={<IndianRupee size={16} />} value={purchaseAmount} onChange={setPurchaseAmount} />
            </FieldWrap>

            <FieldWrap label="Deprecation Rate" labelHi="जुना होण्याचा दर" error={errors.deprecationRate}>
              <TextField
                prefix="%"
                value={deprecationRate}
                onChange={(v) => {
                  setDeprecationRate(v);
                  setErrors((prev) => ({ ...prev, deprecationRate: "" }));
                }}
                error={!!errors.deprecationRate}
              />
            </FieldWrap>

            <FieldWrap label="Description" labelHi="वर्णन" error={errors.description}>
              <SelectField
                icon={<FileText size={16} />}
                value={description}
                onChange={(v) => {
                  setDescription(v);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                options={["Office Equipment", "Vehicle", "Furniture", "Machinery"]}
                placeholder="-"
                error={!!errors.description}
              />
            </FieldWrap>

            <FieldWrap label="Bill Number" labelHi="बिल नंबर" error={errors.billNumber}>
              <TextField
                icon={<Receipt size={16} />}
                value={billNumber}
                onChange={(v) => {
                  setBillNumber(v);
                  setErrors((prev) => ({ ...prev, billNumber: "" }));
                }}
                error={!!errors.billNumber}
              />
            </FieldWrap>

            {/* Radio groups sit in the same grid, spanning full width */}
            <div className="sm:col-span-2 lg:col-span-2">
              <BilingualLabel en="Method of Deprecation Calculation" mr="जाणिवाने कमी होण्याची गणना करण्याची पद्धत ?" />
              <div className="flex h-[42px] items-center gap-8">
                <RadioOption label="Day" value="Day" selected={deprecationMethod} onSelect={setDeprecationMethod} />
                <RadioOption label="Month" value="Month" selected={deprecationMethod} onSelect={setDeprecationMethod} />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <BilingualLabel en="Deprecation Calculate On" mr="कमी होणे मोजा सुरु ?" />
              <div className="flex h-[42px] items-center gap-8">
                <RadioOption
                  label="Opening Balance"
                  value="Opening Balance"
                  selected={deprecationCalculateOn}
                  onSelect={setDeprecationCalculateOn}
                />
                <RadioOption
                  label="Current Balance"
                  value="Current Balance"
                  selected={deprecationCalculateOn}
                  onSelect={setDeprecationCalculateOn}
                />
              </div>
            </div>
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
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg bg-primary text-[14px] font-medium text-white transition hover:bg-primary-700"
          >
            Validate
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-primary-50 text-[14px] font-medium text-primary transition hover:bg-primary-100"
          >
            Save
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isCustomerListOpen && (
        <CustomerListModal onSelect={handleCustomerSelect} onClose={() => setIsCustomerListOpen(false)} />
      )}

      {isSuccessOpen && (
        <SuccessModal
          title="Save Successfully"
          message="Your Fixed Asset Account is Saved Successfully"
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}