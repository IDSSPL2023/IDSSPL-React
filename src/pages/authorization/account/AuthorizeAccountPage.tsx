import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import {
  ShieldCheck,
  Ban,
  BookOpen,
  FileText,
  X,
  Link,
  Clock,
  AlertCircle,
  CircleX,
} from "lucide-react";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import FilterModal, {
  type AccountFilters,
} from "@/components/shared/FilterModal";
import { type AuthorizationCategoryKey } from "@/components/Authorization/AuthorizationSummaryCards";
import AuthorizationTabs, {
  type AuthorizationTabKey,
} from "@/components/Authorization/AuthorizationTabs";
import AuthorizeSavingAccountModal from "@/components/Authorization/Account/Modals/AuthorizeSavingAccountModal";
import AuthorizeLoanAccountModal from "@/components/Authorization/Account/Modals/AuthorizeLoanAccountModal";
import AuthorizeDepositAccountModal from "@/components/Authorization/Account/Modals/AuthorizeDepositAccountModal";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import RowActionMenu, {
  type RowActionMenuItem,
} from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import { ICONS } from "@/assets";

// Column configuration
const authorizeColumns = [
  {
    key: "srNo",
    labelKey: "accountMaster.table.srNo",
    sortable: false,
    width: "60px",
  },
  {
    key: "action",
    labelKey: "accountMaster.table.action",
    sortable: false,
    width: "70px",
  },
  {
    key: "accountId",
    labelKey: "accountMaster.table.accountId",
    sortable: true,
    width: "150px",
    emphasize: true,
  },
  {
    key: "status",
    labelKey: "accountMaster.table.status",
    sortable: true,
    width: "240px",
  },
  {
    key: "customerId",
    labelKey: "accountMaster.table.customerId",
    sortable: true,
    width: "120px",
  },
  {
    key: "accountName",
    labelKey: "fields.accountName",
    sortable: true,
    width: "180px",
  },
  {
    key: "accountType",
    labelKey: "fields.accountType",
    sortable: true,
    width: "140px",
  },
  {
    key: "createdBy",
    labelKey: "accountMaster.table.createdBy",
    sortable: true,
    width: "120px",
  },
  {
    key: "applicationNo",
    labelKey: "accountMaster.table.applicationNo",
    sortable: false,
    width: "140px",
  },
];

type AuthorizeRow = {
  srNo: number;
  accountId: string;
  status: string;
  customerId: string;
  accountName: string;
  accountType: string;
  createdBy: string;
  applicationNo: string;
  queue: AuthorizationTabKey;
};

// Status types with proper capitalization
type AuthorizationStatus =
  | "Freeze/Unfreeze Account"
  | "Standing Instruction Account"
  | "Memo Account"
  | "Stop Cheque Account"
  | "Lien Account";

// Account type to statuses mapping
const ACCOUNT_TYPE_STATUSES: Record<string, AuthorizationStatus[]> = {
  casa: [
    "Freeze/Unfreeze Account",
    "Standing Instruction Account",
    "Memo Account",
    "Stop Cheque Account",
  ],
  deposite: ["Freeze/Unfreeze Account", "Lien Account", "Memo Account"],
  loan: ["Freeze/Unfreeze Account", "Memo Account"],
  fixed: ["Freeze/Unfreeze Account"],
  investment: ["Freeze/Unfreeze Account"],
};

// Status colors configuration
const STATUS_CONFIG: Record<
  AuthorizationStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  "Freeze/Unfreeze Account": {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  "Standing Instruction Account": {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  "Memo Account": {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  "Stop Cheque Account": {
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  "Lien Account": {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

// Queue status display labels
const QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
  new: "Authorization Pending",
  modify: "Modified",
  rejected: "Authorization Rejected",
};

// Generate rows with statuses based on account type
const generateRows = (accountType: string): AuthorizeRow[] => {
  const statuses =
    ACCOUNT_TYPE_STATUSES[accountType] || ACCOUNT_TYPE_STATUSES.casa;
  const accountTypeNames: Record<string, string> = {
    casa: "CASA",
    deposite: "Deposit",
    loan: "Loan",
    fixed: "Fixed Asset",
    investment: "Investment",
  };

  const typeName = accountTypeNames[accountType] || accountType;

  // Generate more data - 3 entries per status for better distribution
  const allRows: AuthorizeRow[] = [];

  statuses.forEach((status, statusIndex) => {
    // Create 3 entries per status to distribute across tabs
    for (let i = 0; i < 3; i++) {
      const queue: AuthorizationTabKey =
        i === 0 ? "new" : i === 1 ? "modify" : "rejected";

      allRows.push({
        srNo: allRows.length + 1,
        accountId: `720807681${String(allRows.length + 1).padStart(3, "0")}`,
        status: status,
        customerId: `000${String(allRows.length + 1).padStart(3, "0")}`,
        accountName: `${typeName} Account ${allRows.length + 1}`,
        accountType: typeName,
        createdBy: ["Admin", "Manager", "Supervisor"][i % 3],
        applicationNo: String(100000 + allRows.length + 1),
        queue: queue,
      });
    }
  });

  return allRows;
};

interface AuthorizeAccountPageProps {
  accountType: "casa" | "deposite" | "loan" | "fixed" | "investment";
}

// Status Badge Component for table
const StatusBadge = ({
  status,
  queue,
}: {
  status: string;
  queue?: AuthorizationTabKey;
}) => {
  // If it's a queue status (for modify/rejected tabs), show the queue status
  if (queue === "modify") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
        Modified
      </span>
    );
  }
  if (queue === "rejected") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-medium text-red-700">
        Authorization Rejected
      </span>
    );
  }

  const config = STATUS_CONFIG[status as AuthorizationStatus];

  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      {status}
    </span>
  );
};

