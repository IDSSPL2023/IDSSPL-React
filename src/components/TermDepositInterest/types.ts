// Define the tab options used across the authorization workflow
export type AuthTab = "new" | "modify" | "rejected";

// Strictly typed model for the Term Deposit Interest Payment grid
export type TermDepositRow = {
  srNo: number;
  scrollNo: string;
  accountCode: string;
  accountName: string;
  scrollDate: string;
  createdBy: string;
  createdDate: string;
  tab: AuthTab;
};

// Raw sample template representing the data structure in your screenshot
const SAMPLE_DEPOSIT = {
  scrollNo: "118",
  accountCode: "00022010000001",
  accountName: "Akshay Om More",
  scrollDate: "12-May-2026",
  createdBy: "Admin",
  createdDate: "23-May-2026",
};

// Helper function to dynamically generate sequential mock rows per tab state
const buildRows = (tab: AuthTab, count: number): TermDepositRow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...SAMPLE_DEPOSIT,
    srNo: i + 1,
    tab,
  }));

// Complete dataset exported for your layout orchestrator
export const TERM_DEPOSIT_ROWS: TermDepositRow[] = [
  ...buildRows("new", 10),       // Generates 10 rows for the 'New Authorization' tab
  ...buildRows("modify", 6),     // Generates 6 rows for the 'Modify Authorization' tab
  ...buildRows("rejected", 6),   // Generates 6 rows for the 'Authorize Rejected' tab
];