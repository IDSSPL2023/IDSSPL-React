// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Eye, SquarePen, GitBranch } from "lucide-react";
import RowActionMenu from "../shared/RowActionMenu";
import PaginationModal from "@/components/common/PaginationModal";
import { getMasterConfig, rowToFormData } from "./masterConfig";
import ParameterModal from "./ParameterModal";
import ProductParameterModal, { ACCOUNT_TYPES } from "./ProductParameterModal";
import GlAccountParameterModal from "./GlAccountParameterModal";
import BranchEnableDisableModal from "./BranchEnableDisableModal";
import { fetchBranchAccount } from "@/api/headoffice.api";
import {
  fetchClearingTypeById,
  updateClearingType,
  fetchProductByCode,
  updateProduct,
  fetchInstallmentTypeById,
  updateInstallmentType,
  fetchIndustryById,
  updateIndustry,
  fetchDepositRuleById,
  updateDepositRule,
  fetchFinalAccountGroupByCode,
  updateFinalAccountGroup,
  fetchGlAccountByCode,
  updateGlAccount,
  fetchAccountMinBalanceById,
  updateAccountMinBalance,
  fetchAccountTypeByCode,
  updateAccountType,
  fetchActivityCodeById,
  updateActivityCode,
  fetchBranchParameterByCode,
  updateBranchParameter,
  fetchChequeTypeByCode,
  updateChequeType,
  fetchClassificationCodeById,
  updateClassificationCode,
} from "@/api/headoffice.api";

// The API stores loanDeposit as a legacy L/D code; the Add/Edit select shows
// the friendly words, so this pair converts at the display <-> payload boundary.
const loanDepositLabelFromCode = (code) => (code === "L" ? "Loan" : code === "D" ? "Deposit" : code);
const loanDepositCodeFromLabel = (label) => (label === "Loan" ? "L" : label === "Deposit" ? "D" : label);

const PAGE_SIZE = 10;

const menuOptions = [
  { key: "view", label: "View", icon: Eye },
  { key: "edit", label: "Edit", icon: SquarePen },
];

const SortableHeader = ({ label, sortable, onSort }) => (
  <div
    className={`flex items-center gap-1.5 select-none ${sortable ? "cursor-pointer" : ""}`}
    onClick={sortable ? onSort : undefined}
  >
    <span>{label}</span>
    {sortable && <ArrowUpDown size={13} />}
  </div>
);

const YesNoPill = ({ value }) =>
  value === "Y" ? (
    <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary-950/40">
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40">
      No
    </span>
  );

const PRODUCT_BOOLEAN_COLUMNS = new Set([
  "implemented",
  "nomineeRequired",
  "cashTransactionAllowed",
  "inwardClearingAllowed",
]);

const renderProductCell = (col, row) => {
  if (col.key === "accountType") {
    const description = ACCOUNT_TYPES.find((a) => a.code === row.accountType)?.description ?? "";
    return (
      <div>
        <div className="font-semibold text-gray-800 dark:text-slate-100">{row.accountType}</div>
        {description && <div className="text-xs text-gray-400 dark:text-slate-500">{description}</div>}
      </div>
    );
  }
  if (col.key === "productCode") {
    return (
      <div>
        <div className="font-semibold text-gray-800 dark:text-slate-100">{row.productCode}</div>
        {row.description && <div className="max-w-[220px] truncate text-xs text-gray-400 dark:text-slate-500">{row.description}</div>}
      </div>
    );
  }
  if (PRODUCT_BOOLEAN_COLUMNS.has(col.key)) {
    return <YesNoPill value={row[col.key]} />;
  }
  return row[col.key];
};

const LetterPill = ({ value }) => (
  <span className="inline-flex items-center rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary dark:border-primary-800 dark:bg-primary-950/40">
    {value || "-"}
  </span>
);

const INSTALLMENT_ON_LABELS = {
  P: "Principle",
  S: "Sub",
  B: "Sub Account",
  N: "Null",
};

const INSTALLMENT_BOOLEAN_COLUMNS = new Set([
  "diaryBased",
  "principalArrearsOnDiary",
  "interestArrearsOnDiary",
]);

const renderInstallmentTypeCell = (col, row) => {
  if (col.key === "installmentOn") {
    return INSTALLMENT_ON_LABELS[row.installmentOn] ?? row.installmentOn;
  }
  if (INSTALLMENT_BOOLEAN_COLUMNS.has(col.key)) {
    return <LetterPill value={row[col.key]} />;
  }
  return row[col.key];
};

