# Common UI System Migration

This documents the shared UI system added under `src/components/common/` and the
first wave of feature migrations onto it. Routes, mock data, and field labels
were not changed — only the presentational/interaction chrome around them.

## Do not create duplicate common components

**Before adding a new table, filter dialog, form modal, success/reject dialog,
pick-list, tab UI, submenu grid, welcome screen, or navbar anywhere in the app,
check `src/components/common/` first.** These primitives are generic and typed
— extend them with props/config, don't fork them. If an existing common
component genuinely can't express what a screen needs, extend the shared
component (add a prop) rather than hand-rolling a page-specific copy. Feature
folders should only ever provide: column/field/tab config, mock data, and
callbacks — never their own overlay wrapper, table markup, or modal chrome.

## Common component API examples

### `GlobalTable` / `AuthorizeTable`

```tsx
import { GlobalTable, AuthorizeTable } from "@/components/common";
import type { ColumnDef, TableAction } from "@/components/common";

const columns: ColumnDef<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "amount", header: "Amount", sortable: true, align: "right" },
];
const actions: TableAction<Row>[] = [
  { key: "view", label: "View", icon: Eye, onClick: (row) => openView(row) },
];

<GlobalTable columns={columns} rows={rows} rowKey={(r) => r.id} actions={actions}
  pagination={{ page, totalPages, onPageChange: setPage }} />

// AuthorizeTable = GlobalTable + tabs + filter trigger, folded into one component
<AuthorizeTable tabs={[{ key: "new", label: "New", count: 10 }]} activeTab={tab}
  onTabChange={setTab} onOpenFilter={...} columns={columns} rows={rows} rowKey={...} actions={actions} />
```

### `FilterModal`

```tsx
import { FilterModal } from "@/components/common";
import type { FilterFieldDef } from "@/components/common";

const fields: FilterFieldDef[] = [
  { id: "accountName", label: "Account Name", type: "text", icon: <User size={18} /> },
  { id: "status", label: "Status", type: "status", options: [{ value: "Active", label: "Active" }] },
];

{isFilterOpen && (
  <FilterModal fields={fields} initialValues={filters} onClose={close} onApply={setFilters} />
)}
```

### `AuthorizeFormModal` (Authorize / Reject / InputRejectModal / RejectModal flow, built in)

```tsx
import { AuthorizeFormModal } from "@/components/common";

<AuthorizeFormModal
  onClose={onClose}
  titleEn="Authorize Cash Deposit" titleHi="रोख जमा अधिकृत करा"
  onAuthorize={() => api.authorize(id)}
  onReject={(reason) => api.reject(id, reason)}
  successTitle="Cash Deposit Authorized Successfully"
  rejectedTitle="Cash Deposit Authorization Rejected"
>
  {/* read-only field sections, e.g. SectionCard/FieldShell from shared/FormFields */}
</AuthorizeFormModal>
```

### `NormalFormModal` (Validate / Cancel / Save)

```tsx
import { NormalFormModal } from "@/components/common";
import { validateFields, isFormValid } from "@/components/common";

const errors = validateFields(values, { name: required() });

<NormalFormModal
  onClose={onClose} titleEn="Add Fixed Asset Account" titleHi="स्थिर मालमत्ता खाते जोडा"
  onValidate={() => setErrors(validateFields(values, rules))}
  isValid={isFormValid(errors)}
  onSave={() => { save(values); openSuccessModal(); }}
>
  {/* form fields, e.g. common/form/TextField, SelectField, DateField, PicklistField */}
</NormalFormModal>
```

### `PicklistModal` + `PicklistField`

```tsx
import { PicklistModal, PicklistField } from "@/components/common";

<PicklistField label="Account Code" value={accountCode} onOpenPicklist={() => setPickerOpen(true)} readOnly />

{pickerOpen && (
  <PicklistModal
    title="Sub Product List"
    columns={[{ key: "code", header: "Product Code" }, { key: "description", header: "Description" }]}
    rows={products} rowKey={(r) => r.code}
    onSelect={(row) => { setAccountCode(row.code); setPickerOpen(false); }}
    onClose={() => setPickerOpen(false)}
  />
)}
```

### `TabModal`

```tsx
import { TabModal } from "@/components/common";

<TabModal
  onClose={onClose} title="View Deposit Account Details"
  tabs={[{ key: "Details", label: "Details", content: <DetailsTab /> }]}
  activeTab={activeTab} onTabChange={setActiveTab}
/>
```

