import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ShieldCheck } from "lucide-react";
import NavbarCA from "./NavbarCA";
import { type AuthTab } from "./CustomerAuthorizationTable";
import UserMasterTable, { ROWS, type UserRow } from "../UserMaster/UserMasterTable";
import UserDetailsModal, { type UserFormData } from "../UserMaster/UserDetailsModal";
import FilterModal, { type UserFilters, defaultValues } from "../UserMaster/FilterModal";
import SuccessModal from "../shared/SuccessModal";
import { useBilingual } from "@/i18n/useBilingual";

type AuthUserRow = UserRow & { tab: AuthTab };

const buildRows = (tab: AuthTab, count: number): AuthUserRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...ROWS[i % ROWS.length],
    sr: i + 1,
    tab,
  }));

export const TAB_COUNTS: Record<AuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

const ALL_ROWS: AuthUserRow[] = [
  ...buildRows("new", TAB_COUNTS.new),
  ...buildRows("modify", TAB_COUNTS.modify),
  ...buildRows("rejected", TAB_COUNTS.rejected),
];

const rowToFormData = (row: UserRow): Partial<UserFormData> => ({
  userId: row.code,
  userName: row.name,
  customerId: row.customerId ?? "",
  employeeCode: row.employeeCode ?? "",
  branchCode: row.branchCode,
  branchName: row.branchName,
  mobileNumber: row.phone,
  emailId: row.email,
});

type SuccessState = { title: string; subtitle: string; variant: "success" | "critical" } | null;

export default function UserMasterAuthorization() {
  const { en } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>("new");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultValues);
  const [authorizeRow, setAuthorizeRow] = useState<UserRow | null>(null);
  const [success, setSuccess] = useState<SuccessState>(null);

  const visibleRows = useMemo(() => ALL_ROWS.filter((r) => r.tab === activeTab), [activeTab]);

  const handleResetFilters = () => setFilters(defaultValues);

  const handleAuthorize = (data: UserFormData) => {
    setAuthorizeRow(null);
    setSuccess({
      title: "User Authorized Successfully",
      subtitle: "",
      variant: "success",
    });
  };

  const handleReject = (data: UserFormData) => {
    setAuthorizeRow(null);
    setSuccess({
      title: "User Authorized Rejected",
      subtitle: "",
      variant: "critical",
    });
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar">
      <NavbarCA
        titleEn="User Authorization"
        titleHi="अधिकृतीकरण"
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("authorization.breadcrumb"), href: "/authorization" },
          { label: "User Authorization", href: "#" },
        ]}
        onBack={() => router.back()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={TAB_COUNTS}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible((prev) => !prev)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
      />

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

      <div className="p-4">
        <UserMasterTable
          rows={visibleRows}
          filters={filters}
          statusEditable
          renderMenuItems={(row) => [
            {
              key: "authorize",
              label: "Authorize",
              icon: ShieldCheck,
              onClick: () => setAuthorizeRow(row),
            },
          ]}
        />
      </div>

      <UserDetailsModal
        open={!!authorizeRow}
        mode="authorize"
        initialData={authorizeRow ? rowToFormData(authorizeRow) : undefined}
        onClose={() => setAuthorizeRow(null)}
        onSubmit={handleAuthorize}
        onReject={handleReject}
      />

      {success && (
        <SuccessModal
          title={success.title}
          subtitle={success.subtitle}
          variant={success.variant}
          onClose={() => setSuccess(null)}
          onDone={() => setSuccess(null)}
        />
      )}
    </div>
  );
}
