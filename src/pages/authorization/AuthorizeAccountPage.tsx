// import { useMemo, useState } from "react";
// import { useRouter } from "@/lib/navigation";
// import { ShieldCheck } from "lucide-react";
// import GlobalNav from "@/components/GlobalMaster/GlobalNav";
// import { useBilingual } from "@/i18n/useBilingual";
// import FilterModal, {
//   type AccountFilters,
// } from "@/components/shared/FilterModal";
// import AccountMasterTable, {
//   type ColumnConfig,
//   type RowData,
// } from "@/components/AccountMaster/AccountMasterTable";
// import AuthorizationSummaryCards, {
//   type AuthorizationCategoryKey,
// } from "@/components/Authorization/AuthorizationSummaryCards";
// import AuthorizationTabs, {
//   type AuthorizationTabKey,
// } from "@/components/Authorization/AuthorizationTabs";
// import AuthorizeSavingAccountModal from "@/components/Authorization/Account/AuthorizeSavingAccountModal";
// import AuthorizeLoanAccountModal from "@/components/Authorization/Account/AuthorizeLoanAccountModal";
// import AuthorizeDepositAccountModal from "@/components/Authorization/Account/AuthorizeDepositAccountModal";
// import AuthorizeFixedAssetAccountModal from "@/components/Authorization/Account/AuthorizeFixedAssetAccountModal";

// const authorizeColumns: ColumnConfig[] = [
//   {
//     key: "srNo",
//     labelKey: "accountMaster.table.srNo",
//     sortable: false,
//     width: "80px",
//   },
//   {
//     key: "action",
//     labelKey: "accountMaster.table.action",
//     sortable: false,
//     width: "80px",
//   },
//   {
//     key: "accountId",
//     labelKey: "accountMaster.table.accountId",
//     sortable: true,
//     width: "160px",
//     emphasize: true,
//   },
//   {
//     key: "status",
//     labelKey: "accountMaster.table.status",
//     sortable: true,
//     width: "190px",
//   },
//   {
//     key: "customerId",
//     labelKey: "accountMaster.table.customerId",
//     sortable: true,
//     width: "140px",
//   },
//   {
//     key: "accountName",
//     labelKey: "fields.accountName",
//     sortable: true,
//     width: "200px",
//   },
//   {
//     key: "accountType",
//     labelKey: "fields.accountType",
//     sortable: true,
//     width: "180px",
//   },
//   {
//     key: "createdBy",
//     labelKey: "accountMaster.table.createdBy",
//     sortable: true,
//     width: "140px",
//   },
//   {
//     key: "applicationNo",
//     labelKey: "accountMaster.table.applicationNo",
//     sortable: false,
//     width: "160px",
//   },
// ];

// // Maps an account type to the summary-card category it belongs to.
// const ACCOUNT_TYPE_CATEGORY: Record<string, AuthorizationCategoryKey> = {
//   "Saving Deposit": "sbCa",
//   "Current Account": "sbCa",
//   "Term Deposit": "deposit",
//   "Recurring Deposit": "deposit",
//   "Term Loan": "loan",
//   "Fixed Asset": "fixedAsset",
//   Investment: "investment",
// };

// type AuthorizeRow = RowData & { queue: AuthorizationTabKey };

// const QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
//   new: "Authorization Pending",
//   modify: "Modification Pending",
//   rejected: "Authorization Rejected",
// };

