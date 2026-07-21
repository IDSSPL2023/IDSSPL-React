// src/components/FutureModels/LoanCalculators.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Home,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Percent,
  TrendingUp,
  List,
  Calculator,
  Info,
  AlertCircle,
} from "lucide-react";
import Image from "@/components/ui/Image";

/* ========================================================================
   TYPES
   ======================================================================== */

type TenureUnit = "Months" | "Years";

interface SectionErrors {
  amount?: string;
  tenure?: string;
  rate?: string;
  emi?: string;
}

/* ========================================================================
   BUSINESS RULES / LIMITS
   Kept as named constants so ops/compliance can tune them without touching
   the calculation or UI logic.
   ======================================================================== */

const AMOUNT_MIN = 1000; // ₹1,000
const AMOUNT_MAX = 100000000; // ₹10,00,00,000 (10 crore)
const RATE_MIN = 0.01; // % p.a.
const RATE_MAX = 36; // % p.a. — typical regulatory ceiling for retail lending
const TENURE_MONTHS_MIN = 1;
const TENURE_MONTHS_MAX = 360; // 30 years
const EMI_MIN = 1;

/* ========================================================================
   CALCULATION HELPERS (business logic — pure functions, no UI concerns)
   ======================================================================== */

const toMonths = (value: number, unit: TenureUnit) =>
  unit === "Years" ? value * 12 : value;

/** EMI = P * r * (1+r)^n / ((1+r)^n - 1) */
const calculateEMI = (principal: number, tenureMonths: number, annualRate: number) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  return (principal * r * factor) / (factor - 1);
};

/** Solve EMI formula for Principal */
const calculateLoanAmount = (emi: number, tenureMonths: number, annualRate: number) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return emi * tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  return (emi * (factor - 1)) / (r * factor);
};

/** Binary search for the annual interest rate that produces the given EMI */
const calculateInterestRate = (principal: number, tenureMonths: number, emi: number) => {
  let lo = 0;
  let hi = 1; // 100% monthly rate upper bound (safe ceiling)
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const computedEmi = calculateEMI(principal, tenureMonths, mid * 12 * 100);
    if (computedEmi > emi) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return ((lo + hi) / 2) * 12 * 100; // annual %
};

/** Solve EMI formula for tenure (n) */
const calculateTenure = (principal: number, annualRate: number, emi: number) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / emi;
  const numerator = Math.log(emi / (emi - principal * r));
  const denominator = Math.log(1 + r);
  return numerator / denominator;
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

/* ========================================================================
   INPUT SANITIZATION + FIELD VALIDATION
   A core-banking calculator can't rely on the person typing clean numbers —
   we strip anything that isn't a digit/decimal point as they type, and
   validate ranges + relationships before any computation runs.
   ======================================================================== */

/** Keeps only digits and a single decimal point as the person types. */
const sanitizeDecimal = (raw: string): string => {
  let cleaned = raw.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  return cleaned;
};

const parseNum = (v: string) => (v.trim() === "" ? NaN : parseFloat(v));

const validateAmount = (value: string): string | undefined => {
  if (value.trim() === "") return "Amount is required / रक्कम आवश्यक आहे";
  const n = parseNum(value);
  if (isNaN(n)) return "Enter a valid amount / वैध रक्कम प्रविष्ट करा";
  if (n < AMOUNT_MIN) return `Minimum amount is ${formatAmount(AMOUNT_MIN)}`;
  if (n > AMOUNT_MAX) return `Maximum amount is ${formatAmount(AMOUNT_MAX)}`;
  return undefined;
};

const validateRate = (value: string): string | undefined => {
  if (value.trim() === "") return "Interest rate is required / व्याज दर आवश्यक आहे";
  const n = parseNum(value);
  if (isNaN(n)) return "Enter a valid rate / वैध दर प्रविष्ट करा";
  if (n < RATE_MIN) return `Minimum rate is ${RATE_MIN}%`;
  if (n > RATE_MAX) return `Maximum rate is ${RATE_MAX}%`;
  return undefined;
};

