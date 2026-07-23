import { IMAGES } from "@/assets";
import { MouseEventHandler, useEffect, useState, useMemo } from "react";
import { User, IdCard, Building2, HomeIcon, FlagIcon, X, ChevronDown, MoreVertical, FileText, Wallet, Calendar, ShieldAlert, CodeIcon, UserCheck, DollarSign, ThumbsUp, ThumbsDown, IndianRupee, Percent, Clock, ShieldCheck } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, SelectField, TextInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import FilterModal, { type AccountFilters } from "@/components/shared/FilterModal";
import AccountMasterTable, { type ColumnConfig, type RowData } from "@/components/AccountMaster/AccountMasterTable";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import StatePicklistField from "@/components/common/StatePicklistField";

/* ===== from AuthorizePigmyOpenModal.tsx ===== */
/* ===================== Shared types ===================== */

export interface AuthorizePigmyOpenModal_AuthorizePigmyOpenData {
  customerId: string;
  customerName: string;
  categoryCode: string;
  riskCategory: string;
  introducerAccountCode: string;
  introducerAccountName: string;
  dateOfApplication: string;
  accountOperationCapacityId: string;
  minBalanceId: string;
  // Pigmy details
  accountType: string;
  agentBranchCode: string;
  agentBranchName: string;
  openingDate: string;
  installmentAmount: string;
  interestRate: string;
  interestPaidIn: string;
  periodOfDeposit: string;
  maturityDate: string;
  agentName: string;
  agentId: string;
  // Nominee specific fields
  salutationCode?: string;
  nomineeCustomerId?: string;
  nomineeName?: string;
  relation?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

/* ===================== Config ===================== */

const AuthorizePigmyOpenModal_CONFIG = {
  icon: IMAGES.SHIELD_CHECK,
  titleEn: "Authorize Pigmy Open Details",
  titleHi: "पिग्मी ओपन तपशील अधिकृत करा",
  descEn: "Check information related to the Pigmy account and Authorize them.",
  descHi: "पिग्मी खात्याशी संबंधित माहिती तपासा आणि अधिकृत करा",
};

const AuthorizePigmyOpenModal_DEFAULT_DATA: AuthorizePigmyOpenModal_AuthorizePigmyOpenData = {
  customerId: "00012",
  customerName: "Akshay Om More",
  categoryCode: "Public",
  riskCategory: "Low",
  introducerAccountCode: "1001",
  introducerAccountName: "Saving Account",
  dateOfApplication: "27-Feb-2026",
  accountOperationCapacityId: "Self",
  minBalanceId: "200",
  accountType: "PIG - Pigmy Deposit",
  agentBranchCode: "BR001",
  agentBranchName: "Kolhapur Main Branch",
  openingDate: "27-Feb-2026",
  installmentAmount: "500",
  interestRate: "6%",
  interestPaidIn: "Day",
  periodOfDeposit: "12 Months",
  maturityDate: "27-Feb-2027",
  agentName: "Suresh Naik",
  agentId: "AG0012",
  salutationCode: "MR",
  nomineeCustomerId: "00012",
  nomineeName: "Akshay Om More",
  relation: "Father",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
};

/* ===================== Modal ===================== */

export interface AuthorizePigmyOpenModal_AuthorizePigmyOpenProps {
  open: boolean;
  initialData?: Partial<AuthorizePigmyOpenModal_AuthorizePigmyOpenData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function AuthorizePigmyOpenModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizePigmyOpenModal_AuthorizePigmyOpenProps) {
  const [data, setData] = useState<AuthorizePigmyOpenModal_AuthorizePigmyOpenData>({
    ...AuthorizePigmyOpenModal_DEFAULT_DATA,
    ...initialData,
  });
  const [actionModel, setActionModel] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Application");
  const TABS = ["Application", "Pigmy Details", "Nominee", "Joint Holder"] as const;
  type TabKey = (typeof TABS)[number];

  useEffect(() => {
    if (open) {
      setData({ ...AuthorizePigmyOpenModal_DEFAULT_DATA, ...initialData });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleNext = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
  };

  const handleAuthorize = () => {
    setActionModel("authorize");
    onAuthorize && onAuthorize();
  };

  const handleReject = () => {
    setShowRejectReason(true);
  };

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModel("rejected");
    onReject && onReject(reason);
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  const isLastStep = activeTab === "Joint Holder";

  const CustomFooterButton = () => {
    return (
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        {isLastStep && (
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Reject
            <ThumbsDown className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
        >
          Cancel
          <X className="h-4 w-4" />
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleAuthorize}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Authorize
            <ThumbsUp className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Next
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>
        )}
      </div>
    );
  };

  const ToolPick = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary hover:bg-primary-200"
    >
      <MoreVertical size={20} />
    </button>
  );

  function SrNoField({ value }: { value?: string | number }) {
    return (
      <div className="flex h-full max-w-max flex-col">
        <span className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858]">Sr No</span>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-600 bg-slate-50 text-sm font-normal text-[#4B5563]">
          {value ?? "—"}
        </div>
      </div>
    );
  }

