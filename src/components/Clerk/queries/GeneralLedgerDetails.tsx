import { useEffect, useState } from "react";
import { X, Check, FileText, ArrowRight } from "lucide-react";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { ICONS } from "@/assets";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";
import { GlobalTable, ColumnDef } from "./GlobalTable";

export interface GeneralLedgerDetailsFormData {
  branchCode: string;
  branchName: string;
  date: string;
  ledgerRows: Array<{
    id: string;
    glAccountCode: string;
    description: string;
    currentBalance: string;
    action: string;
  }>;
}

export const emptyGeneralLedgerDetailsFormData: GeneralLedgerDetailsFormData = {
  branchCode: "",
  branchName: "",
  date: "",
  ledgerRows: [
    {
      id: "1",
      glAccountCode: "00000000100101",
      description: "Cash On Hand",
      currentBalance: "-54278194",
      action: "Show",
    },
    {
      id: "2",
      glAccountCode: "00000000100104",
      description: "Unsecured Loan(Medium-Term)",
      currentBalance: "-7869",
      action: "Show",
    },
    {
      id: "3",
      glAccountCode: "00000000100105",
      description: "Cash Credit Loan",
      currentBalance: "-232934741.4",
      action: "Show",
    },
    {
      id: "4",
      glAccountCode: "00000000100106",
      description: "Secured Medium-Term Agriculture",
      currentBalance: "0",
      action: "Select",
    },
    {
      id: "5",
      glAccountCode: "00000000100106",
      description: "Pay Deduction Loan",
      currentBalance: "-3980731",
      action: "Show",
    },
    {
      id: "6",
      glAccountCode: "00000000100107",
      description: "Vehicle Loan",
      currentBalance: "-4556582",
      action: "Show",
    },
  ],
};

export type GeneralLedgerDetailsMode = "view" | "edit";

type RequiredFieldKey = keyof Pick<
  GeneralLedgerDetailsFormData,
  "branchCode" | "branchName" | "date"
>;

const REQUIRED_FIELDS: RequiredFieldKey[] = ["branchCode", "branchName", "date"];

const BRANCH_CODE_DATA: ListModalItem[] = [
  { id: "1", code: "BR001", name: "Mumbai Main Branch" },
  { id: "2", code: "BR002", name: "Delhi Branch" },
  { id: "3", code: "BR003", name: "Bangalore Branch" },
  { id: "4", code: "BR004", name: "Chennai Branch" },
];

export interface GeneralLedgerDetailsProps {
  open: boolean;
  mode?: GeneralLedgerDetailsMode;
  initialData?: GeneralLedgerDetailsFormData;
  onClose?: () => void;
  onApply?: (data: GeneralLedgerDetailsFormData) => void;
  onValidate?: () => void;
  onGenerate?: () => void;
}