// Placeholder Authorization Modal
const PlaceholderAuthorizeModal = ({
  open,
  onClose,
  status,
  accountType,
}: {
  open: boolean;
  onClose: () => void;
  status: string;
  accountType: string;
}) => {
  if (!open) return null;

  const accountTypeNames: Record<string, string> = {
    casa: "CASA",
    deposite: "Deposit",
    loan: "Loan",
    fixed: "Fixed Asset",
    investment: "Investment",
  };
  const typeName = accountTypeNames[accountType] || accountType;

  const getStatusIcon = () => {
    const icons: Record<string, React.ReactNode> = {
      "Freeze/Unfreeze Account": <Ban className="h-12 w-12 text-red-500" />,
      "Standing Instruction Account": (
        <BookOpen className="h-12 w-12 text-blue-500" />
      ),
      "Memo Account": <FileText className="h-12 w-12 text-amber-500" />,
      "Stop Cheque Account": <CircleX className="h-12 w-12 text-rose-500" />,
      "Lien Account": <Link className="h-12 w-12 text-purple-500" />,
    };
    return (
      icons[status] || <ShieldCheck className="h-12 w-12 text-green-500" />
    );
  };

  const getStatusColor = () => {
    const colors: Record<string, string> = {
      "Freeze/Unfreeze Account": "text-red-600",
      "Standing Instruction Account": "text-blue-600",
      "Memo Account": "text-amber-600",
      "Stop Cheque Account": "text-rose-600",
      "Lien Account": "text-purple-600",
    };
    return colors[status] || "text-green-600";
  };

  const getStatusIconBg = () => {
    const colors: Record<string, string> = {
      "Freeze/Unfreeze Account": "bg-red-100",
      "Standing Instruction Account": "bg-blue-100",
      "Memo Account": "bg-amber-100",
      "Stop Cheque Account": "bg-rose-100",
      "Lien Account": "bg-purple-100",
    };
    return colors[status] || "bg-green-100";
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      header={{
        icon: ICONS.PERSON,
        title: `Authorize ${status}`,
        titleHi: `प्राधिकृत करा ${status}`,
        subtitle: `Please review and authorize the ${status.toLowerCase()} for ${typeName} account.`,
        subtitleHi: `कृपया ${typeName} खात्यासाठी ${status.toLowerCase()} चे पुनरावलोकन करा आणि प्राधिकृत करा.`,
        onClose: onClose,
        showCloseButton: true,
      }}
      footerButtons={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outline" as const,
          icon: <X size={16} />,
        },
        {
          label: "Authorize",
          onClick: () => {
            console.log(`Authorized: ${status}`);
            onClose();
          },
          variant: "primary" as const,
          icon: <ShieldCheck size={16} />,
        },
      ]}
      footerAlign="right"
      showDefaultClose={false}
      maxWidth="lg"
    >
      <SectionWrapper>
        <div className="flex flex-col items-center py-4">
          {/* Icon with background circle */}
          <div
            className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${getStatusIconBg()}`}
          >
            {getStatusIcon()}
          </div>

          {/* Status Label */}
          <h3 className={`text-2xl font-bold ${getStatusColor()}`}>{status}</h3>

          <p className="mt-2 text-center text-gray-600 max-w-md">
            Are you sure you want to authorize this action for the {typeName}{" "}
            account?
          </p>

          {/* Details Card */}
          <div className="mt-6 w-full max-w-lg rounded-xl border border-gray-200 bg-gray-50/50 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">
                  Account Type
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {typeName}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">Action</p>
                <p className={`mt-1 text-sm font-semibold ${getStatusColor()}`}>
                  {status}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusIconBg()} ${getStatusColor()}`}
                >
                  {status}
                </span>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">
                  Authorization
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                  <Clock className="h-3.5 w-3.5" />
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-amber-50 p-3.5 max-w-lg border border-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              This action cannot be undone. Please verify all details before
              authorizing.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </ModalWrapper>
  );
};

