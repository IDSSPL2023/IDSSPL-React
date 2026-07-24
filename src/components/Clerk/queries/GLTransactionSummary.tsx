import { useEffect, useState } from "react";
import { X, Check, Eye, FileText, Wallet, RefreshCw, ChevronsDown } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "@/components/shared/Inputs/TextInput";
import { GlobalTable, ColumnDef } from "./GlobalTable";

export interface GLTransactionSummaryData {
  openingBalance: string;
  closingBalance: string;
  projectedCash: string;
  calculatedClosingBalance: string;
  transactionRows: Array<{
    id: string;
    transactionType: string;
    creditVouchers: string;
    creditAmount: string;
    debitVouchers: string;
    debitAmount: string;
  }>;
  voucherRows: Array<{
    id: string;
    accountCode: string;
    scrollNo: string;
    indicator: string;
    amount: string;
    particular: string;
  }>;
}

export const emptyGLTransactionSummaryData: GLTransactionSummaryData = {
  openingBalance: "28600746.00",
  closingBalance: "28600846.00",
  projectedCash: "2.8600936E7",
  calculatedClosingBalance: "-2.8600846E7",
  transactionRows: [
    {
      id: "1",
      transactionType: "Cash",
      creditVouchers: "0 1",
      creditAmount: "100.00",
      debitVouchers: "0 0",
      debitAmount: "0 0",
    },
    {
      id: "2",
      transactionType: "Transfer",
      creditVouchers: "0 0",
      creditAmount: "0 0",
      debitVouchers: "0 0",
      debitAmount: "0 0",
    },
    {
      id: "3",
      transactionType: "Clearing",
      creditVouchers: "0 0",
      creditAmount: "0 0",
      debitVouchers: "0 0",
      debitAmount: "0 0",
    },
  ],
  voucherRows: [
    {
      id: "1",
      accountCode: "00022010000001",
      scrollNo: "181",
      indicator: "CSDR",
      amount: "10",
      particular: "To Self",
    },
    {
      id: "2",
      accountCode: "00022010000007",
      scrollNo: "121",
      indicator: "CSDR",
      amount: "100",
      particular: "By Cash Deposit From Unknown",
    },
  ],
};

export type GLTransactionSummaryMode = "view" | "edit";

interface GLTransactionSummaryProps {
  open: boolean;
  mode?: GLTransactionSummaryMode;
  initialData?: GLTransactionSummaryData;
  onClose?: () => void;
  onApply?: (data: GLTransactionSummaryData) => void;
  onValidate?: () => void;
  onDisplayVouchers?: () => void;
  onBounce?: () => void;
  onCancel?: () => void;
}

