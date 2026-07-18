import React, { useState } from "react";
import {
  User,
  CreditCard,
  FileText,
  MoreVertical,
  Calendar,
} from "lucide-react";

interface CardSectionProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  description: string;
  children: React.ReactNode;
}

function CardSection({ icon, title, subTitle, description, children }: CardSectionProps) {
  return (
    <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800">{icon}</div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {title} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">/ {subTitle}</span>
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function LabeledInput({
  label,
  labelHi,
  placeholder,
  icon: Icon,
  value,
  onChange,
  hasMenu,
  onMenuClick,
  type = "text",
}: {
  label: string;
  labelHi: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  hasMenu?: boolean;
  onMenuClick?: () => void;
  type?: "text" | "date";
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
        <span className="text-slate-400 dark:text-slate-500 font-normal">
          {" "}
          <span className="text-slate-600 dark:text-slate-400">/</span> {labelHi}
        </span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div className="group flex flex-1 items-center w-full h-9 rounded-[10px] border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 px-2.5 transition-all duration-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none placeholder:font-medium text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder-slate-500"
          />
        </div>
        {hasMenu && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <MoreVertical size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// CHARGES TABLE DATA
// ==========================================

interface ChargeRow {
  key: string;
  type: string;
  typeHi: string;
  charge: string;
  chargeHi: string;
  isTotal?: boolean;
}

const CHARGE_ROWS: ChargeRow[] = [
  { key: "insurance", type: "Insurance", typeHi: "विमा", charge: "Insurance", chargeHi: "विमा" },
  { key: "recovery", type: "Recovery", typeHi: "वसुली", charge: "Recovery", chargeHi: "वसुली" },
  { key: "insuranceFire", type: "Insurance Fire", typeHi: "आग विमा", charge: "Insurance Fire", chargeHi: "आग विमा" },
  { key: "abnFees", type: "ABN Fees", typeHi: "एबीएन शुल्क", charge: "ABN Fees", chargeHi: "एबीएन शुल्क" },
  { key: "executionFees", type: "Execution Fees", typeHi: "अंमलबजावणी शुल्क", charge: "Execution Fees", chargeHi: "अंमलबजावणी शुल्क" },
  { key: "otherCharges", type: "Other Charges", typeHi: "इतर आकार", charge: "Other Charges", chargeHi: "इतर आकार" },
  { key: "transferGlHead", type: "Transfer GL Head", typeHi: "इतर आकार", charge: "Grand Total", chargeHi: "एकूण रक्कम", isTotal: true },
];

interface ChargeCells {
  glHeadCode: string;
  glDescription: string;
  totalAmount: string;
}

const EMPTY_CHARGE_CELLS: ChargeCells = { glHeadCode: "", glDescription: "", totalAmount: "" };

// ==========================================
// FORM
// ==========================================

const TlOtherChargesForm = () => {
  const [scrollNumber, setScrollNumber] = useState("");
  const [particular, setParticular] = useState("");
  const [accountCode, setAccountCode] = useState("00025050002501");
  const [insuranceDate, setInsuranceDate] = useState("");
  const [recoveryAmt, setRecoveryAmt] = useState("");
  const [insuranceFireAmt, setInsuranceFireAmt] = useState("");
  const [abnFeesAmt, setAbnFeesAmt] = useState("");
  const [executionFeesAmt, setExecutionFeesAmt] = useState("");

  const [chargeData, setChargeData] = useState<Record<string, ChargeCells>>(
    () =>
      Object.fromEntries(
        CHARGE_ROWS.map((row) => [row.key, { ...EMPTY_CHARGE_CELLS }])
      )
  );

  const updateCharge = (key: string, field: keyof ChargeCells, value: string) => {
    setChargeData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleValidate = () => {
    console.log("Validate clicked", { scrollNumber, particular, chargeData });
  };

  return (
    <div className="px-6 py-3 space-y-4 max-w-8xl mx-auto">
      {/* Payment Details */}
      <CardSection
        icon={<User className="w-4 h-4 text-blue-600" />}
        title="Payment Details"
        subTitle="पेमेंट तपशील"
        description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LabeledInput
            label="Scroll Number"
            labelHi="स्कोल क्रमांक"
            placeholder="Scroll Number"
            icon={FileText}
            value={scrollNumber}
            onChange={setScrollNumber}
          />
        </div>
      </CardSection>

      {/* Charges Details */}
      <CardSection
        icon={<User className="w-4 h-4 text-blue-600" />}
        title="Charges Details"
        subTitle="आकारांचा तपशील"
        description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      >
        <div className="border border-slate-200 dark:border-slate-800 rounded-[10px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#1e1b4b]">
                  {["Type", "GI Head Code", "GI Description", "Charges", "Total Amount", "Tallied"].map((label) => (
                    <th
                      key={label}
                      className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold text-white"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {CHARGE_ROWS.map((row) => {
                  const cells = chargeData[row.key];

                  return (
                    <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-2 align-middle">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.type}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.typeHi}</div>
                          </div>
                          <button
                            type="button"
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-blue-600 bg-blue-50 text-blue-600 transition hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <MoreVertical size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">₹</span>
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            value={cells.glHeadCode}
                            onChange={(e) => updateCharge(row.key, "glHeadCode", e.target.value)}
                            className="w-full text-sm font-medium border border-slate-200 bg-white rounded-[8px] py-1.5 pl-6 pr-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder-slate-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">₹</span>
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            value={cells.glDescription}
                            onChange={(e) => updateCharge(row.key, "glDescription", e.target.value)}
                            className="w-full text-sm font-medium border border-slate-200 bg-white rounded-[8px] py-1.5 pl-6 pr-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder-slate-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.charge}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.chargeHi}</div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">₹</span>
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            value={cells.totalAmount}
                            onChange={(e) => updateCharge(row.key, "totalAmount", e.target.value)}
                            className="w-full text-sm font-medium border border-slate-200 bg-white rounded-[8px] py-1.5 pl-6 pr-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder-slate-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">₹</span>
                          <div className="w-full text-right text-sm font-medium border border-slate-200 bg-slate-50 rounded-[8px] py-1.5 px-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                            0.0
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Particular
              <span className="text-slate-400 dark:text-slate-500 font-normal">
                {" "}
                <span className="text-slate-600 dark:text-slate-400">/</span> तपशील
              </span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center w-full h-9 rounded-[10px] border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 px-2.5 transition-all duration-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="By Cash"
                value={particular}
                onChange={(e) => setParticular(e.target.value)}
                className="ml-2 w-full bg-transparent outline-none placeholder:font-medium text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 shrink-0"
          >
            Validate <span>✓</span>
          </button>
        </div>
      </CardSection>

      {/* Account Details */}
      <CardSection
        icon={<User className="w-4 h-4 text-blue-600" />}
        title="Account Details"
        subTitle="खाते तपशील"
        description="Manage customer's personal and identity information. / ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LabeledInput
            label="Account Code"
            labelHi="खाते कोड"
            placeholder="Account Code"
            icon={FileText}
            value={accountCode}
            onChange={setAccountCode}
            hasMenu
            onMenuClick={() => console.log("Open account code menu")}
          />
          <LabeledInput
            label="Insurance"
            labelHi="विमा"
            placeholder="DD-MMM-YYYY"
            icon={Calendar}
            value={insuranceDate}
            onChange={setInsuranceDate}
          />
          <LabeledInput
            label="Recovery"
            labelHi="वसुली"
            placeholder="Enter Amount"
            icon={CreditCard}
            value={recoveryAmt}
            onChange={setRecoveryAmt}
          />
          <LabeledInput
            label="Insurance Fire"
            labelHi="आग विमा"
            placeholder="Enter Amount"
            icon={CreditCard}
            value={insuranceFireAmt}
            onChange={setInsuranceFireAmt}
          />
          <LabeledInput
            label="ABN Fees"
            labelHi="एबीएन शुल्क"
            placeholder="Enter Amount"
            icon={CreditCard}
            value={abnFeesAmt}
            onChange={setAbnFeesAmt}
          />
          <LabeledInput
            label="Execution Fees"
            labelHi="अंमलबजावणी शुल्क"
            placeholder="Enter Amount"
            icon={CreditCard}
            value={executionFeesAmt}
            onChange={setExecutionFeesAmt}
          />
        </div>
      </CardSection>
    </div>
  );
};

export default TlOtherChargesForm;
