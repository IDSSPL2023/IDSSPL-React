import {
  Eye,
  SquarePen,
  UserRoundCog,
  Lock,
  BookOpenCheck,
  ClipboardList,
  StickyNote,
  ShieldAlert,
} from "lucide-react";
import { type RowActionMenuItem } from "../shared/RowActionMenu";
import type { RowData } from "./AccountMasterTable";
import type { AccountMasterType } from "./AccountMasterPage";

/** Row-action callbacks a page wires up; each account type's menu only calls the subset it needs. */
export interface AccountRowMenuHandlers {
  onView: (row: RowData) => void;
  onEdit: (row: RowData) => void;
  onFreeze: (row: RowData) => void;
  onOperative: (row: RowData) => void;
  onChequeBookIssue: (row: RowData) => void;
  onStandingInstruction: (row: RowData) => void;
  onMemo: (row: RowData) => void;
  onLienMark: (row: RowData) => void;
}

export interface AccountTypeMenuConfig {
  accountType: AccountMasterType;
  getMenuItems: (
    row: RowData,
    tRaw: (key: string) => string,
    handlers: AccountRowMenuHandlers
  ) => RowActionMenuItem[];
}

const viewEditFreezeItems = (
  row: RowData,
  tRaw: (key: string) => string,
  handlers: AccountRowMenuHandlers
): RowActionMenuItem[] => [
  { key: "view", label: tRaw("common.view"), icon: Eye, onClick: () => handlers.onView(row) },
  { key: "edit", label: tRaw("common.edit"), icon: SquarePen, onClick: () => handlers.onEdit(row) },
  { key: "freeze", label: tRaw("accountMaster.table.menuFreezeUnfreeze"), icon: Lock, onClick: () => handlers.onFreeze(row) },
];

// CA/SA Account Type - Menu 1
const caSaMenuConfig: AccountTypeMenuConfig = {
  accountType: "ca-sa",
  getMenuItems: (row, tRaw, handlers) => [
    ...viewEditFreezeItems(row, tRaw, handlers),
    { key: "chequeBookIssue", label: tRaw("accountMaster.table.menuChequeBookIssue"), icon: BookOpenCheck, onClick: () => handlers.onChequeBookIssue(row) },
    { key: "standingInstruction", label: tRaw("accountMaster.table.menuStandingInstruction"), icon: ClipboardList, onClick: () => handlers.onStandingInstruction(row) },
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
    { key: "operative", label: tRaw("accountMaster.table.menuOperativeInoperative"), icon: UserRoundCog, onClick: () => handlers.onOperative(row) },
  ],
};

// Deposit Account Type - Menu 2
const depositMenuConfig: AccountTypeMenuConfig = {
  accountType: "deposit",
  getMenuItems: (row, tRaw, handlers) => [
    ...viewEditFreezeItems(row, tRaw, handlers),
    { key: "lienMark", label: tRaw("accountMaster.table.menuLienMark"), icon: ShieldAlert, onClick: () => handlers.onLienMark(row) },
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
  ],
};

// Loan Account Type - Menu 3
const loanMenuConfig: AccountTypeMenuConfig = {
  accountType: "loan",
  getMenuItems: (row, tRaw, handlers) => [
    ...viewEditFreezeItems(row, tRaw, handlers),
    { key: "memo", label: tRaw("accountMaster.table.menuMemo"), icon: StickyNote, onClick: () => handlers.onMemo(row) },
  ],
};

// Investment Account Type - Menu 4
const investmentMenuConfig: AccountTypeMenuConfig = {
  accountType: "investment",
  getMenuItems: (row, tRaw, handlers) => viewEditFreezeItems(row, tRaw, handlers),
};

// Fixed Asset Account Type - Menu 4 (same as investment)
const fixedAssetMenuConfig: AccountTypeMenuConfig = {
  accountType: "fixed-asset",
  getMenuItems: (row, tRaw, handlers) => viewEditFreezeItems(row, tRaw, handlers),
};

// Configuration mapping
export const accountTypeMenuConfigs: Record<AccountMasterType, AccountTypeMenuConfig> = {
  "ca-sa": caSaMenuConfig,
  deposit: depositMenuConfig,
  loan: loanMenuConfig,
  investment: investmentMenuConfig,
  "fixed-asset": fixedAssetMenuConfig,
};

/** Returns the row-action menu items for a given account type, wired to the caller's handlers. */
export const getMenuItemsForAccountType = (
  accountType: AccountMasterType,
  row: RowData,
  tRaw: (key: string) => string,
  handlers: AccountRowMenuHandlers
): RowActionMenuItem[] => {
  const config = accountTypeMenuConfigs[accountType];
  if (!config) {
    console.warn(`No menu configuration found for account type: ${accountType}`);
    return [];
  }
  return config.getMenuItems(row, tRaw, handlers);
};