const DataTable = ({ master, rows, filters, onRowsChange, serverPagination }) => {
  const config = getMasterConfig(master.key);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [modal, setModal] = useState(null);
  const [clientPage, setClientPage] = useState(1);

  useEffect(() => {
    setClientPage(1);
  }, [master.key, filters]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredRows = useMemo(() => {
    // defaultBranchAccounts filtering is done server-side via the search API,
    // so `rows` already reflects the active filter — don't re-filter client-side.
    if (master.key === "defaultBranchAccounts") return rows;

    const activeFilters = Object.entries(filters || {}).filter(([, v]) => v?.trim());
    if (activeFilters.length === 0) return rows;

    return rows.filter((row) =>
      activeFilters.every(([key, value]) =>
        String(row[key] ?? "").toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [rows, filters, master.key]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortAsc]);

  // For server-paginated masters, `rows` is already just the current page's
  // batch (10 rows fetched from the server) — don't re-slice it client-side,
  // and drive the pagination control from the server's own page/totalPages.
  const page = serverPagination ? serverPagination.page : clientPage;
  const setPage = serverPagination ? serverPagination.onPageChange : setClientPage;
  const totalPages = serverPagination ? serverPagination.totalPages : Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const pagedRows = serverPagination ? sortedRows : sortedRows.slice((clientPage - 1) * PAGE_SIZE, clientPage * PAGE_SIZE);

  const handleMenuAction = async (action, row) => {
    if (action === "branchEnableDisable") {
      setModal({
        mode: action,
        row,
      });
      return;
    }

    if (master.key === "clearingType" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchClearingTypeById(row.id);
        setModal({ mode: action, data: rowToFormData(master.key, fresh), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest clearing type details.");
      }
      return;
    }

    if (master.key === "glAccount" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: row, rowId: row.id });
      try {
        const fresh = await fetchGlAccountByCode(row.id);
        setModal({ mode: action, data: fresh, rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest GL account details.");
      }
      return;
    }

    if (master.key === "productMaster" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: row, rowId: row.id });
      try {
        const fresh = await fetchProductByCode(row.id);
        setModal({ mode: action, data: fresh, rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest product details.");
      }
      return;
    }

    if (master.key === "installmentType" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchInstallmentTypeById(row.id);
        setModal({ mode: action, data: rowToFormData(master.key, fresh), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest installment type details.");
      }
      return;
    }

    if (master.key === "industry" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchIndustryById(row.id);
        setModal({ mode: action, data: rowToFormData(master.key, fresh), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest industry details.");
      }
      return;
    }

    if (master.key === "depositRule" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchDepositRuleById(row.id);
        setModal({ mode: action, data: rowToFormData(master.key, fresh), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest deposit rule details.");
      }
      return;
    }

    if (master.key === "finalAccountGroup" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchFinalAccountGroupByCode(row.id);
        setModal({ mode: action, data: rowToFormData(master.key, fresh), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest final account group details.");
      }
      return;
    }

    if (master.key === "accountMinBal" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchAccountMinBalanceById(row.id);
        const freshRow = {
          id: String(fresh.minimumBalanceId),
          minBalanceId: String(fresh.minimumBalanceId),
          minBalance: String(fresh.minimumBalance),
          minBalanceCheque: String(fresh.minimumBalanceWithCheque),
          minBalanceAtm: String(fresh.minimumBalanceWithAtm),
        };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest account minimum balance details.");
      }
      return;
    }

    if (master.key === "accountType" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchAccountTypeByCode(row.id);
        const freshRow = {
          id: fresh.accountType,
          accountId: fresh.accountType,
          accountName: fresh.name,
          loanDeposit: loanDepositLabelFromCode(fresh.loanDeposit),
        };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest account type details.");
      }
      return;
    }

    if (master.key === "activityCode" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchActivityCodeById(row.id);
        const freshRow = {
          id: String(fresh.activityId),
          activityId: String(fresh.activityId),
          description: fresh.description,
        };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest activity code details.");
      }
      return;
    }

    if (master.key === "branchParameter" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchBranchParameterByCode(row.id);
        const freshRow = { id: fresh.branchCode, ...fresh, weeklyHoliday: String(fresh.weeklyHoliday) };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest branch parameter details.");
      }
      return;
    }

    if (master.key === "chequeType" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchChequeTypeByCode(row.id);
        const freshRow = { id: fresh.chequeTypeCode, ...fresh };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest cheque type details.");
      }
      return;
    }

    if (master.key === "classificationCode" && (action === "view" || action === "edit")) {
      setModal({ mode: action, data: rowToFormData(master.key, row), rowId: row.id });
      try {
        const fresh = await fetchClassificationCodeById(row.id);
        const freshRow = {
          id: String(fresh.classificationId),
          classificationId: String(fresh.classificationId),
          description: fresh.description,
        };
        setModal({ mode: action, data: rowToFormData(master.key, freshRow), rowId: row.id });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Failed to load the latest classification code details.");
      }
      return;
    }

    setModal({
      mode: action,
      data: rowToFormData(master.key, row),
      rowId: row.id,
    });
  };

  const handleSave = async (formData) => {
    // Refresh from API so the table reflects the authoritative saved values
    if (master.key === "defaultBranchAccounts") {
      try {
        const data = await fetchBranchAccount();
        onRowsChange(data.map((item, idx) => ({ id: String(idx), ...item })));
      } catch (error) {
        console.error("Failed to refresh branch accounts:", error);
      }
      setModal(null);
      return;
    }

    if (modal?.mode === "add") {
      const newRow = {
        id: String(Date.now()),
        ...formData,
      };
      onRowsChange([...rows, newRow]);
    } else if (modal?.mode === "edit") {
      if (master.key === "clearingType") {
        try {
          const updated = await updateClearingType(modal.rowId, {
            description: formData.description,
            clearingHouseCode: formData.clearingHouseCode,
            payableRequired: formData.payableRequired,
            payableHead: formData.payableHead,
            receivableRequired: formData.receivableRequired,
            receivableHead: formData.receivableHead,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update clearing type. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "productMaster") {
        try {
          const p = formData.product;
          const updated = await updateProduct(modal.rowId, {
            description: p.description,
            shortDescription: p.shortDescription,
            accountType: p.accountType,
            implemented: p.implemented,
            cashTransactionAllowed: p.cashTransactionAllowed,
            defaultMinimumBalanceId: p.defaultMinimumBalanceId,
            interestRoundingFactor: p.interestRoundingFactor,
            nomineeRequired: p.nomineeRequired,
            inwardClearingAllowed: p.inwardClearingAllowed,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated, id: updated.productCode } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update product. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "glAccount") {
        try {
          const updated = await updateGlAccount(modal.rowId, formData.update);
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated, id: updated.glAccountCode } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update GL account. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "installmentType") {
        try {
          const updated = await updateInstallmentType(modal.rowId, {
            description: formData.description,
            diaryBased: formData.diaryBased,
            principalArrearsOnDiary: formData.principalArrearsOnDiary,
            interestArrearsOnDiary: formData.interestArrearsOnDiary,
            installmentOn: formData.installmentOn,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update installment type. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "industry") {
        try {
          const updated = await updateIndustry(modal.rowId, {
            description: formData.description,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update industry. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "depositRule") {
        try {
          const updated = await updateDepositRule(modal.rowId, {
            description: formData.description,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update deposit rule. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "finalAccountGroup") {
        try {
          const updated = await updateFinalAccountGroup(modal.rowId, {
            description: formData.description,
          });
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updated } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update final account group. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "accountMinBal") {
        try {
          const updated = await updateAccountMinBalance({
            minimumBalanceId: Number(modal.rowId),
            minimumBalance: Number(formData.minBalance) || 0,
            minimumBalanceWithCheque: Number(formData.minBalanceCheque) || 0,
            minimumBalanceWithAtm: Number(formData.minBalanceAtm) || 0,
          });
          const updatedRow = {
            id: String(updated.minimumBalanceId),
            minBalanceId: String(updated.minimumBalanceId),
            minBalance: String(updated.minimumBalance),
            minBalanceCheque: String(updated.minimumBalanceWithCheque),
            minBalanceAtm: String(updated.minimumBalanceWithAtm),
          };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update account minimum balance. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "accountType") {
        try {
          const updated = await updateAccountType({
            accountType: modal.rowId,
            name: formData.accountName,
            loanDeposit: loanDepositCodeFromLabel(formData.loanDeposit),
          });
          const updatedRow = {
            id: updated.accountType,
            accountId: updated.accountType,
            accountName: updated.name,
            loanDeposit: loanDepositLabelFromCode(updated.loanDeposit),
          };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update account type. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "activityCode") {
        try {
          const updated = await updateActivityCode({
            activityId: Number(modal.rowId),
            description: formData.description,
          });
          const updatedRow = {
            id: String(updated.activityId),
            activityId: String(updated.activityId),
            description: updated.description,
          };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update activity code. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "branchParameter") {
        try {
          const updated = await updateBranchParameter(modal.rowId, {
            branchCode: modal.rowId,
            serviceBranchCode: formData.serviceBranchCode,
            weeklyHoliday: Number(formData.weeklyHoliday) || 0,
            isDenominationRequired: formData.isDenominationRequired,
            isTellerSystemUsed: formData.isTellerSystemUsed,
            isHeadOffice: formData.isHeadOffice,
            isOnlineClearingImplemented: formData.isOnlineClearingImplemented,
            isBranchTransacting: formData.isBranchTransacting,
            workingDay: formData.workingDay,
            isDayEndExecuted: formData.isDayEndExecuted,
            sbNextInterestPostingDate: formData.sbNextInterestPostingDate,
            caNextInterestPostingDate: formData.caNextInterestPostingDate,
            tdNextInterestPostingDate: formData.tdNextInterestPostingDate,
            tlNextInterestPostingDate: formData.tlNextInterestPostingDate,
            ccNextInterestPostingDate: formData.ccNextInterestPostingDate,
          });
          const updatedRow = { id: updated.branchCode, ...updated, weeklyHoliday: String(updated.weeklyHoliday) };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update branch parameter. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "chequeType") {
        try {
          const updated = await updateChequeType({
            chequeTypeCode: modal.rowId,
            description: formData.description,
          });
          const updatedRow = { id: updated.chequeTypeCode, ...updated };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update cheque type. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      if (master.key === "classificationCode") {
        try {
          const updated = await updateClassificationCode({
            classificationId: Number(modal.rowId),
            description: formData.description,
          });
          const updatedRow = {
            id: String(updated.classificationId),
            classificationId: String(updated.classificationId),
            description: updated.description,
          };
          onRowsChange(
            rows.map((row) => (row.id === modal.rowId ? { ...row, ...updatedRow } : row))
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to update classification code. Please try again.");
          throw err;
        }
        setModal(null);
        return;
      }
      onRowsChange(
        rows.map((row) =>
          row.id === modal.rowId ? { ...row, ...formData } : row
        )
      );
    }
    setModal(null);
  };

  return (
    <>
      <div className="min-w-7xl mx-auto p-4">
        <div className="p-5 bg-white rounded-xl shadow-sm dark:bg-slate-900">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Sr No.</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
                  {config.columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      <SortableHeader
                        label={col.label}
                        sortable
                        onSort={() => handleSort(col.key)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 2}
                      className="px-4 py-8 text-center text-gray-400 dark:text-slate-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="odd:bg-white even:bg-gray-50 border-t border-gray-100 hover:bg-primary-50/30 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-800"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center min-w-[26px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 text-xs font-semibold">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <RowActionMenu
                          items={menuOptions.map((opt) => ({
                            ...opt,
                            onClick: () => handleMenuAction(opt.key, row),
                          }))}
                          menuWidth={224}
                          triggerClassName="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                          ariaLabel="Head office row actions"
                        />
                      </td>
                      {config.columns.map((col) => (
                        <td key={col.key} className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-slate-300">
                          {master.key === "productMaster"
                            ? renderProductCell(col, row)
                            : master.key === "installmentType"
                              ? renderInstallmentTypeCell(col, row)
                              : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {sortedRows.length > 0 && (
            <PaginationModal page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>

      {modal?.mode === "branchEnableDisable" ? (
        <BranchEnableDisableModal
          row={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(formData) => {
            onRowsChange(
              rows.map((row) =>
                row.id === modal.row?.id
                  ? {
                    ...row,
                    transactionAllowed: formData.transactionAllowed === "enable" ? "Enable" : "Disable",
                    workingDate: formData.workingDate,
                  }
                  : row
              )
            );
          }}
        />
      ) : modal && master.key === "productMaster" ? (
        <ProductParameterModal
          mode={modal.mode}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      ) : modal && master.key === "glAccount" ? (
        <GlAccountParameterModal
          mode={modal.mode}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      ) : modal ? (
        <ParameterModal
          mode={modal.mode}
          masterKey={master.key}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      ) : null}
    </>
  );
};

export default DataTable;