const AuthorizeAccountPage = ({ accountType }: AuthorizeAccountPageProps) => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({
    accountName: "",
    accountNumber: "",
    accountType: "",
  });
  const [selectedRow, setSelectedRow] = useState<AuthorizeRow | null>(null);
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => generateRows(accountType), [accountType]);

  // Filter and sort rows
  const visibleRows = useMemo(() => {
    let filtered = rows.filter((row) => row.queue === activeTab);

    // Apply filters
    if (filters.accountName) {
      filtered = filtered.filter((r) =>
        r.accountName
          .toLowerCase()
          .includes(filters.accountName!.toLowerCase()),
      );
    }
    if (filters.accountNumber) {
      filtered = filtered.filter((r) =>
        r.accountId
          .toLowerCase()
          .includes(filters.accountNumber!.toLowerCase()),
      );
    }
    if (filters.accountType) {
      filtered = filtered.filter((r) =>
        r.accountType
          .toLowerCase()
          .includes(filters.accountType!.toLowerCase()),
      );
    }

    // Apply sorting
    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = (a as Record<string, unknown>)[sortKey];
        const valB = (b as Record<string, unknown>)[sortKey];
        if (valA == null || valB == null) return 0;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return filtered.map((row, idx) => ({
      ...row,
      srNo: idx + 1,
    }));
  }, [rows, activeTab, filters, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAuthorize = (row: AuthorizeRow) => {
    setSelectedRow(row);
    setIsAuthorizeModalOpen(true);
  };

  const getMenuItems = (row: AuthorizeRow): RowActionMenuItem[] => {
    return [
      {
        key: "authorize",
        label: tRaw("common.authorize"),
        icon: ShieldCheck,
        onClick: () => handleAuthorize(row),
      },
    ];
  };

  const renderAuthorizeModal = () => {
    if (!selectedRow) return null;

    if (accountType === "casa") {
      return (
        <AuthorizeSavingAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    if (accountType === "deposite") {
      return (
        <AuthorizeDepositAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    if (accountType === "loan") {
      return (
        <AuthorizeLoanAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    return (
      <PlaceholderAuthorizeModal
        open={isAuthorizeModalOpen}
        onClose={() => {
          setIsAuthorizeModalOpen(false);
          setSelectedRow(null);
        }}
        status={selectedRow.status}
        accountType={accountType}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <GlobalNav
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          {
            label: en("authorization.breadcrumb"),
            onClick: () => router.push("/authorization"),
          },
          { label: en("authorizeAccount.breadcrumb"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
        />

        {/* Custom Table */}
        <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
          <div className="table-container relative overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[1200px] table-fixed">
              <thead>
                <tr className="bg-primary rounded-t-xl">
                  {authorizeColumns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                        col.sortable ? "cursor-pointer select-none" : ""
                      }`}
                      style={{ width: col.width }}
                    >
                      <SortableHeaderLabel
                        label={tRaw(col.labelKey)}
                        sortable={col.sortable}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={authorizeColumns.length}
                      className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, idx) => (
                    <tr
                      key={`${row.accountId}-${row.srNo}`}
                      className={`${
                        idx !== visibleRows.length - 1
                          ? "border-b border-gray-100 dark:border-slate-800"
                          : ""
                      } hover:bg-gray-50 dark:hover:bg-slate-800 relative`}
                    >
                      {authorizeColumns.map((col) => {
                        if (col.key === "srNo") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3"
                              style={{ width: col.width }}
                            >
                              <SrNoBadge value={row.srNo} />
                            </td>
                          );
                        }
                        if (col.key === "action") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3 relative"
                              style={{ width: col.width }}
                            >
                              <RowActionMenu items={getMenuItems(row)} />
                            </td>
                          );
                        }
                        if (col.key === "status") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3"
                              style={{ width: col.width }}
                            >
                              <StatusBadge
                                status={row.status}
                                queue={row.queue}
                              />
                            </td>
                          );
                        }
                        const value = (row as Record<string, unknown>)[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`px-6 py-3 truncate ${
                              col.emphasize
                                ? "text-sm font-medium text-gray-900 dark:text-slate-100"
                                : "text-[16px] text-gray-700 dark:text-slate-400"
                            }`}
                            style={{ width: col.width }}
                          >
                            {value != null ? String(value) : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {renderAuthorizeModal()}
    </div>
  );
};

export default AuthorizeAccountPage;