function GLTransactionSummary({
  open,
  mode = "view",
  initialData = emptyGLTransactionSummaryData,
  onClose,
  onApply,
  onValidate,
  onDisplayVouchers,
  onBounce,
  onCancel,
}: GLTransactionSummaryProps) {
  const [formData, setFormData] = useState<GLTransactionSummaryData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof GLTransactionSummaryData, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof GLTransactionSummaryData>(
    key: K,
    value: GLTransactionSummaryData[K]
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    onValidate?.();
    setValidated(true);
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleDisplayVouchers = () => {
    onDisplayVouchers?.();
  };

  const handleBounce = () => {
    if (!validated) return;
    onBounce?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "GL Transaction Summary",
    titleHi: "GL व्यवहार सारांश",
    subtitle: "Review debit and credit voucher totals before completing GL tally.",
    subtitleHi: "GL टेली पूर्ण करण्यापूर्वी डेबिट व क्रेडिट व्हाउचरची एकूण माहिती तपासा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => [
    {
      label: "Validate",
      onClick: handleValidate,
      variant: "primary" as const,
      icon: <Check size={16} />,
      className: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      label: "Display Vouchers",
      onClick: handleDisplayVouchers,
      variant: "outline" as const,
      icon: <FileText size={16} />,
    },
    {
      label: "Cancel",
      onClick: handleCancel,
      variant: "outline" as const,
      icon: <X size={16} />,
    },
    {
      label: "Bounce",
      onClick: handleBounce,
      variant: "outline" as const,
      icon: <ChevronsDown size={16} />,
      disabled: !validated,
      className: validated
        ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
        : "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200",
    },
  ];

  const transactionColumns: ColumnDef[] = [
    {
      header: "Transaction Type",
      accessorKey: "transactionType",
      className: "font-semibold text-slate-800",
    },
    {
      header: "Credit Vouchers",
      accessorKey: "creditVouchers",
      cell: (value: string) => (
        <div className="relative w-full">
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            readOnly
            value={value}
            className="w-full rounded-lg border border-transparent bg-[#F4F6F8] py-1.5 pl-9 pr-3 text-sm font-medium text-slate-700"
          />
        </div>
      ),
    },
    {
      header: "Credit Amount",
      accessorKey: "creditAmount",
      cell: (value: string) => (
        <div className="relative w-full">
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            readOnly
            value={value}
            className="w-full rounded-lg border border-transparent bg-[#F4F6F8] py-1.5 pl-9 pr-3 text-sm font-medium text-slate-700"
          />
        </div>
      ),
    },
    {
      header: "Debit Vouchers",
      accessorKey: "debitVouchers",
      cell: (value: string) => (
        <div className="relative w-full">
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            readOnly
            value={value}
            className="w-full rounded-lg border border-transparent bg-[#F4F6F8] py-1.5 pl-9 pr-3 text-sm font-medium text-slate-700"
          />
        </div>
      ),
    },
    {
      header: "Debit Amount",
      accessorKey: "debitAmount",
      cell: (value: string) => (
        <div className="relative w-full">
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            readOnly
            value={value}
            className="w-full rounded-lg border border-transparent bg-[#F4F6F8] py-1.5 pl-9 pr-3 text-sm font-medium text-slate-700"
          />
        </div>
      ),
    },
  ];

  const voucherColumns: ColumnDef[] = [
    {
      header: "Account Code",
      accessorKey: "accountCode",
      className: "font-bold text-slate-900",
    },
    {
      header: "Scroll No.",
      accessorKey: "scrollNo",
      className: "text-slate-600",
    },
    {
      header: "Indicator",
      accessorKey: "indicator",
      className: "font-medium text-slate-700",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "font-medium text-slate-700",
    },
    {
      header: "Particular",
      accessorKey: "particular",
      className: "font-medium text-slate-700",
    },
  ];

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      header={getHeaderConfig()}
      footerButtons={getFooterButtons()}
      footerAlign="right"
      showDefaultClose={false}
      maxWidth="full"
    >
      <SectionWrapper
        icon={<img src={ICONS.PERSON} alt="Cash Balance Summary" className="h-10 w-10" />}
        titleEn="Cash Balance Summary"
        titleHi="रोकड शिल्लक सारांश"
        subtitleEn="Compare actual cash balance with calculated cash position."
        subtitleHi="प्रत्यक्ष रोकड शिल्लक व गणना केलेली रोकड स्थिती यांची तुलना करा."
        className="mb-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            labelEn="Opening Balance"
            labelHi="सुरुवातीची शिल्लक"
            icon={Wallet}
            placeholder="Opening Balance"
            value={formData.openingBalance}
            onChange={(v) => handleChange("openingBalance", v)}
            readOnly={isView}
          />

          <TextInput
            labelEn="Closing Balance"
            labelHi="समाप्ती शिल्लक"
            icon={Wallet}
            placeholder="Closing Balance"
            value={formData.closingBalance}
            onChange={(v) => handleChange("closingBalance", v)}
            readOnly={isView}
          />

          <TextInput
            labelEn="Projected Cash"
            labelHi="अंदाजित रोकड"
            icon={Wallet}
            placeholder="Projected Cash"
            value={formData.projectedCash}
            onChange={(v) => handleChange("projectedCash", v)}
            readOnly={isView}
          />

          <TextInput
            labelEn="Calculated Closing Balance"
            labelHi="गणना केलेली समाप्ती शिल्लक"
            icon={Wallet}
            placeholder="Calculated Closing Balance"
            value={formData.calculatedClosingBalance}
            onChange={(v) => handleChange("calculatedClosingBalance", v)}
            readOnly={isView}
          />
        </div>
      </SectionWrapper>

      <div className="mb-6">
        <GlobalTable
          columns={transactionColumns}
          data={formData.transactionRows}
          className="rounded-xl border border-slate-200"
          headerClassName="bg-[#181C43] text-white text-xs font-semibold"
          rowClassName="hover:bg-slate-50 divide-y divide-slate-100"
          cellClassName="px-4 py-3"
          showStriped={false}
          hoverable={true}
          bordered={false}
        />
      </div>

      <GlobalTable
        columns={voucherColumns}
        data={formData.voucherRows}
        className="rounded-xl border border-slate-200"
        headerClassName="bg-[#181C43] text-white text-xs font-semibold"
        rowClassName="hover:bg-slate-50 divide-y divide-slate-100"
        cellClassName="px-4 py-3"
        showStriped={false}
        hoverable={true}
        bordered={false}
      />
    </ModalWrapper>
  );
}

export default GLTransactionSummary;