function GeneralLedgerDetails({
  open,
  mode = "view",
  initialData = emptyGeneralLedgerDetailsFormData,
  onClose,
  onApply,
  onValidate,
  onGenerate,
}: GeneralLedgerDetailsProps) {
  const [formData, setFormData] = useState<GeneralLedgerDetailsFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<RequiredFieldKey, boolean>>>({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<"branchCode">("branchCode");

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open, mode]);

  if (!open) return null;

  const isView = mode === "view";

  const handleChange = <K extends keyof GeneralLedgerDetailsFormData>(
    key: K,
    value: GeneralLedgerDetailsFormData[K]
  ) => {
    if (isView) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key as RequiredFieldKey]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<RequiredFieldKey, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    onValidate?.();
  };

  const handleApply = () => {
    if (!validated) return;
    onApply?.(formData);
  };

  const handleOpenList = (type: typeof listType) => {
    setListType(type);
    setOpenList(true);
  };

  const handleSelectItem = (row: Record<string, any>) => {
    if (listType === "branchCode") {
      handleChange("branchCode", row.code);
      handleChange("branchName", row.name);
    }
    setOpenList(false);
  };

  const getListData = () => {
    return {
      title: "Branch List",
      rows: BRANCH_CODE_DATA,
      codeLabel: "Branch Code",
      nameLabel: "Branch Name",
    };
  };

  const listData = getListData();

  const ledgerColumns: ColumnDef[] = [
    {
      header: "GL Account Code",
      accessorKey: "glAccountCode",
      className: "font-bold text-slate-900",
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "text-slate-700",
    },
    {
      header: "Current Balance",
      accessorKey: "currentBalance",
      className: "font-medium",
      cell: (value: string) => {
        const numValue = parseFloat(value);
        return (
          <span
            className={
              numValue < 0
                ? "text-red-600"
                : numValue > 0
                ? "text-green-600"
                : "text-slate-700"
            }
          >
            {value}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (value: string, row: any) => (
        <button
          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === "Select"
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            if (!isView) {
              console.log(`Action clicked for ${row.glAccountCode}`);
            }
          }}
          disabled={isView}
        >
          {value}
          {value === "Select" && <ArrowRight size={12} />}
        </button>
      ),
    },
  ];

  const getHeaderConfig = () => ({
    icon: ICONS.PERSON,
    title: "General Ledger Details",
    titleHi: "रजेच्या अजांची नोंद",
    subtitle: "Configure earning and deduction components used for payroll calculation and salary processing.",
    subtitleHi: "वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा.",
    onClose: onClose,
    showCloseButton: true,
  });

  const getFooterButtons = () => {
    return [
      {
        label: "Validate",
        onClick: handleValidate,
        variant: "primary" as const,
        icon: <Check size={16} />,
      },
      {
        label: "Generate",
        onClick: onGenerate || (() => {}),
        variant: "outline" as const,
        icon: <FileText size={16} />,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
      },
      {
        label: "Save",
        onClick: handleApply,
        variant: "primary" as const,
        icon: <Check size={16} />,
        disabled: !validated,
        className: validated
          ? "bg-primary-100 text-primary hover:bg-primary-200"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600",
      },
      {
        label: "Cancel",
        onClick: onClose || (() => {}),
        variant: "outline" as const,
        icon: <X size={16} />,
      },
      
    ];
  };

  return (
    <>
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
          icon={<img src={ICONS.PERSON} alt="Bank Details" className="h-10 w-10" />}
          titleEn="Bank Details"
          titleHi="उपस्थितीचा तपशील अद्ययावत करा"
          subtitleEn="Create or manage salary processing instructions for an employee."
          subtitleHi="कर्मचाऱ्याच्या वेतन प्रक्रियेसाठी सूचना तयार करा किंवा व्यवस्थापित करा."
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <PickerInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={ICONS.USER_CIRCLE}
              placeholder="Select Branch"
              value={formData.branchCode}
              onChange={(v) => handleChange("branchCode", v)}
              readOnly={isView}
              handleOpenList={() => handleOpenList("branchCode")}
              required
              hasError={errors.branchCode}
            />

            <TextInput
              labelEn="Branch Name"
              labelHi="शाखा नाव"
              icon={ICONS.USER_CIRCLE}
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(v) => handleChange("branchName", v)}
              readOnly={isView}
              required
              hasError={errors.branchName}
            />

            <TextInput
              labelEn="Date"
              labelHi="तारीख"
              icon={ICONS.CALENDAR_STATS}
              placeholder="Select Date"
              value={formData.date}
              onChange={(v) => handleChange("date", v)}
              readOnly={isView}
              required
              hasError={errors.date}
            />
          </div>
        </SectionWrapper>

        <GlobalTable
          columns={ledgerColumns}
          data={formData.ledgerRows}
          className="rounded-xl border border-slate-200"
          headerClassName="bg-[#181C43] text-white text-xs font-semibold"
          rowClassName="hover:bg-slate-50 divide-y divide-slate-100"
          cellClassName="px-4 py-3"
          showStriped={false}
          hoverable={true}
          bordered={false}
        />
      </ModalWrapper>

      {openList && (
        <ListModal
          title={listData.title}
          rows={listData.rows}
          codeLabel={listData.codeLabel}
          nameLabel={listData.nameLabel}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}

export default GeneralLedgerDetails;