### `SubMenuScreen` / `WelcomeScreen`

```tsx
<SubMenuScreen items={[{ key: "account", titleEn: "Authorize Account", icon: <Image .../>, count: 56, href: "/authorization/account" }]} />

<WelcomeScreen title="Day Begin / End" query={query} onQueryChange={setQuery}
  items={[{ id: "backend-profit", title: "Backend Profit", icon: <Image .../>, onOpen: () => open("backend-profit") }]} />
```

## Migration status

| Area | Status | Notes |
| --- | --- | --- |
| Common library (`src/components/common/*`) | ✅ Done | table, filter, modal, form, layout — see folder tree below |
| Cash Deposit Authorize (`/authorization/transaction/cash-deposit`) | ✅ Done | `CashDepositAuthorizeTable` → `AuthorizeTable`; `CashDepositFilterModal` → field config + common `FilterModal`; `AuthorizeCashDepositModal` → `AuthorizeFormModal` |
| User Master (`/usermaster`) | ✅ Done | `UserMasterTable` → `GlobalTable`; `UserMaster/FilterModal` fields ported to `userFilterFields.tsx` + common `FilterModal`; `StatusChangeModal` rebuilt on `StatusModal` |
| `/account-master/ca-sa` View (edit/view) | ✅ Done | `ViewAccount.tsx`'s private `Tabs` + fixed-overlay chrome replaced by `TabModal`; tab content (`DetailsTab`/`DepositTab`/`NomineeTab`/`JointHolderTab`) and `EditModeContext` untouched. Also benefits the `/accountmaster` route, which shares the same `ViewAccountModal`. |
| `/authorization` | ✅ Done | `AuthorizationCards.tsx` now a config-only wrapper around `SubMenuScreen` |
| `/day-begin-end` | ✅ Done | Rebuilt on `WelcomeScreen`; hero background moved to `src/assets/images/backgrounds/welcome-hero.png` (was `public/Background.png`) |
| Everything else | ❌ Not migrated | See list below — these still use the pre-existing `shared/*` components and are safe to migrate next using the same pattern |

### Remaining duplicate filter/table/modal files (not migrated this pass)

- `Authorization/Transaction/*FilterModal.tsx` + `*AuthorizeTable.tsx` for RTGS, TDS, TL/CC Installment, TL Disbursement, Transfer, Cash Withdrawal, Recurring Installment, TD Interest Payment
- `HoOfficer/Transaction/HoCashDepositAuthorizeTable.tsx` + `HoCashDepositFilterModal.tsx` (head-office variant of the Cash Deposit flow)
- `CustomerMaster/FilterModal.tsx`, `BranchMaster/FilterModal.tsx`, `AssignUserRole/FilterModal.tsx`, `shared/FilterModal.tsx`, `shared/AccountTypeCards.tsx`'s own filter usage
- `common/BankPickListModal.tsx`, `common/BranchPickListModal.tsx`, `common/CustomerPickListModal.tsx`, and `AccountMaster/AddAccountMaster.tsx`'s inline `ListModal` — all three+ are near-identical hand-rolled pick lists; prime candidates to collapse onto `PicklistModal`
- `components/futuremodels/*` — ~30 ad hoc modal/page forms, including `pages/futuremodels/FixedAssetPage.tsx` (the actual visual reference used to build `NormalFormModal`) — none use the common form fields yet
- `UserMaster/UserDetailsModal.tsx`, `SetUserPassword.tsx`, `SetOTP.tsx`, `EditMobileEmailModal.tsx` — still use `shared/FormModal`/`shared/FormFields` directly
- `Authorization/UserMasterAuthorization.tsx` — still imports `UserMaster/FilterModal.tsx`'s default-exported component directly (not yet switched to the field-config + common `FilterModal` pattern used by `UserMasterPage.tsx`)
- `components/AccountMaster/AccountMaster.tsx` — an 81-line duplicate of `AccountMasterPage.tsx` with zero remaining importers; dead code, safe to delete outright (not a migration candidate)
- `Authorization/AuthorizationTabs.tsx`, `GlobalMaster/GlobalNav.tsx` — superseded by `AuthorizeTable`'s built-in tab row and `AppNavbar`, but still used by every non-migrated page above