// const AUTHORIZE_ROWS: AuthorizeRow[] = [
//   {
//     srNo: 1,
//     accountId: "7208076812",
//     status: "Live",
//     customerId: "00012",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 2,
//     accountId: "4022399911",
//     status: "Live",
//     customerId: "00021",
//     accountName: "Nitish Sai Readdy",
//     accountType: "Term Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 3,
//     accountId: "5023451389",
//     status: "Live",
//     customerId: "00022",
//     accountName: "Karan Mangesh Patil",
//     accountType: "Term Loan",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 4,
//     accountId: "7208076812",
//     status: "Live",
//     customerId: "00012",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 5,
//     accountId: "7208076812",
//     status: "Live",
//     customerId: "00012",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 6,
//     accountId: "7208076812",
//     status: "Live",
//     customerId: "00012",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 7,
//     accountId: "9812345670",
//     status: "Live",
//     customerId: "00030",
//     accountName: "Priya Deshmukh",
//     accountType: "Fixed Asset",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 8,
//     accountId: "9812345671",
//     status: "Live",
//     customerId: "00031",
//     accountName: "Rohan Kulkarni",
//     accountType: "Investment",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "new",
//   },
//   {
//     srNo: 9,
//     accountId: "9812345672",
//     status: "Live",
//     customerId: "00032",
//     accountName: "Sneha Patil",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 10,
//     accountId: "9812345673",
//     status: "Live",
//     customerId: "00033",
//     accountName: "Vikram Joshi",
//     accountType: "Term Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 11,
//     accountId: "9812345674",
//     status: "Live",
//     customerId: "00034",
//     accountName: "Anita Rao",
//     accountType: "Term Loan",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 12,
//     accountId: "9812345675",
//     status: "Live",
//     customerId: "00035",
//     accountName: "Suresh Naik",
//     accountType: "Fixed Asset",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 13,
//     accountId: "9812345676",
//     status: "Live",
//     customerId: "00036",
//     accountName: "Meena Shah",
//     accountType: "Investment",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 14,
//     accountId: "9812345677",
//     status: "Live",
//     customerId: "00037",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "modify",
//   },
//   {
//     srNo: 15,
//     accountId: "9812345678",
//     status: "Live",
//     customerId: "00038",
//     accountName: "Deepak Verma",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
//   {
//     srNo: 16,
//     accountId: "9812345679",
//     status: "Live",
//     customerId: "00039",
//     accountName: "Kavita Iyer",
//     accountType: "Term Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
//   {
//     srNo: 17,
//     accountId: "9812345680",
//     status: "Live",
//     customerId: "00040",
//     accountName: "Manoj Pillai",
//     accountType: "Term Loan",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
//   {
//     srNo: 18,
//     accountId: "9812345681",
//     status: "Live",
//     customerId: "00041",
//     accountName: "Ritu Bhatt",
//     accountType: "Fixed Asset",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
//   {
//     srNo: 19,
//     accountId: "9812345682",
//     status: "Live",
//     customerId: "00042",
//     accountName: "Arjun Nair",
//     accountType: "Investment",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
//   {
//     srNo: 20,
//     accountId: "9812345683",
//     status: "Live",
//     customerId: "00043",
//     accountName: "Akshay Om More",
//     accountType: "Saving Deposit",
//     createdBy: "Admin",
//     applicationNo: "0",
//     queue: "rejected",
//   },
// ];

// const AuthorizeAccountPage = () => {
//   const { t, en, tRaw } = useBilingual();
//   const router = useRouter();

//   const [activeCategory, setActiveCategory] =
//     useState<AuthorizationCategoryKey>("sbCa");
//   const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState<AccountFilters>({
//     accountName: "",
//     accountNumber: "",
//     accountType: "",
//   });
//   const [openAuthorizeAccount, setOpenAuthorizeAccount] = useState(false);

//   const visibleRows = useMemo(() => {
//     return AUTHORIZE_ROWS.filter(
//       (row) =>
//         row.queue === activeTab &&
//         ACCOUNT_TYPE_CATEGORY[row.accountType] === activeCategory,
//     ).map((row, idx) => ({
//       ...row,
//       srNo: idx + 1,
//       status: QUEUE_STATUS_LABEL[row.queue],
//     }));
//   }, [activeTab, activeCategory]);

//   const AuthorizeForm = () => {
//     return activeCategory === "sbCa" ? (
//       <AuthorizeSavingAccountModal
//         open
//         onClose={() => setOpenAuthorizeAccount(false)}
//       />
//     ) : activeCategory === "deposit" ? (
//       <AuthorizeDepositAccountModal
//         open
//         onClose={() => setOpenAuthorizeAccount(false)}
//       />
//     ) : activeCategory === "fixedAsset" ? (
//       <AuthorizeFixedAssetAccountModal
//         open
//         onClose={() => setOpenAuthorizeAccount(false)}
//       />
//     ) : (
//       <AuthorizeLoanAccountModal
//         open
//         onClose={() => setOpenAuthorizeAccount(false)}
//       />
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#F4F6FC]">
//       <GlobalNav
//         titleEn={en("authorization.title")}
//         titleHi={t("authorization.title")}
//         breadcrumbs={[
//           { label: en("common.home"), href: "/" },
//           { label: en("common.misActivity"), href: "/" },
//           {
//             label: en("authorization.breadcrumb"),
//             onClick: () => router.push("/authorization"),
//           },
//           { label: en("authorizeAccount.breadcrumb"), href: "#" },
//         ]}
//         onBack={() => router.back()}
//       />

//       <div className="flex flex-col gap-3 px-3 py-3">
//         <AuthorizationSummaryCards
//           active={activeCategory}
//           onChange={setActiveCategory}
//         />

//         <AuthorizationTabs
//           active={activeTab}
//           onChange={setActiveTab}
//           onOpenFilter={() => setIsFilterOpen(true)}
//         />

//         <AccountMasterTable
//           filters={filters}
//           rows={visibleRows}
//           columns={authorizeColumns}
//           renderMenuItems={() => [
//             {
//               key: "authorize",
//               label: tRaw("common.authorize"),
//               icon: ShieldCheck,
//               onClick: () => setOpenAuthorizeAccount(true),
//             },
//           ]}
//         />
//       </div>

//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//           onClick={() => setIsFilterOpen(false)}
//         >
//           <div onClick={(e) => e.stopPropagation()}>
//             <FilterModal
//               initialValues={filters}
//               onClose={() => setIsFilterOpen(false)}
//               onApply={(vals) => setFilters(vals)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Modal */}
//       {openAuthorizeAccount && visibleRows.length > 0 && <AuthorizeForm />}
//     </div>
//   );
// };

// export default AuthorizeAccountPage;