  const ApplicationForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <FieldShell label="Customer Id" labelHi="ग्राहक आयडी" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput icon={<IdCard size={16} />} value={data.customerId} onChange={() => {}} readOnly />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
            <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Category Code" labelHi="कॅटेगरी कोड" required>
            <TextInput icon={<Building2 size={16} />} value={data.categoryCode} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Risk Category" labelHi="धोक्याचा प्रकार" required>
            <TextInput icon={<ShieldAlert size={16} />} value={data.riskCategory} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Introducer Account Code" labelHi="ओळखपत्र खात्याचा कोड" required>
            <TextInput icon={<CodeIcon size={16} />} value={data.introducerAccountCode} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Introducer Account Name" labelHi="ओळखपत्र खात्याचे नाव" required>
            <TextInput icon={<Wallet size={16} />} value={data.introducerAccountName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Date of Application" labelHi="अर्जाची तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.dateOfApplication} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField
            labelEn="Account Operation Capacity ID"
            labelMr="खाते ऑपरेशन क्षमता आयडी"
            editable={false}
            icon={UserCheck}
            value={data.accountOperationCapacityId}
            onChange={() => {}}
          />

          <SelectField
            labelEn="Min Balance ID"
            labelMr="किमान शिल्लक आयडी"
            editable={false}
            icon={DollarSign}
            value={data.minBalanceId}
            onChange={() => {}}
          />
        </div>
      </div>
    );
  };

  const PigmyDetailsForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <FieldShell label="Account Type" labelHi="खाते प्रकार" required>
            <TextInput icon={<Wallet size={16} />} value={data.accountType} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Agent Branch Code" labelHi="एजंट शाखा कोड" required>
            <TextInput icon={<CodeIcon size={16} />} value={data.agentBranchCode} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Agent Branch Name" labelHi="एजंट शाखेचे नाव" required>
            <TextInput icon={<Building2 size={16} />} value={data.agentBranchName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Opening Date" labelHi="खाते उघडण्याची तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.openingDate} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Installment Amount" labelHi="हप्ता रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={data.installmentAmount} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Interest Rate" labelHi="व्याजदर" required>
            <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Interest Paid in" labelHi="रोख व्याज" required>
            <TextInput icon={<Clock size={16} />} value={data.interestPaidIn} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Period of Deposit" labelHi="ठेव कालावधी" required>
            <TextInput icon={<Calendar size={16} />} value={data.periodOfDeposit} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.maturityDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Agent Name" labelHi="एजंटचे नाव" required>
            <TextInput icon={<User size={16} />} value={data.agentName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Agent ID" labelHi="एजंट आयडी" required>
            <TextInput icon={<IdCard size={16} />} value={data.agentId} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </div>
    );
  };

  const NomineeForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <div className="flex gap-4">
            <SrNoField value="1" />
            <SelectField labelEn="Salutation Code" labelMr="संबोधनी" editable={false} value={data.salutationCode || "MR"} onChange={() => {}} />
          </div>

          <FieldShell label="Nominee Customer ID" labelHi="नॉमिनी ग्राहक आयडी" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput icon={<IdCard size={16} />} value={data.nomineeCustomerId || data.customerId} onChange={() => {}} readOnly />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell label="Nominee Name" labelHi="नॉमिनी नाव" required>
            <TextInput icon={<User size={16} />} value={data.nomineeName || data.customerName} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField labelEn="Relation" labelMr="नाते" editable={false} icon={UserCheck} value={data.relation || "Father"} onChange={() => {}} />
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address1 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address2 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address3 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.zip || "416005"} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField labelEn="City" labelMr="शहरे" editable={false} icon={HomeIcon} value={data.city || "Kolhapur"} onChange={() => {}} />

          <StatePicklistField
            label="State"
            labelHi="राज्य"
            icon={<HomeIcon size={16} />}
            value={data.state || "Maharashtra"}
            onSelect={() => {}}
            required
            readOnly
          />

          <FieldShell label="Country" labelHi="देश" required>
            <TextInput icon={<FlagIcon size={16} />} value={data.country || "India"} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </div>
    );
  };

  const JointHolderForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid3}>
          <div className="flex gap-4">
            <SrNoField value="1" />
            <SelectField labelEn="Salutation Code" labelMr="संबोधनी" editable={false} value={data.salutationCode || "MR"} onChange={() => {}} />
          </div>

          <FieldShell label="J/T Holder Customer ID" labelHi="J/T धारक ग्राहक आयडी">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput icon={<IdCard size={16} />} value={data.nomineeCustomerId || data.customerId} onChange={() => {}} readOnly />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell label="J/T Holder Name" labelHi="J/T धारकाचे नाव" required>
            <TextInput icon={<User size={16} />} value={data.nomineeName || data.customerName} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address1 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address2 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.address3 || "Kolhapur"} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required>
            <TextInput icon={<HomeIcon size={16} />} value={data.zip || "416005"} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField labelEn="City" labelMr="शहरे" editable={false} icon={Building2} value={data.city || "Kolhapur"} onChange={() => {}} />

          <StatePicklistField
            label="State"
            labelHi="राज्य"
            icon={<Building2 size={16} />}
            value={data.state || "Maharashtra"}
            onSelect={() => {}}
            required
            readOnly
          />

          <FieldShell label="Country" labelHi="देश" required>
            <TextInput icon={<FlagIcon size={16} />} value={data.country || "India"} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </div>
    );
  };

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn={AuthorizePigmyOpenModal_CONFIG.titleEn}
        titleHi={AuthorizePigmyOpenModal_CONFIG.titleHi}
        subtitleEn={AuthorizePigmyOpenModal_CONFIG.descEn}
        subtitleHi={AuthorizePigmyOpenModal_CONFIG.descHi}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={AuthorizePigmyOpenModal_CONFIG.icon} alt={AuthorizePigmyOpenModal_CONFIG.titleEn} width={50} height={50} />
          </div>
        }
      >
        {activeTab === "Application" ? (
          <ApplicationForm />
        ) : activeTab === "Pigmy Details" ? (
          <PigmyDetailsForm />
        ) : activeTab === "Nominee" ? (
          <NomineeForm />
        ) : (
          <JointHolderForm />
        )}

        {showRejectReason && (
          <RejectReasonModal onClose={() => setShowRejectReason(false)} onConfirm={handleConfirmReject} />
        )}

        {actionModel === "authorize" && (
          <SuccessModal
            title="Authorized Successfully"
            subtitle="Your Pigmy Account is Authorized Successfully."
            onClose={() => {
              (setActionModel(null), onClose && onClose());
            }}
            onDone={() => {
              (setActionModel(null), onClose && onClose());
            }}
            variant="success"
          />
        )}

        {actionModel === "rejected" && (
          <SuccessModal
            title="Account Authorization is Rejected"
            subtitle="Your Pigmy account authorization is rejected."
            onClose={() => {
              (setActionModel(null), onClose && onClose());
            }}
            onDone={() => {
              (setActionModel(null), onClose && onClose());
            }}
            variant="critical"
          />
        )}
      </FormModal>
    </>
  );
}


