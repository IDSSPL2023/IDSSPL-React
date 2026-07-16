import { IdCard, IndianRupee, User, Layers } from "lucide-react";

export const MASTERS = [
  { icon: "Wallet", titleEn: "Modify Account Balance", titleHi: "", key: "modifyAccountBalance" },
  { icon: "Landmark", titleEn: "Modify Branch GL Balance", titleHi: "", key: "modifyBranchGlBalance" },
  { icon: "History", titleEn: "Modify Branch GL History", titleHi: "", key: "modifyBranchGlHistory" },
  { icon: "Banknote", titleEn: "Modify Cashhandling Record", titleHi: "", key: "modifyCashhandlingRecord" },
  { icon: "ScrollText", titleEn: "Modify Daily Scroll", titleHi: "", key: "modifyDailyScroll" },
  { icon: "ArrowLeftRight", titleEn: "Modify Daily TXN", titleHi: "", key: "modifyDailyTxn" },
  { icon: "Coins", titleEn: "Modify User Denomination", titleHi: "", key: "modifyUserDenomination" },
  { icon: "ScrollText", titleEn: "Modify Denomination Scroll", titleHi: "", key: "modifyDenominationScroll" },
  {
    icon: "Percent",
    titleEn: "Modify Interest Receivable",
    titleHi: "व्याज मिळण्यायोग्य बदलवा",
    key: "modifyInterestReceivable",
    uiType: "accountLookupTable",
  },
  { icon: "ShieldCheck", titleEn: "Support Audit Trail", titleHi: "", key: "supportAuditTrail", uiType: "accountLookupTable", },
  { icon: "Wallet", titleEn: "Update TXN Balance", titleHi: "", key: "updateTxnBalance" },
  { icon: "Wallet", titleEn: "Update TXN Current Balance", titleHi: "", key: "updateTxnCurrentBalance" },
];

const FIELD_ICONS = {
  id: IdCard,
  rupee: IndianRupee,
  user: User,
  layers: Layers,
};

export const MASTER_CONFIG = {};

const DEFAULT_CONFIG = {
  columns: [{ key: "code", label: "Code" }, { key: "name", label: "Name" }],
  rows: [
    { id: "1", code: "001", name: "Sample Record 1" },
    { id: "2", code: "002", name: "Sample Record 2" },
    { id: "3", code: "003", name: "Sample Record 3" },
  ],
  fields: [
    { key: "code", labelEn: "Code", labelHi: "कोड", placeholder: "Enter Code", icon: "id", readOnlyOnEdit: true },
    { key: "name", labelEn: "Name", labelHi: "नाव", placeholder: "Enter Name", icon: "user" },
  ],
  filterFields: [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
  ],
};

// Config for the "accountLookupTable" uiType: pick an account, then review/edit
// a checkable table of records tied to that account. Reusable across any
// master flagged with `uiType: "accountLookupTable"` in MASTERS above —
// just add an entry here keyed by the same masterKey.
export const ACCOUNT_LOOKUP_CONFIG = {
  modifyInterestReceivable: {
    titleEn: "Modify Interest Receivable",
    titleHi: "व्याज मिळण्यायोग्य बदलवा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    columns: [
      { key: "accountCode", label: "Account Code", editable: false },
      { key: "interestDate", label: "Interest Date", editable: false },
      { key: "interestAmount", label: "Interest Amount", editable: true },
      { key: "penalAmount", label: "Penal Amount", editable: true },
    ],
    accounts: [
      { code: "0001", name: "Ramesh Patil" },
      { code: "0002", name: "Suresh Kulkarni" },
      { code: "0003", name: "Anita Deshmukh" },
    ],
    rowsByAccount: {
      "0002": [
        { id: "1", accountCode: "00025050007604", interestDate: "12-Nov-2035", interestAmount: "1320", penalAmount: "0" },
        { id: "2", accountCode: "00025050007604", interestDate: "12-Nov-2035", interestAmount: "1320", penalAmount: "0" },
      ],
    },
  },
  supportAuditTrail: {
    titleEn: "Support Audit Trail",
    titleHi: "व्याज मिळण्यायोग्य बदलवा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    columns: [
      { key: "accountCode", label: "Account Code", editable: false },
      { key: "accountName", label: "Account Name", editable: false },
    ],
    accounts: [
      { code: "0001", name: "Ramesh Patil" },
      { code: "0002", name: "Suresh Kulkarni" },
      { code: "0003", name: "Anita Deshmukh" },
    ],
    rowsByAccount: {
      "0001": [],
      "0002": [],
      "0003": [],
    },
    type: "auditTrail",
  },
};

export const getAccountLookupConfig = (masterKey) => ACCOUNT_LOOKUP_CONFIG[masterKey];

export const getMasterConfig = (masterKey) => MASTER_CONFIG[masterKey] || DEFAULT_CONFIG;

export const getFieldIcon = (iconKey) => FIELD_ICONS[iconKey] || IdCard;

export const rowToFormData = (masterKey, row) => {
  const config = getMasterConfig(masterKey);
  const data = {};
  config.fields.forEach((field) => {
    data[field.key] = row?.[field.key] ?? "";
  });
  return data;
};

export const emptyFormData = (masterKey) => {
  const config = getMasterConfig(masterKey);
  const data = {};
  config.fields.forEach((field) => {
    data[field.key] = "";
  });
  return data;
};
