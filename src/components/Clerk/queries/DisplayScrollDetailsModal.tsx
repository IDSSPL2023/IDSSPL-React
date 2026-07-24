import { useEffect, useState } from "react";
import { X, Check, Eye, Users, ChevronsDown } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import { ICONS } from "@/assets";
import { GlobalTable, ColumnDef } from "./GlobalTable";

export interface DisplayScrollDetailsFormData {
  scrollDetails: Array<{
    id: string;
    accountCode: string;
    glAccCode: string;
    txnIndicator: string;
    amount: string;
    accBalance: string;
    chequeSeries: string;
    chequeNo: string;
    chequeDate: string;
    particular: string;
    userId: string;
    officerId: string;
  }>;
}

export const emptyDisplayScrollDetailsFormData: DisplayScrollDetailsFormData = {
  scrollDetails: [
    {
      id: "1",
      accountCode: "864365645684",
      glAccCode: "643978738467",
      txnIndicator: "147",
      amount: "1",
      accBalance: "00022010000005",
      chequeSeries: "Jatti Srishil",
      chequeNo: "100.00",
      chequeDate: "2024-01-15",
      particular: "By Cash",
      userId: "abc",
      officerId: "admin",
    },
    {
      id: "2",
      accountCode: "039742709349",
      glAccCode: "794737598570",
      txnIndicator: "147",
      amount: "1",
      accBalance: "00022010000005",
      chequeSeries: "Jatti Srishil",
      chequeNo: "100.00",
      chequeDate: "2024-01-15",
      particular: "By Cash",
      userId: "abc",
      officerId: "abc",
    },
  ],
};

export type DisplayScrollDetailsMode = "view" | "edit";

export interface DisplayScrollDetailsProps {
  open: boolean;
  mode?: DisplayScrollDetailsMode;
  initialData?: DisplayScrollDetailsFormData;
  onClose?: () => void;
  onApply?: (data: DisplayScrollDetailsFormData) => void;
  onDisplayBalance?: () => void;
  onDisplayGuarantor?: () => void;
}

function DisplayScrollDetailsModal({
  open,
  mode = "view",
  initialData = emptyDisplayScrollDetailsFormData,
  onClose,
  onApply,
  onDisplayBalance,
  onDisplayGuarantor,
}: DisplayScrollDetailsProps) {
  const [formData, setFormData] =
    useState<DisplayScrollDetailsFormData>(initialData);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const scrollColumns: ColumnDef[] = [
    {
      header: "Account Code",
      accessorKey: "accountCode",
      className: "font-bold text-slate-900",
      headerClassName: "text-left",
    },
    {
      header: "GL ACC Code",
      accessorKey: "glAccCode",
      className: "text-slate-700",
    },
    {
      header: "Txn Indicator",
      accessorKey: "txnIndicator",
      className: "text-slate-700",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "text-slate-700",
    },
    {
      header: "Acc Balance",
      accessorKey: "accBalance",
      className: "text-slate-700",
    },
    {
      header: "Cheque Series",
      accessorKey: "chequeSeries",
      className: "text-slate-700",
    },
    {
      header: "Cheque No",
      accessorKey: "chequeNo",
      className: "text-slate-700",
    },
    {
      header: "Cheque Date",
      accessorKey: "chequeDate",
      className: "text-slate-700",
    },
    {
      header: "Particular",
      accessorKey: "particular",
      className: "text-slate-700",
    },
    {
      header: "UserID",
      accessorKey: "userId",
      className: "text-slate-700",
    },
    {
      header: "OfficerID",
      accessorKey: "officerId",
      className: "text-slate-700",
    },
  ];

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "Display Scroll Details",
    titleHi: "सभी लेन-देन की सूची",
    subtitle:
      "View loan account information, overdue balance and receivable details.",
    subtitleHi:
      "करें खात्याची माहिती, थकबाकी शिल्पक आणि प्राप्तीची माहिती पडा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => {
  if (isView) {
    return [
      {
        label: "Display Balance",
        onClick: onDisplayBalance || (() => {}),  // Provide fallback
        variant: "outline" as const,
        icon: <ChevronsDown size={16} />,
        disabled: !validated,
        className: validated
          ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
          : "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200",
      },
      {
        label: "Display Guarantor",
        onClick: onDisplayGuarantor || (() => {}),  // Provide fallback
        variant: "primary" as const,
        icon: <ChevronsDown size={16} />,
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),  // Provide fallback
        variant: "outline" as const,
        icon: <X size={16} />,
      },
    ];
  }

  return [
    {
      label: "Validate",
      onClick: () => setValidated(true),
      variant: "primary" as const,
      icon: <Check size={16} />,
    },
    {
      label: "Cancel",
      onClick: onClose || (() => {}),  // Provide fallback
      variant: "outline" as const,
      icon: <X size={16} />,
    },
    {
      label: "Save",
      onClick: () => onApply?.(formData),
      variant: "primary" as const,
      icon: <Check size={16} />,
      disabled: !validated,
      className: validated
        ? "bg-primary-100 text-primary hover:bg-primary-200"
        : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
    },
  ];
};

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
      <GlobalTable
        columns={scrollColumns}
        data={formData.scrollDetails}
        className="rounded-xl border border-slate-200"
        headerClassName="bg-[#181C43] text-white text-xs font-semibold"
        rowClassName="hover:bg-slate-50 divide-y divide-slate-100"
        cellClassName="px-4 py-3"
        showStriped={false}
        hoverable={true}
        bordered={false}
        compact={false}
      />
    </ModalWrapper>
  );
}

export default DisplayScrollDetailsModal;