const validateTenure = (value: string, unit: TenureUnit): string | undefined => {
  if (value.trim() === "") return "Tenure is required / कालावधी आवश्यक आहे";
  const n = parseNum(value);
  if (isNaN(n)) return "Enter a valid tenure / वैध कालावधी प्रविष्ट करा";
  const months = toMonths(n, unit);
  if (months < TENURE_MONTHS_MIN) return "Tenure must be at least 1 month";
  if (months > TENURE_MONTHS_MAX) return "Tenure cannot exceed 360 months (30 years)";
  return undefined;
};

const validateEMI = (value: string): string | undefined => {
  if (value.trim() === "") return "EMI is required / ईएमआय आवश्यक आहे";
  const n = parseNum(value);
  if (isNaN(n)) return "Enter a valid EMI / वैध ईएमआय प्रविष्ट करा";
  if (n < EMI_MIN) return `EMI must be at least ${formatAmount(EMI_MIN)}`;
  return undefined;
};

/* ========================================================================
   SHARED UI PRIMITIVES
   ======================================================================== */

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="w-[120px] shrink-0 text-sm font-semibold text-[#1F2937]">
    {children}
  </label>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle size={12} className="shrink-0" /> {message}
    </p>
  ) : null;

const Input = ({
  value,
  onChange,
  placeholder,
  className = "",
  error = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  error?: boolean;
}) => (
  <input
    type="text"
    inputMode="decimal"
    value={value}
    onChange={(e) => onChange(sanitizeDecimal(e.target.value))}
    placeholder={placeholder}
    className={`h-10 min-w-0 rounded-lg border bg-[#F8FAFC] px-4 text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none transition-colors ${
      error
        ? "border-red-400 focus:border-red-500"
        : "border-[#CBD5E1] focus:border-[#1565D8]"
    } ${className}`}
  />
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
    {children}
  </div>
);

/** Common width for every standalone amount-style field (EMI / Loan Amount)
 *  so they line up identically from the EMI Calculator through to the
 *  No. of EMI Months Calculator. */
const AMOUNT_INPUT_WIDTH = "w-full";

/**
 * Tenure input + unit selector.
 * The input is `flex-1` (no fixed pixel width) with a `min-w` floor, so it
 * fills whatever room is left next to the dropdown on the same line — wide
 * enough that the Hindi placeholder text doesn't get clipped — while the
 * dropdown never gets pushed off/overlapped.
 */
const TenureRow = ({
  value,
  onChange,
  unit,
  onUnitChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: TenureUnit;
  onUnitChange: (u: TenureUnit) => void;
  error?: string;
}) => (
  <Row>
    <Label>Tenure / कालावधी</Label>
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full min-w-0 flex-nowrap items-center gap-3">
        <Input
          value={value}
          onChange={onChange}
          placeholder="Enter tenure / कालावधी प्रविष्ट करा"
          error={!!error}
          className="min-w-0 flex-1"
        />
        <div className="relative w-[95px] shrink-0">
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value as TenureUnit)}
            className="h-10 w-full appearance-none rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] pl-3 pr-8 text-sm text-[#111827] outline-none focus:border-[#1565D8]"
          >
            <option value="Months">Months / महिने</option>
            <option value="Years">Years / वर्षे</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />
        </div>
      </div>
      <FieldError message={error} />
    </div>
  </Row>
);