/* ===== from AuthorizePigmyOpenPage.tsx ===== */
const authorizeColumns: ColumnConfig[] = [
  { key: "srNo", labelKey: "accountMaster.table.srNo", sortable: false, width: "80px" },
  { key: "action", labelKey: "accountMaster.table.action", sortable: false, width: "80px" },
  { key: "accountId", labelKey: "accountMaster.table.accountId", sortable: true, width: "160px", emphasize: true },
  { key: "status", labelKey: "accountMaster.table.status", sortable: true, width: "190px" },
  { key: "customerId", labelKey: "accountMaster.table.customerId", sortable: true, width: "140px" },
  { key: "accountName", labelKey: "fields.accountName", sortable: true, width: "200px" },
  { key: "accountType", labelKey: "fields.accountType", sortable: true, width: "180px" },
  { key: "createdBy", labelKey: "accountMaster.table.createdBy", sortable: true, width: "140px" },
  { key: "applicationNo", labelKey: "accountMaster.table.applicationNo", sortable: false, width: "160px" },
];

type AuthorizeRow = RowData & { queue: AuthorizationTabKey };

const QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
  new: "Authorization Pending",
  modify: "Modification Pending",
  rejected: "Authorization Rejected",
};

const AUTHORIZE_ROWS: AuthorizeRow[] = [
  { srNo: 1, accountId: "PIG0012", status: "Live", customerId: "00012", accountName: "Akshay Om More", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "new" },
  { srNo: 2, accountId: "PIG0013", status: "Live", customerId: "00021", accountName: "Nitish Sai Readdy", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "new" },
  { srNo: 3, accountId: "PIG0014", status: "Live", customerId: "00032", accountName: "Sneha Patil", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "modify" },
  { srNo: 4, accountId: "PIG0015", status: "Live", customerId: "00038", accountName: "Deepak Verma", accountType: "Pigmy Deposit", createdBy: "Admin", applicationNo: "0", queue: "rejected" },
];

