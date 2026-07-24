import { useEffect, useState } from "react";
import { X, Check, Eye, FileText, Wallet, RefreshCw, ChevronsDown } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "@/components/shared/Inputs/TextInput";
import { GlobalTable, ColumnDef } from "./GlobalTable";

export interface TransactionListData {
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

export const emptyTransactionListData: TransactionListData = {
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

export type TransactionListMode = "view" | "edit";

interface TransactionListProps {
  open: boolean;
  mode?: TransactionListMode;
  initialData?: TransactionListData;
  onClose?: () => void;
  onApply?: (data: TransactionListData) => void;
  onValidate?: () => void;
  onDisplayVouchers?: () => void;
  onBounce?: () => void;
  onCancel?: () => void;
}

function TransactionList({
  open,
  mode = "view",
  initialData = emptyTransactionListData,
  onClose,
  onApply,
  onValidate,
  onDisplayVouchers,
  onBounce,
  onCancel,
}: TransactionListProps) {
  const [formData, setFormData] = useState<TransactionListData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionListData, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof TransactionListData>(
    key: K,
    value: TransactionListData[K]
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

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "All Transaction List",
    titleHi: "सभी लेन-देन की सूची",
    subtitle: "Review debit and credit voucher totals before completing GL tally.",
    subtitleHi: "GL टैंकी पूर्ण करण्यापूर्वी डेबिट व क्रेडिट व्हाउचरची एकूण माहिती तपासा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => [
    {
      label: "Validate",
      onClick: handleValidate,
      variant: "primary" as const,
      icon: <Check size={16} />,
    },
    {
      label: "Display Vouchers",
      onClick: onDisplayVouchers || (() => {}),
      variant: "outline" as const,
      icon: <FileText size={16} />,
      // className: "bg-[#F3F4FB] text-[#0B63C1] hover:bg-[#E8EDF8]",
    },
    {
      label: "Cancel",
      onClick: onCancel || onClose || (() => {}),
      variant: "outline" as const,
      icon: <X size={16} />,
    },
    {
      label: "Bounce",
      onClick: onBounce || (() => {}),
      variant: "outline" as const,
      icon: <ChevronsDown size={16} />,
      className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
    },
  ];

  // Transaction List Data
  const transactionListData = [
    {
      scrNo: "2",
      sscrNo: "147",
      tNo: "1",
      stNo: "00022010000005",
      accountCode: "00022010000005",
      accountName: "Jatti Srishil",
      amount: "100.00",
      txnInd: "Cash Credit",
      particular: "By Cash",
      status: "authorize",
      userId: "abc",
      officeId: "admin",
    },
    {
      scrNo: "2",
      sscrNo: "147",
      tNo: "1",
      stNo: "00022010000005",
      accountCode: "00022010000005",
      accountName: "Jatti Srishil",
      amount: "100.00",
      txnInd: "Cash Credit",
      particular: "By Cash",
      status: "authorize",
      userId: "abc",
      officeId: "admin",
    },
  ];

  const transactionColumns: ColumnDef[] = [
    { header: "Scr No", accessorKey: "scrNo", className: "text-slate-700" },
    { header: "SSCr No", accessorKey: "sscrNo", className: "text-slate-700" },
    { header: "T No", accessorKey: "tNo", className: "text-slate-700" },
    { header: "ST No", accessorKey: "stNo", className: "text-slate-700" },
    {
      header: "Account Code",
      accessorKey: "accountCode",
      className: "font-bold text-slate-900",
    },
    {
      header: "Account Name",
      accessorKey: "accountName",
      className: "text-slate-700",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "font-medium text-slate-700",
    },
    { header: "Txn. Ind", accessorKey: "txnInd", className: "text-slate-700" },
    { header: "Particular", accessorKey: "particular", className: "text-slate-700" },
    { header: "Status", accessorKey: "status", className: "text-slate-700" },
    { header: "UserID", accessorKey: "userId", className: "text-slate-700" },
    { header: "OfficeId", accessorKey: "officeId", className: "text-slate-700" },
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
        icon={<img src={ICONS.PERSON} alt="Transaction Details" className="h-10 w-10" />}
        titleEn="Transaction Details"
        titleHi="लेन-देन का विवरण"
        subtitleEn="Compare actual cash balance with calculated cash position."
        subtitleHi="प्रत्यक्ष रोकडा सिल्लक व गणना केलेली रोकडा स्थिती यांची तुलना करा."
        className="mb-6"
      >
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <TextInput
            labelEn="Txn Date"
            labelHi="लेन-देन तारीख"
            icon={Wallet}
            placeholder="Select Date"
            value=""
            onChange={() => {}}
            readOnly={false}
          />
        </div>

        <GlobalTable
          columns={transactionColumns}
          data={transactionListData}
          className="rounded-xl border border-slate-200"
          headerClassName="bg-[#181C43] text-white text-xs font-semibold"
          rowClassName="hover:bg-slate-50 divide-y divide-slate-100"
          cellClassName="px-4 py-3"
          showStriped={false}
          hoverable={true}
          bordered={false}
        />
      </SectionWrapper>
    </ModalWrapper>
  );
}

export default TransactionList;