const RateRow = ({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) => (
  <Row>
    <Label>Interest Rate / व्याज दर</Label>
    <div className="flex w-full flex-col gap-1.5">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Enter interest rate"
        error={!!error}
        className={AMOUNT_INPUT_WIDTH}
      />
      <span className="text-xs text-[#374151]">% (Yearly reducing / वार्षिक कमी होणारा)</span>
      <FieldError message={error} />
    </div>
  </Row>
);

const ActionButton = ({ label, labelHi, onClick }: { label: string; labelHi: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-10 items-center gap-2 rounded-lg bg-[#1565D8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0F5AC8]"
  >
    <Calculator size={16} />
    {label} <span className="text-[#94A3B8] font-normal text-xs">/</span> {labelHi}
  </button>
);

const SectionIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1565D8]">
    {icon}
  </div>
);

/* ========================================================================
   MAIN PAGE
   ======================================================================== */

export default function LoanCalculatorsPage() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  /* ---- Section 1: Loan Amount Calculator ---- */
  const [emiInput, setEmiInput] = useState("");
  const [tenure1, setTenure1] = useState("");
  const [tenure1Unit, setTenure1Unit] = useState<TenureUnit>("Months");
  const [rate1, setRate1] = useState("");
  const [errors1, setErrors1] = useState<SectionErrors>({});

  /* ---- Section 2: EMI Calculator ---- */
  const [loanAmount2, setLoanAmount2] = useState("");
  const [tenure2, setTenure2] = useState("");
  const [tenure2Unit, setTenure2Unit] = useState<TenureUnit>("Months");
  const [rate2, setRate2] = useState("");
  const [errors2, setErrors2] = useState<SectionErrors>({});

  /* ---- Section 3: Compound Interest Rate Calculator ---- */
  const [loanAmount3, setLoanAmount3] = useState("");
  const [tenure3, setTenure3] = useState("");
  const [tenure3Unit, setTenure3Unit] = useState<TenureUnit>("Months");
  const [emi3, setEmi3] = useState("");
  const [errors3, setErrors3] = useState<SectionErrors>({});

  /* ---- Section 4: Number of EMI Months Calculator ---- */
  const [loanAmount4, setLoanAmount4] = useState("");
  const [rate4, setRate4] = useState("");
  const [emi4, setEmi4] = useState("");
  const [errors4, setErrors4] = useState<SectionErrors>({});

  /* ---- Section 1: EMI + Tenure + Rate → Loan Amount ---- */
  const handleCalculateAmount = () => {
    const emiErr = validateEMI(emiInput);
    const tenureErr = validateTenure(tenure1, tenure1Unit);
    const rateErr = validateRate(rate1);
    if (emiErr || tenureErr || rateErr) {
      setErrors1({ emi: emiErr, tenure: tenureErr, rate: rateErr });
      return;
    }
    setErrors1({});

    const emi = parseFloat(emiInput);
    const tenure = toMonths(parseFloat(tenure1), tenure1Unit);
    const rate = parseFloat(rate1);
    const result = calculateLoanAmount(emi, tenure, rate);

    if (!isFinite(result) || result <= 0) {
      setErrors1({ emi: "This EMI, tenure and rate combination does not produce a valid loan amount" });
      return;
    }
    toast.success(`Loan Amount: ${formatAmount(result)}`);
  };

  /* ---- Section 2: Loan Amount + Tenure + Rate → EMI ---- */
  const handleCalculateEMI = () => {
    const amountErr = validateAmount(loanAmount2);
    const tenureErr = validateTenure(tenure2, tenure2Unit);
    const rateErr = validateRate(rate2);
    if (amountErr || tenureErr || rateErr) {
      setErrors2({ amount: amountErr, tenure: tenureErr, rate: rateErr });
      return;
    }
    setErrors2({});

    const principal = parseFloat(loanAmount2);
    const tenure = toMonths(parseFloat(tenure2), tenure2Unit);
    const rate = parseFloat(rate2);
    const result = calculateEMI(principal, tenure, rate);
    toast.success(`EMI: ${formatAmount(result)}`);
  };

  /* ---- Section 3: Loan Amount + Tenure + EMI → Interest Rate ---- */
  const handleCalculateInterestRate = () => {
    const amountErr = validateAmount(loanAmount3);
    const tenureErr = validateTenure(tenure3, tenure3Unit);
    const emiErr = validateEMI(emi3);
    if (amountErr || tenureErr || emiErr) {
      setErrors3({ amount: amountErr, tenure: tenureErr, emi: emiErr });
      return;
    }

    const principal = parseFloat(loanAmount3);
    const tenure = toMonths(parseFloat(tenure3), tenure3Unit);
    const emi = parseFloat(emi3);

    // A valid interest rate can only exist if the EMI is greater than what a
    // 0%-interest loan would require (principal ÷ tenure). Anything at or
    // below that means the EMI is too low for the given amount and tenure.
    const minEmi = principal / tenure;
    if (emi <= minEmi) {
      setErrors3({
        emi: `EMI must be greater than ${formatAmount(minEmi)} for this amount and tenure`,
      });
      return;
    }
    setErrors3({});

    const result = calculateInterestRate(principal, tenure, emi);
    toast.success(`Interest Rate: ${result.toFixed(2)}%`);
  };

  /* ---- Section 4: Loan Amount + Rate + EMI → Tenure ---- */
  const handleCalculateTenure = () => {
    const amountErr = validateAmount(loanAmount4);
    const rateErr = validateRate(rate4);
    const emiErr = validateEMI(emi4);
    if (amountErr || rateErr || emiErr) {
      setErrors4({ amount: amountErr, rate: rateErr, emi: emiErr });
      return;
    }

    const principal = parseFloat(loanAmount4);
    const rate = parseFloat(rate4);
    const emi = parseFloat(emi4);

    // If the EMI doesn't even cover the monthly interest on the principal,
    // the outstanding balance grows every month and the loan is never
    // repaid — the log-based tenure formula would return NaN/negative here.
    const monthlyInterest = principal * (rate / 12 / 100);
    if (emi <= monthlyInterest) {
      setErrors4({
        emi: `EMI must be greater than the monthly interest of ${formatAmount(monthlyInterest)}, otherwise the loan is never repaid`,
      });
      return;
    }
    setErrors4({});

    const result = calculateTenure(principal, rate, emi);
    if (!isFinite(result) || result <= 0) {
      setErrors4({ emi: "This amount, rate and EMI combination does not produce a valid tenure" });
      return;
    }
    toast.success(`Tenure: ${Math.ceil(result)} months`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4">
      <div className="mx-auto max-w-[1600px]">
        {/* Page header — back button + breadcrumb, matches the rest of the app */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">
              Loan Calculators{" "}
              <span className="text-[#64748B] font-semibold text-lg">/ कर्ज कॅल्क्युलेटर</span>
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500">
              <Home size={13} />
              <span>Home</span>
              <ChevronRight size={13} />
              <span className="text-primary font-medium">Loan Calculators / कर्ज कॅल्क्युलेटर</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-8 shadow-sm">
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl ">
                <Image
                  src="/loancalheader.png"
                  alt="Loan Calculator"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-[22px] font-bold leading-tight text-[#111827]">
                  Loan Calculators{" "}
                  <span className="text-[#64748B] font-semibold text-2xl">/</span>{" "}
                  <span className="text-[#64748B] font-semibold text-2xl">कर्ज कॅल्क्युलेटर</span>
                </h2>
                <p className="text-[14px] text-[#64748B]">
                  Calculate EMI, interest rate and related loan details easily.{" "}
                  <span className="text-[#94A3B8]">/</span>{" "}
                  <span className="text-[#94A3B8]">ईएमआय, व्याज दर आणि संबंधित कर्ज तपशील सहजपणे मोजा.</span>
                </p>
              </div>
            </div>

            <div className="hidden h-[64px] w-[200px] shrink-0 items-center justify-end sm:flex">
              <Image
                src="/LoanCalculators.png"
                alt="Loan Calculator Header"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </div>

          <div className="border-b border-[#E5E7EB]" />

          {/* ================= SECTION 1: LOAN AMOUNT ================= */}
          <div className="flex flex-col items-start gap-6 border-b border-[#E5E7EB] py-10 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex w-full gap-4 lg:w-[360px] lg:shrink-0 lg:border-r lg:border-[#E5E7EB] lg:pr-10">
              <SectionIcon icon={<CalendarDays size={22} />} />
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Loan Amount Calculator{" "}
                  <span className="text-[#64748B] font-medium text-sm">/ कर्ज रक्कम कॅल्क्युलेटर</span>
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  Calculate the loan amount based on EMI, tenure and interest rate.{" "}
                  <span className="text-[#94A3B8]">/</span>{" "}
                  <span className="text-[#94A3B8]">ईएमआय, कालावधी आणि व्याज दरावर आधारित कर्ज रक्कम मोजा.</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[480px]">
              <Row>
                <Label>EMI / ईएमआय</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={emiInput}
                    onChange={setEmiInput}
                    placeholder="Enter EMI / ईएमआय प्रविष्ट करा"
                    error={!!errors1.emi}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors1.emi} />
                </div>
              </Row>
              <TenureRow
                value={tenure1}
                onChange={setTenure1}
                unit={tenure1Unit}
                onUnitChange={setTenure1Unit}
                error={errors1.tenure}
              />
              <RateRow value={rate1} onChange={setRate1} error={errors1.rate} />
            </div>

            <div className="flex w-full items-start lg:w-auto lg:justify-end lg:pt-8">
              <ActionButton label="Calculate Amount" labelHi="रक्कम मोजा" onClick={handleCalculateAmount} />
            </div>
          </div>

          {/* ================= SECTION 2: EMI ================= */}
          <div className="flex flex-col items-start gap-6 border-b border-[#E5E7EB] py-10 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex w-full gap-4 lg:w-[360px] lg:shrink-0 lg:border-r lg:border-[#E5E7EB] lg:pr-10">
              <SectionIcon icon={<Percent size={22} />} />
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  EMI Calculator{" "}
                  <span className="text-[#64748B] font-medium text-sm">/ ईएमआय कॅल्क्युलेटर</span>
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  Calculate the EMI based on loan amount, tenure and interest rate.{" "}
                  <span className="text-[#94A3B8]">/</span>{" "}
                  <span className="text-[#94A3B8]">कर्ज रक्कम, कालावधी आणि व्याज दरावर आधारित ईएमआय मोजा.</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[480px]">
              <Row>
                <Label>Loan Amount / कर्ज रक्कम</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={loanAmount2}
                    onChange={setLoanAmount2}
                    placeholder="Enter loan amount / कर्ज रक्कम प्रविष्ट करा"
                    error={!!errors2.amount}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors2.amount} />
                </div>
              </Row>
              <TenureRow
                value={tenure2}
                onChange={setTenure2}
                unit={tenure2Unit}
                onUnitChange={setTenure2Unit}
                error={errors2.tenure}
              />
              <RateRow value={rate2} onChange={setRate2} error={errors2.rate} />
            </div>

            <div className="flex w-full items-start lg:w-auto lg:justify-end lg:pt-8">
              <ActionButton label="Calculate EMI" labelHi="ईएमआय मोजा" onClick={handleCalculateEMI} />
            </div>
          </div>

          {/* ================= SECTION 3: COMPOUND INTEREST RATE ================= */}
          <div className="flex flex-col items-start gap-6 border-b border-[#E5E7EB] py-10 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex w-full gap-4 lg:w-[360px] lg:shrink-0 lg:border-r lg:border-[#E5E7EB] lg:pr-10">
              <SectionIcon icon={<TrendingUp size={22} />} />
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Compound Interest Rate Calculator{" "}
                  <span className="text-[#64748B] font-medium text-sm">/ चक्रवाढ व्याज दर कॅल्क्युलेटर</span>
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  Calculate the compound interest rate from loan amount, tenure and EMI.{" "}
                  <span className="text-[#94A3B8]">/</span>{" "}
                  <span className="text-[#94A3B8]">कर्ज रक्कम, कालावधी आणि ईएमआय वरून चक्रवाढ व्याज दर मोजा.</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[480px]">
              <Row>
                <Label>Loan Amount / कर्ज रक्कम</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={loanAmount3}
                    onChange={setLoanAmount3}
                    placeholder="Enter loan amount / कर्ज रक्कम प्रविष्ट करा"
                    error={!!errors3.amount}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors3.amount} />
                </div>
              </Row>
              <TenureRow
                value={tenure3}
                onChange={setTenure3}
                unit={tenure3Unit}
                onUnitChange={setTenure3Unit}
                error={errors3.tenure}
              />
              <Row>
                <Label>EMI / ईएमआय</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={emi3}
                    onChange={setEmi3}
                    placeholder="Enter EMI / ईएमआय प्रविष्ट करा"
                    error={!!errors3.emi}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors3.emi} />
                </div>
              </Row>
            </div>

            <div className="flex w-full items-start lg:w-auto lg:justify-end lg:pt-8">
              <ActionButton label="Calculate Interest Rate" labelHi="व्याज दर मोजा" onClick={handleCalculateInterestRate} />
            </div>
          </div>

          {/* ================= SECTION 4: NUMBER OF EMI MONTHS ================= */}
          <div className="flex flex-col items-start gap-6 py-10 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex w-full gap-4 lg:w-[360px] lg:shrink-0 lg:border-r lg:border-[#E5E7EB] lg:pr-10">
              <SectionIcon icon={<List size={22} />} />
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Number of EMI Months Calculator{" "}
                  <span className="text-[#64748B] font-medium text-sm">/ ईएमआय महिन्यांची संख्या कॅल्क्युलेटर</span>
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  Calculate the number of months (tenure) from loan amount, interest rate and EMI.{" "}
                  <span className="text-[#94A3B8]">/</span>{" "}
                  <span className="text-[#94A3B8]">कर्ज रक्कम, व्याज दर आणि ईएमआय वरून महिन्यांची संख्या (कालावधी) मोजा.</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[480px]">
              <Row>
                <Label>Loan Amount / कर्ज रक्कम</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={loanAmount4}
                    onChange={setLoanAmount4}
                    placeholder="Enter loan amount / कर्ज रक्कम प्रविष्ट करा"
                    error={!!errors4.amount}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors4.amount} />
                </div>
              </Row>
              <RateRow value={rate4} onChange={setRate4} error={errors4.rate} />
              <Row>
                <Label>EMI / ईएमआय</Label>
                <div className="flex w-full flex-col gap-1.5">
                  <Input
                    value={emi4}
                    onChange={setEmi4}
                    placeholder="Enter EMI / ईएमआय प्रविष्ट करा"
                    error={!!errors4.emi}
                    className={AMOUNT_INPUT_WIDTH}
                  />
                  <FieldError message={errors4.emi} />
                </div>
              </Row>
            </div>

            <div className="flex w-full items-start lg:w-auto lg:justify-end lg:pt-8">
              <ActionButton label="Calculate Tenure" labelHi="कालावधी मोजा" onClick={handleCalculateTenure} />
            </div>
          </div>

          {/* ================= BOTTOM NOTE ================= */}
          <div className="flex items-start gap-2.5 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-[#1565D8]" />
            <p className="text-sm text-[#374151]">
              <span className="font-bold text-[#111827]">Note / सूचना: </span>
              EMI (Equal Monthly Installment) calculation is based on the assumption that your
              EMI will start from the next month of the loan taken.{" "}
              <span className="text-[#94A3B8]">/</span>{" "}
              <span className="text-[#94A3B8]">ईएमआय (समान मासिक हप्ता) गणना या गृहीतावर आधारित आहे की तुमची ईएमआय कर्ज घेतल्याच्या पुढील महिन्यापासून सुरू होईल.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}