### Old components safe to remove later (only once every consumer above has migrated)

`shared/FormModal.tsx`, `shared/SuccessModal.tsx`, `shared/RejectedModal.tsx`,
`shared/RejectReasonModal.tsx`, `shared/FilterModal.tsx`, `shared/Pagination.tsx`,
`shared/RowActionMenu.tsx`, `shared/StatusPill.tsx`, `GlobalMaster/GlobalNav.tsx`,
`Authorization/AuthorizationTabs.tsx`. None of these were deleted in this pass —
per the migration rules, deletion only happens once every importing page has
moved off them and `tsc`/`lint` stay clean.

## Folder structure

`src/components/common/` is intentionally **flat** — every common component and
type file lives directly in this one folder, no `table/`/`filter/`/`modal/`/
`form/`/`layout/` subfolders. Everything is imported through the barrel:

```
src/assets/images/{common,backgrounds,navigation,modules}/
src/components/common/
  GlobalTable.tsx  AuthorizeTable.tsx  PaginationModal.tsx  TableActionMenu.tsx
  StatusBadge.tsx  table.types.ts
  FilterModal.tsx  filter.types.ts
  BaseModal.tsx  NormalFormModal.tsx  AuthorizeFormModal.tsx  SuccessModal.tsx
  InputRejectModal.tsx  RejectModal.tsx  PicklistModal.tsx  TabModal.tsx
  StatusModal.tsx  ActionModal.tsx  modal.types.ts
  FormField.tsx  TextField.tsx  SelectField.tsx  DateField.tsx
  PicklistField.tsx  RadioGroupField.tsx  validation.ts
  AppNavbar.tsx  PageHeader.tsx  SubMenuScreen.tsx  WelcomeScreen.tsx
  index.ts    barrel — import everything from "@/components/common"

  # Pre-existing files not part of this refactor, still here, not moved:
  BankPickListModal.tsx  BranchPickListModal.tsx  CustomerPickListModal.tsx
  EditMobileEmailModal.tsx
```

## Known fix: filter button now opens on a single click

The first migration pass ported the pre-existing "click filter icon → reveals
a Search/Filter pill → click again to actually open the dialog" two-step
interaction verbatim from `AuthorizationTabs.tsx`/`NavbarAM.tsx`. That was
reported as broken UX and has been removed: `AuthorizeTable`'s and
`AppNavbar`'s filter buttons now call `onOpenFilter`/`onFilter` directly on
the first click. `isSearchVisible`/`onToggleSearch` props were removed from
both components' APIs; `hasActiveFilters`/`activeFilterSummary`/`onResetFilters`
now render their reset button + summary chip unconditionally next to the
filter icon whenever there's an active filter, with no reveal step.

## Deletions

- `components/AccountMaster/AccountMaster.tsx` — deleted. Confirmed zero
  importers anywhere in the codebase (dead duplicate of `AccountMasterPage.tsx`).
- Everything else flagged as a "remaining duplicate" above (`shared/FormModal.tsx`,
  `shared/SuccessModal.tsx`, `GlobalMaster/GlobalNav.tsx`,
  `Authorization/AuthorizationTabs.tsx`, the three `*PickListModal.tsx` files,
  etc.) was checked and **not** deleted: each still has real, active importers
  in pages this refactor did not touch (e.g. `shared/FormModal.tsx` alone has
  79 remaining consumers). Deleting any of them now would break those pages.
  They become safe to delete only as more features migrate onto
  `src/components/common/*` and their importer count reaches zero — re-run
  `grep -rl "<old-path>" src` before deleting each one.

## Verification

- `npm run lint` — no new issues introduced (493 pre-existing errors before this
  refactor; 489 after — net improvement from incidental cleanups in touched files,
  all remaining errors are pre-existing and outside the migrated files).
- `npm run build` (`tsc -b && vite build`) — passes clean.
- Live browser walkthrough was requested but the `claude-in-chrome` extension
  was not available in this session; `npm run dev` was smoke-tested (server
  boots without runtime errors) but pages were not visually inspected. Please
  run `npm run dev` and click through `/authorization/transaction/cash-deposit`,
  `/usermaster`, `/account-master/ca-sa`, `/authorization`, and `/day-begin-end`
  to confirm visually, or revisit with `/chrome` to enable browser automation.
