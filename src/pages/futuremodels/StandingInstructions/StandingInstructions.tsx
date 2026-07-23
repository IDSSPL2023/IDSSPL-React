import { useState } from "react";
import { Ban, User, CreditCard, Calendar, FileText, IndianRupee, Repeat, ListChecks, Hash, X, ChevronDown } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import RowActionMenu from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import StatusPill from "@/components/shared/StatusPill";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import AddSI, { type NewSIFormData } from "@/components/StandingInstruction/AddSI";

/* ===== from TableSI.tsx ===== */
export type TableSI_SIRow = {
  srNo: number;
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  amount: string;
  frequency: string;
  status: string;
  executedCount: string;
};

const TableSI_columns = [
  { key: "srNo", labelKey: "standingInstructions.table.srNo", sortable: false },
  { key: "action", labelKey: "standingInstructions.table.action", sortable: false },
  { key: "debit", labelKey: "standingInstructions.table.debit", sortable: false },
  { key: "credit", labelKey: "standingInstructions.table.credit", sortable: false },
  { key: "amount", labelKey: "standingInstructions.table.amount", sortable: true },
  { key: "frequency", labelKey: "standingInstructions.table.frequency", sortable: true },
  { key: "nextDueDate", labelKey: "standingInstructions.table.nextDueDate", sortable: true },
  { key: "status", labelKey: "standingInstructions.table.status", sortable: true },
] as const;

const TableSI_rows: TableSI_SIRow[] = [
  { srNo: 1, debitAccountCode: "022010014255", debitName: "Mirji Chandrashekar Bhimgouda", creditAccountCode: "00024090001664", creditName: "Mirja Chandrashekar Bhimgouda", startDate: "24/03/2025", endDate: "23/03/2026", nextDueDate: "23/04/2026", amount: "6000.0", frequency: "Monthly", status: "Live", executedCount: "10" },
  { srNo: 2, debitAccountCode: "022010098765", debitName: "Swami Vivekanand Printing Press", creditAccountCode: "00021010000008", creditName: "Anita Singh", startDate: "15/06/2026", endDate: "30/06/2026", nextDueDate: "23/07/2026", amount: "9999.0", frequency: "Yearly", status: "Live", executedCount: "1" },
  { srNo: 3, debitAccountCode: "011203456789", debitName: "Rohit Kumar", creditAccountCode: "00024090005522", creditName: "Rajesh Kumar Sharma", startDate: "01/01/2024", endDate: "01/01/2027", nextDueDate: "01/08/2026", amount: "2500.0", frequency: "Quarterly", status: "Live", executedCount: "6" },
];

type TableSI_SortKey = "amount" | "frequency" | "nextDueDate" | "status";

interface TableSI_TableSIProps {
  onStop?: (row: TableSI_SIRow) => void;
}

const TableSI = ({ onStop }: TableSI_TableSIProps) => {
  const { tRaw } = useBilingual();
  const [sortKey, setSortKey] = useState<TableSI_SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: TableSI_SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedRows = [...TableSI_rows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary rounded-t-xl">
              {TableSI_columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key as TableSI_SortKey)}
                  className={`text-left text-[16px] font-semibold text-white px-4 py-2 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <SortableHeaderLabel label={tRaw(col.labelKey)} sortable={col.sortable} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr
                key={row.srNo}
                className={`${idx !== sortedRows.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}
              >
                <td className="px-6 py-3">
                  <SrNoBadge value={row.srNo} />
                </td>

                <td className="px-6 py-3 relative">
                  <RowActionMenu
                    menuWidth={224}
                    items={[
                      { key: "stop", label: tRaw("standingInstructions.table.menuStop"), icon: Ban, onClick: () => onStop?.(row) },
                    ]}
                  />
                </td>

                <td className="px-6 py-3 text-[16px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-black dark:text-slate-100">{row.debitAccountCode}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{row.debitName}</span>
                  </div>
                </td>

                <td className="px-6 py-3 text-[16px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-black dark:text-slate-100">{row.creditAccountCode}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{row.creditName}</span>
                  </div>
                </td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.amount}</td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.frequency}</td>

                <td className="px-6 py-3 text-[16px] text-gray-700 dark:text-slate-400">{row.nextDueDate}</td>

                <td className="px-6 py-3">
                  <StatusPill label={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/* ===== from StopSI.tsx ===== */
export interface StopSI_StopSIData {
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  amount: string;
  frequency: string;
  status: string;
  executedCount: string;
}

export interface StopSI_StopSIProps {
  onClose: () => void;
  onSave?: (stopReason: string) => void;
  data: StopSI_StopSIData;
}

const StopSI = ({ onClose, onSave, data }: StopSI_StopSIProps) => {
  const [stopReason, setStopReason] = useState("");

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const handleSave = () => {
    onSave?.(stopReason);
    onClose();
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Stop Standing Instruction"
      titleHi="नियतकालिक सूचना थांबवणे"
      headerIcon={<ListChecks size={24} className="text-primary" />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
    >
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<User size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Debit Account Code" labelHi="नावे खाते संकेत" required>
            <TextInput icon={<CreditCard size={16} />} value={data.debitAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={data.debitName} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Credit Account Code" labelHi="जमा खात्याचा कोड" required>
            <TextInput icon={<CreditCard size={16} />} value={data.creditAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={data.creditName} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="SI Details" titleHi="SI तपशील" icon={<Repeat size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Start Date" labelHi="सुरुवात तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.startDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="End Date" labelHi="समाप्तीची तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.endDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Next Due Date" labelHi="पुढील देय तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.nextDueDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Stop Reason" labelHi="रोखण्याचे कारण" required>
            <TextInput
              icon={<FileText size={16} />}
              value={stopReason}
              onChange={setStopReason}
              placeholder="Enter Stop Reason"
            />
          </FieldShell>
          <FieldShell label="Amount" labelHi="रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="SI Frequency" labelHi="SI वारंवारता" required>
            <TextInput icon={<Repeat size={16} />} value={data.frequency} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Status" labelHi="स्थिती" required>
            <TextInput icon={<ListChecks size={16} />} value={data.status} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Executed Count" labelHi="यशस्वी व्यवहारांची संख्या" required>
            <TextInput icon={<Hash size={16} />} value={data.executedCount} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!stopReason.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          Save <ChevronDown size={16} />
        </button>
      </div>
    </FormModal>
  );
};


/* ===== from StandingInstructionsPage.tsx ===== */
const StandingInstructionsPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [stopRow, setStopRow] = useState<TableSI_SIRow | null>(null);

  const handleAddSave = (data: NewSIFormData) => {
    window.alert(`Standing Instruction created for ${data.creditName || "new beneficiary"}.`);
  };

  const handleStopSave = (stopReason: string) => {
    window.alert(`Standing Instruction stopped. Reason: ${stopReason}`);
  };

  return (
    <div className="min-h-screen app-page-bg dark:bg-slate-950 relative">
      <NavbarCM
        titleEn={en("standingInstructions.title")}
        titleHi={t("standingInstructions.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.futureModels"), href: "/futuremodels" },
          { label: en("standingInstructions.breadcrumb"), href: "/futuremodels/standing-instructions" },
        ]}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
      />

      <div className="px-3 py-2">
        <TableSI onStop={(row) => setStopRow(row)} />
      </div>

      {openAddModal && (
        <AddSI onClose={() => setOpenAddModal(false)} onSave={handleAddSave} />
      )}

      {stopRow && (
        <StopSI
          onClose={() => setStopRow(null)}
          onSave={handleStopSave}
          data={stopRow}
        />
      )}
    </div>
  );
};

export default StandingInstructionsPage;