const AuthorizePigmyOpenPage = () => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({ accountName: "", accountNumber: "", accountType: "" });
  const [openAuthorize, setOpenAuthorize] = useState(false);

  const visibleRows = useMemo(() => {
    return AUTHORIZE_ROWS.filter((row) => row.queue === activeTab).map((row, idx) => ({
      ...row,
      srNo: idx + 1,
      status: QUEUE_STATUS_LABEL[row.queue],
    }));
  }, [activeTab]);

  return (
    <div className="min-h-screen app-page-bg">
      <GlobalNav
        titleEn={en("accountAuthorizeMaster.cards.pigmyAuthorization")}
        titleHi={t("accountAuthorizeMaster.cards.pigmyAuthorization")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountAuthorizeMaster.navTitle"), onClick: () => router.push("/authorization/authorizeaccountmain") },
          { label: en("accountAuthorizeMaster.cards.pigmyAuthorization"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs active={activeTab} onChange={setActiveTab} onOpenFilter={() => setIsFilterOpen(true)} />

        <AccountMasterTable
          filters={filters}
          rows={visibleRows}
          columns={authorizeColumns}
          renderMenuItems={() => [
            { key: "authorize", label: tRaw("common.authorize"), icon: ShieldCheck, onClick: () => setOpenAuthorize(true) },
          ]}
        />
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsFilterOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal initialValues={filters} onClose={() => setIsFilterOpen(false)} onApply={(vals) => setFilters(vals)} />
          </div>
        </div>
      )}

      {openAuthorize && visibleRows.length > 0 && (
        <AuthorizePigmyOpenModal open onClose={() => setOpenAuthorize(false)} />
      )}
    </div>
  );
};

export default AuthorizePigmyOpenPage;
