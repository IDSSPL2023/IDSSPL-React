import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ShieldCheck } from "lucide-react";
import NavbarCA from "@/components/Authorization/NavbarCA";
import { type CustomerAuthorizationTable_AuthTab as AuthTab } from "@/pages/authorization/AuthorizeCustomer/AuthorizeCustomer";
import UserMasterTable, { ROWS, type UserRow } from "@/components/UserMaster/UserMasterTable";
import UserDetailsModal, { type UserFormData } from "@/components/UserMaster/UserDetailsModal";
import FilterModal, { type UserFilters, defaultValues } from "@/components/UserMaster/FilterModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { useBilingual } from "@/i18n/useBilingual";

/* ===== from UserMasterAuthorization.tsx ===== */
type UserMasterAuthorization_AuthUserRow = UserRow & { tab: AuthTab };

const UserMasterAuthorization_buildRows = (tab: AuthTab, count: number): UserMasterAuthorization_AuthUserRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...ROWS[i % ROWS.length],
    sr: i + 1,
    tab,
  }));

export const UserMasterAuthorization_TAB_COUNTS: Record<AuthTab, number> = {
  new: 10,
  modify: 6,
  rejected: 6,
};

const UserMasterAuthorization_ALL_ROWS: UserMasterAuthorization_AuthUserRow[] = [
  ...UserMasterAuthorization_buildRows("new", UserMasterAuthorization_TAB_COUNTS.new),
  ...UserMasterAuthorization_buildRows("modify", UserMasterAuthorization_TAB_COUNTS.modify),
  ...UserMasterAuthorization_buildRows("rejected", UserMasterAuthorization_TAB_COUNTS.rejected),
];

const UserMasterAuthorization_rowToFormData = (row: UserRow): Partial<UserFormData> => ({
  userId: row.code,
  userName: row.name,
  customerId: row.customerId ?? "",
  employeeCode: row.employeeCode ?? "",
  branchCode: row.branchCode,
  branchName: row.branchName,
  mobileNumber: row.phone,
  emailId: row.email,
});

type UserMasterAuthorization_SuccessState = { title: string; subtitle: string; variant: "success" | "critical" } | null;

function UserMasterAuthorization() {
  const { en } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>("new");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultValues);
  const [authorizeRow, setAuthorizeRow] = useState<UserRow | null>(null);
  const [success, setSuccess] = useState<UserMasterAuthorization_SuccessState>(null);

  const visibleRows = useMemo(() => UserMasterAuthorization_ALL_ROWS.filter((r) => r.tab === activeTab), [activeTab]);

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
        tabCounts={UserMasterAuthorization_TAB_COUNTS}
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
        initialData={authorizeRow ? UserMasterAuthorization_rowToFormData(authorizeRow) : undefined}
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


/* ===== from AuthorizationUserPage.tsx ===== */
export default function AuthorizationUserPage() {
  return <UserMasterAuthorization />;
}
