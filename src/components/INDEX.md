# COMPONENTS INDEX — IDSSPL Core Banking

> AI KNOWLEDGE BASE. Catalog of every component module: what it renders, what user
> actions it supports, and which route uses it. Paired with `src/app/INDEX.md`
> (route map). Together they form the `{{app_index}}` context for the chatbot pipeline.

## Convention (applies to almost every module)

`<Module>/<Module>.tsx` = page container → `Navbar*` (title EN/HI, breadcrumbs, Back, Filter, Add) → `FilterModal` → `*Table` (sortable columns, kebab row menu: View / Edit / Services) → Add/Edit modals → `shared/SuccessModal` on save, usually with a "Please Authorize" notice.

## Modules

### AccountMaster/ — used by /accountmaster
- `AccountMaster.tsx` — container; wires navbar, filter, table.
- `AccountMasterTable.tsx` — accounts list, respects filters (accountName, accountNumber, accountType).
- `NavbarAM.tsx` — module navbar.
- `AddAccountMaster.tsx` / `AddSavingAccountModal.tsx` — open new (saving) account: customer pick, introducer account, joint holders, nominee.
- `ViewAccount.tsx` — read-only account detail.
- `AccountFreezeModal.tsx` — freeze/unfreeze an account.
- `DepositClose.tsx` — deposit closure flow: Account Details, Deposit Summary, Interest Details, Tax (TDS) Information, GL Details, Payment Details.
- `ListModal.tsx` — picklist helper.

### CustomerMaster/ — used by /customermaster
- `TableCM.tsx` — customer list (customerId, phone, email, status, name, gender, DOB, regDate, categoryCode, riskCategory); row menu View/Edit/Services.
- `AddCM.tsx` — multi-section Add Customer wizard: Personal Details, KYC & Compliance, Classification & Profile, Current/Permanent/Office Address, Capture Profile Photo, Capture Signature, Business Concern, Partnership Firms.
- `ViewEditCM.tsx` — view/edit customer.
- `EditMobile.tsx` / `EditEmail.tsx` — change registered mobile/email.
- `BankingServices.tsx` — services linked to a customer.
- `FilterModal.tsx`, `NavbarCM.tsx`.

### UserMaster/ — used by /usermaster
- `UserMaster.tsx` (container), `UserMasterTable.tsx`, `NavbarAM.tsx`, `FilterModal.tsx`.
- `AddUserMaster.tsx` — create staff user.
- `UserDetailsModal.tsx` — view user.
- `SetUserPassword.tsx` — set/reset password.
- `SetOTP.tsx` — set OTP for a user.

### AssignUserRole/ — used by /assignuserrole
- `AssignUserRole.tsx` — container; New users vs Modified users lists.
- `UserTable.tsx`, `SearchFilterBar.tsx`, `FilterModal.tsx`, `NavbarAUR.tsx`.
- `RoleAssignmentForm.tsx` — pick user → assign role (e.g. Officer).
- `MainRoleListModal.tsx` — role picklist.
- `ModuleToggleList.tsx` + `PermissionCheckboxList.tsx` — per-module permission toggles.

### Authorization/ — used by /authorization
- `AuthorizationCards.tsx` — pending-authorization cards with counts: Account, Customer, User, Roles, Transaction.

### BranchMaster/ — used by /branchmaster
- `BranchMasterTable.tsx` — branch list (branchCode, ifscCode, branchName, shortName, address, cityCode, emailId, phoneNo, isImplemented).
- `AddBranchModal.tsx` — create branch.
- `BranchChequeBookLotModal.tsx` — cheque book lot per branch.
- `FilterModal.tsx`.

### GlobalMaster/ — used by /globalmaster (and GlobalNav reused elsewhere)
- `masterConfig.ts` — single source of truth: ~24 reference masters (City, State, Salutation, Identity/Address Proof, Occupation, Constitution, Religion Cast, Customer Group, Clearing Bank/Branch, etc.) with column defs.
- `MasterList.jsx` — searchable master picker grid.
- `DataTable.jsx` — generic table for the selected master.
- `ParameterModal.jsx` — add/edit a master record.
- `FilterModal.jsx`, `SuccessModal.jsx`, `GlobalNav.tsx` (shared page navbar).

### HeadOfficeMaster/ — used by /headofficemaster
- `masterConfig.js` — ~39 head-office masters (Account Type, GL Account, Product Parameters, TD Interest Rate, Service Charges, SB CA Interest Rates, etc.).
- `HeroOffice.jsx` — master picker/landing.
- `DataTable.jsx`, `ParameterModal.jsx`, `FilterModal.jsx`, `Nav.tsx`.
- `Account Min Bal/AMB.jsx` + `AccountMinBalNav.jsx` — dedicated Account Minimum Balance screen.

### StandingInstruction/ — used by /futuremodels/standing-instructions
- `TableSI.tsx` — SI list.
- `AddSI.tsx` — New Standing Instruction: Account Details (debit account + name, credit account + name), SI Details (frequency etc.); success → "Please Authorize".
- `StopSI.tsx` — stop an SI.

### futuremodels/
- `MainModel.tsx` — launcher grid: TD Open, TD Close, TD Calculate, Lean, Un-Lean, Standing Instructions, Memo.

### Sidebar/ — global navigation
- `sidebarData.ts` — menu source of truth: Dashboard, Authorization, MIS Activity → (Account/Customer/User Master, Assign User Role, Headoffice/Global/Branch Master, Future Models).
- `Sidebar.tsx`, `IconRail.tsx`, `NavGroup.tsx`, `NavItem.tsx`, `SidebarHeader.tsx`, `UserFooter.tsx`.

### shared/ — reusable building blocks
- `FormFields.tsx` — `FieldShell`, `TextInput`, `SelectInput`, `DateInput`, `RadioYesNo` (all bilingual label EN/HI).
- `FormModal.tsx`, `FilterModal.tsx` (exports `AccountFilters`), `SuccessModal.tsx`.

### common/
- `BranchPickListModal.tsx`, `CustomerPickListModal.tsx` — search-and-pick modals.
- `EditMobileEmailModal.tsx` — generic contact edit modal.

### Singles
- `ClientLayout.tsx` — authenticated shell (sidebar + header + content).
- `Header.tsx`, `Nav.tsx` — top bars.
- `Login/LoginPage.tsx` — login form (userId, password, branchCode) → /otp-verification.
- `LanguageSwitcher.tsx` — EN/HI toggle.
- `theme/` — `ThemeProvider.tsx`, `ThemeSwitcher.tsx`, `theme-constants.ts`.
