// @ts-nocheck
import { IdCard, IndianRupee, User, Layers } from "lucide-react";

export const MASTERS = [
  {
    icon: "Wallet",
    titleEn: "Modify Account Balance",
    titleHi: "खाते शिल्लक सुधारणा करा",
    key: "modifyAccountBalance",
    uiType: "formSections",
  },
  {
    icon: "Landmark",
    titleEn: "Modify Branch GL Balance",
    titleHi: "शाखेची जीएल शिल्लक सुधारित करा",
    key: "modifyBranchGlBalance",
    uiType: "formSections",
  },
  {
    icon: "History",
    titleEn: "Modify Branch GL History",
    titleHi: "शाखेच्या जीएल इतिहासामध्ये बदल करा",
    key: "modifyBranchGlHistory",
    uiType: "formSections",
  },
  {
    icon: "Banknote",
    titleEn: "Modify Cashhandling Record",
    titleHi: "रोख व्यवहार नोंदीमध्ये बदल करा",
    key: "modifyCashhandlingRecord",
    uiType: "formSections",
  },
  {
    icon: "ScrollText",
    titleEn: "Modify Daily Scroll",
    titleHi: "दैनंदिन स्क्रोलमध्ये बदल करा",
    key: "modifyDailyScroll",
    uiType: "scrollModify",
  },
  {
    icon: "ArrowLeftRight",
    titleEn: "Modify Daily TXN",
    titleHi: "दैनंदिन व्यवहारात बदल करा",
    key: "modifyDailyTxn",
    uiType: "scrollModify",
  },
  {
    icon: "Coins",
    titleEn: "Modify User Denomination",
    titleHi: "युजर मूल्यवर्ग बदला",
    key: "modifyUserDenomination",
    uiType: "denomination",
  },
  {
    icon: "ScrollText",
    titleEn: "Modify Denomination Scroll",
    titleHi: "मूल्य बदलण्याची स्क्रोल",
    key: "modifyDenominationScroll",
    uiType: "formSections",
  },
  {
    icon: "Percent",
    titleEn: "Modify Interest Receivable",
    titleHi: "व्याज मिळण्यायोग्य बदलवा",
    key: "modifyInterestReceivable",
    uiType: "accountLookupTable",
  },
  { icon: "ShieldCheck", titleEn: "Support Audit Trail", titleHi: "सपोर्ट ऑडिट ट्रेल", key: "supportAuditTrail", uiType: "accountLookupTable", },
  { icon: "Wallet", titleEn: "Update TXN Balance", titleHi: "व्यवहार शिल्लक अद्ययावत करा", key: "updateTxnBalance" },
  { icon: "Wallet", titleEn: "Update TXN Current Balance", titleHi: "व्यवहार चालू शिल्लक अद्ययावत करा", key: "updateTxnCurrentBalance" },
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

// Config for the "scrollModify" uiType: pick a branch + a scroll/transaction
// number, validate the header fields, then review a checkable table of the
// entries tied to that number. Reusable across any master flagged with
// `uiType: "scrollModify"` in MASTERS above — just add an entry here keyed
// by the same masterKey.
export const SCROLL_MODIFY_CONFIG = {
  modifyDailyScroll: {
    titleEn: "Modify Daily Scroll",
    titleHi: "दैनंदिन स्क्रोलमध्ये बदल करा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    numberFieldKey: "scrollNumber",
    numberFieldLabel: "Scroll Number",
    dateFieldKey: "scrollDate",
    dateFieldLabel: "Scroll Date",
    assignFieldKey: "assignOn",
    assignFieldLabel: "Assign On",
    branches: [
      { code: "1001", name: "Main Branch" },
      { code: "1002", name: "City Branch" },
      { code: "1003", name: "Market Branch" },
    ],
    numbers: [
      { code: "1", name: "Scroll 1" },
      { code: "4", name: "Scroll 4" },
    ],
    columns: [
      { key: "scrollNumber", label: "Scroll Number" },
      { key: "accountCode", label: "Account Code" },
      { key: "glAccountCode", label: "GL Account Code" },
      { key: "indicator", label: "Indicator" },
      { key: "amount", label: "Amount" },
      { key: "txnStatus", label: "TXN Status" },
      { key: "accBalance", label: "Acc Balance" },
      { key: "txnId", label: "TXN ID" },
      { key: "particular", label: "Particular" },
    ],
    rowsByNumber: {
      "1": [
        {
          id: "1",
          scrollNumber: "1",
          accountCode: "00022010000001",
          glAccountCode: "000000200101",
          indicator: "TRDR",
          amount: "50",
          txnStatus: "E",
          accBalance: "0.0",
          txnId: "0",
          particular: "To Chequebook Charges",
        },
      ],
      "4": [
        {
          id: "2",
          scrollNumber: "4",
          accountCode: "00000000400120",
          glAccountCode: "000000400120",
          indicator: "TRDR",
          amount: "50",
          txnStatus: "E",
          accBalance: "0.0",
          txnId: "0",
          particular: "By Chequebook Issue Charges",
        },
      ],
    },
  },
  modifyDailyTxn: {
    titleEn: "Modify Daily TXN",
    titleHi: "दैनंदिन व्यवहारात बदल करा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    numberFieldKey: "tnxNumber",
    numberFieldLabel: "TNX Number",
    dateFieldKey: "tnxDate",
    dateFieldLabel: "TNX Date",
    assignFieldKey: "assignedBy",
    assignFieldLabel: "Assigned By",
    branches: [
      { code: "1001", name: "Main Branch" },
      { code: "1002", name: "City Branch" },
      { code: "1003", name: "Market Branch" },
    ],
    numbers: [
      { code: "1", name: "TXN 1" },
      { code: "4", name: "TXN 4" },
    ],
    columns: [
      { key: "scrollNumber", label: "Scroll Number" },
      { key: "accountCode", label: "Account Code" },
      { key: "glAccountCode", label: "GL Account Code" },
      { key: "indicator", label: "Indicator" },
      { key: "amount", label: "Amount" },
      { key: "txnStatus", label: "TXN Status" },
      { key: "accBalance", label: "Acc Balance" },
      { key: "txnId", label: "TXN ID" },
      { key: "subTxn", label: "Sub TXN" },
      { key: "particular", label: "Particular" },
    ],
    rowsByNumber: {
      "1": [
        {
          id: "1",
          scrollNumber: "1",
          accountCode: "00022010000001",
          glAccountCode: "000000200101",
          indicator: "TRDR",
          amount: "50",
          txnStatus: "E",
          accBalance: "0.0",
          txnId: "0",
          subTxn: "1",
          particular: "To Chequebook Charges",
        },
      ],
      "4": [
        {
          id: "2",
          scrollNumber: "4",
          accountCode: "00000000400120",
          glAccountCode: "000000400120",
          indicator: "TRDR",
          amount: "50",
          txnStatus: "E",
          accBalance: "0.0",
          txnId: "0",
          subTxn: "1",
          particular: "By Chequebook Issue Charges",
        },
      ],
    },
  },
};

export const getScrollModifyConfig = (masterKey) => SCROLL_MODIFY_CONFIG[masterKey];

// Config for the "denomination" uiType: pick a user, record the cash-handling
// context, then capture the denomination-wise note/coin count. Reusable
// across any master flagged with `uiType: "denomination"` in MASTERS above —
// just add an entry here keyed by the same masterKey.
export const DENOMINATION_CONFIG = {
  modifyUserDenomination: {
    titleEn: "Modify Denomination",
    titleHi: "मूल्यवर्ग बदला",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    infoTitleEn: "Cash Handling Information",
    infoTitleHi: "रोख व्यवहार माहिती",
    infoSubtitleEn: "Select the branch and transaction details before recording cash denominations.",
    infoSubtitleHi: "रोख मूल्यवर्ग नोंदवण्यापूर्वी शाखा आणि व्यवहार तपशील निवडा.",
    summaryTitleEn: "Cash Denomination Summary",
    summaryTitleHi: "रोख मूल्यवर्ग सारांश",
    summarySubtitleEn: "Enter the denomination-wise cash count and verify the total cash amount.",
    summarySubtitleHi: "मूल्यवर्गानुसार रोख मोजणी नोंदवा व एकूण रोख रक्कम पडताळून पहा.",
    users: [
      { code: "U001", name: "Ramesh Patil" },
      { code: "U002", name: "Suresh Kulkarni" },
      { code: "U003", name: "Anita Deshmukh" },
    ],
    modifyOptions: [
      { value: "current", labelEn: "Current" },
      { value: "previous", labelEn: "Previous" },
    ],
    denominationFields: [
      { key: "note2000", labelEn: "Note 2000" },
      { key: "note500", labelEn: "Note 500" },
      { key: "note200", labelEn: "Note 200" },
      { key: "note100", labelEn: "Note 100" },
      { key: "note50", labelEn: "Note 50" },
      { key: "note20", labelEn: "Note 20" },
      { key: "note10", labelEn: "Note 10" },
      { key: "coins", labelEn: "Coins" },
      { key: "currentCash", labelEn: "Current Cash" },
      { key: "cashOpening", labelEn: "Cash Opening" },
      { key: "cashDeposit", labelEn: "Cash Deposit" },
      { key: "cashWithdrawal", labelEn: "Cash Withdrawal" },
    ],
  },
};

export const getDenominationConfig = (masterKey) => DENOMINATION_CONFIG[masterKey];

// Shared lookup datasets + picker configs reused across the "formSections"
// masters below (branch / account / GL account / scroll number pickers).
const SAMPLE_BRANCHES = [
  { code: "1001", name: "Main Branch" },
  { code: "1002", name: "City Branch" },
  { code: "1003", name: "Market Branch" },
];

const SAMPLE_ACCOUNTS = [
  { code: "00022010000001", name: "Ramesh Patil" },
  { code: "00025050007604", name: "Suresh Kulkarni" },
  { code: "00000000400120", name: "Anita Deshmukh" },
];

const SAMPLE_GL_ACCOUNTS = [
  { code: "000000200101", name: "Savings GL" },
  { code: "000000400120", name: "Current GL" },
  { code: "000000500110", name: "Fixed Deposit GL" },
];

const SAMPLE_SCROLLS = [
  { code: "1", name: "Scroll 1" },
  { code: "4", name: "Scroll 4" },
];

const PICKER_BRANCH = {
  titleEn: "Select Branch",
  columns: [
    { key: "code", label: "Branch Code" },
    { key: "name", label: "Branch Name" },
  ],
  rows: SAMPLE_BRANCHES,
  setField: "branchCode",
  deriveMap: { name: "branchName" },
};

const PICKER_ACCOUNT = {
  titleEn: "Select Account",
  columns: [
    { key: "code", label: "Account Code" },
    { key: "name", label: "Account Name" },
  ],
  rows: SAMPLE_ACCOUNTS,
  setField: "accountCode",
  deriveMap: { name: "accountName" },
};

const PICKER_GL_ACCOUNT = {
  titleEn: "Select GL Account",
  columns: [
    { key: "code", label: "GL Account Code" },
    { key: "name", label: "Description" },
  ],
  rows: SAMPLE_GL_ACCOUNTS,
  setField: "glAccountCode",
  deriveMap: { name: "description" },
};

const PICKER_SCROLL = {
  titleEn: "Select Scroll Number",
  columns: [
    { key: "code", label: "Scroll Number" },
    { key: "name", label: "Description" },
  ],
  rows: SAMPLE_SCROLLS,
  setField: "scrollNumber",
  deriveMap: { code: "cashHandlingNumber" },
};

const AS_ON_DATE_OPTIONS = [
  { value: "current", labelEn: "Current" },
  { value: "previous", labelEn: "Previous" },
];

// Config for the "formSections" uiType: one or more bordered form sections
// (each a grid of fields, some backed by lookup pickers) validated together,
// then a shared Validate / Cancel / Display footer. This mirrors the design
// of the standalone masters already built in the Future Models (DBA) module,
// reused here as Support Utility masters. Reusable across any master flagged
// `uiType: "formSections"` in MASTERS above -- just add an entry here keyed
// by the same masterKey.
export const FORM_SECTIONS_CONFIG = {
  modifyAccountBalance: {
    titleEn: "Modify Account Balance",
    titleHi: "खाते शिल्लक सुधारणा करा",
    subtitleEn: "Update the ledger and available balance for an account with an approved reason.",
    subtitleHi: "मान्यताप्राप्त कारणासह खात्याची लेजर आणि उपलब्ध शिल्लक अद्ययावत करा.",
    sections: [
      {
        columns: 2,
        fields: [
          { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", type: "picker", picker: "branch" },
          { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", type: "readonly" },
          { key: "accountCode", labelEn: "Account Code", labelHi: "खाते कोड", type: "picker", picker: "account" },
          { key: "accountName", labelEn: "Account Name", labelHi: "खातेधारकाचे नाव", type: "readonly" },
          { key: "assignedBy", labelEn: "Assigned By", labelHi: "नियुक्त केलेले", type: "text" },
          { key: "reasonOfModification", labelEn: "Reason of Modification", labelHi: "बदलाचे कारण", type: "text" },
          { key: "ledgerBalance", labelEn: "Ledger Balance", labelHi: "लेजर शिल्लक", type: "amount" },
          { key: "availableBalance", labelEn: "Available Balance", labelHi: "उपलब्ध शिल्लक", type: "amount" },
          { key: "newLedgerBalance", labelEn: "New Ledger Balance", labelHi: "नवीन लेजर शिल्लक", type: "amount" },
          { key: "monthMinimumBalance", labelEn: "Month Minimum Balance", labelHi: "महिन्याची किमान शिल्लक", type: "amount" },
        ],
      },
    ],
    pickers: { branch: PICKER_BRANCH, account: PICKER_ACCOUNT },
  },

  modifyBranchGlBalance: {
    titleEn: "Modify Branch GL Balance",
    titleHi: "शाखेची जीएल शिल्लक सुधारित करा",
    subtitleEn: "Review and update the opening and current GL balance for a branch ledger.",
    subtitleHi: "शाखेच्या जीएल खात्याची प्रारंभिक व सद्य शिल्लक तपासा आणि अद्ययावत करा.",
    sections: [
      {
        columns: 2,
        fields: [
          { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", type: "picker", picker: "branch" },
          { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", type: "readonly" },
          { key: "glAccountCode", labelEn: "GL Account Code", labelHi: "जीएल खाते कोड", type: "picker", picker: "gl" },
          { key: "description", labelEn: "Description", labelHi: "वर्णन", type: "readonly" },
          { key: "assignedBy", labelEn: "Assigned By", labelHi: "नियुक्त केलेले", type: "text" },
          { key: "reasonOfModification", labelEn: "Reason of Modification", labelHi: "बदलाचे कारण", type: "text" },
          { key: "openingBalance", labelEn: "Opening Balance", labelHi: "प्रारंभिक शिल्लक", type: "amount" },
          { key: "currentBalance", labelEn: "Current Balance", labelHi: "सद्य शिल्लक", type: "amount" },
        ],
      },
    ],
    pickers: { branch: PICKER_BRANCH, gl: PICKER_GL_ACCOUNT },
  },

  modifyBranchGlHistory: {
    titleEn: "Modify Branch GL History",
    titleHi: "शाखेच्या जीएल इतिहासामध्ये बदल करा",
    subtitleEn: "Review and modify the branch GL transaction history entries.",
    subtitleHi: "शाखेच्या जीएल व्यवहार इतिहासातील नोंदी तपासा आणि बदल करा.",
    sections: [
      {
        columns: 3,
        fields: [
          { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", type: "picker", picker: "branch" },
          { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", type: "readonly" },
          { key: "tnxDate", labelEn: "TXN Date", labelHi: "व्यवहार तारीख", type: "date" },
          { key: "assignedBy", labelEn: "Assigned By", labelHi: "नियुक्त केलेले", type: "text" },
          { key: "glAccountCode", labelEn: "GL Account Code", labelHi: "जीएल खाते कोड", type: "picker", picker: "gl" },
          { key: "description", labelEn: "Description", labelHi: "वर्णन", type: "readonly" },
          { key: "reasonOfModification", labelEn: "Reason of Modification", labelHi: "बदलाचे कारण", type: "text" },
          { key: "openingBalance", labelEn: "Opening Balance", labelHi: "प्रारंभिक शिल्लक", type: "amount" },
          { key: "debitCash", labelEn: "Debit Cash", labelHi: "नावे रोख", type: "amount" },
          { key: "creditCash", labelEn: "Credit Cash", labelHi: "जमा रोख", type: "amount" },
          { key: "debitTransfer", labelEn: "Debit Transfer", labelHi: "नावे हस्तांतरण", type: "amount" },
          { key: "creditTransfer", labelEn: "Credit Transfer", labelHi: "जमा हस्तांतरण", type: "amount" },
          { key: "debitClearing", labelEn: "Debit Clearing", labelHi: "नावे क्लिअरिंग", type: "amount" },
          { key: "creditClearing", labelEn: "Credit Clearing", labelHi: "जमा क्लिअरिंग", type: "amount" },
          { key: "debitCashVouchers", labelEn: "Debit Cash Vouchers", labelHi: "नावे रोख व्हाउचर", type: "amount" },
          { key: "creditCashVouchers", labelEn: "Credit Cash Vouchers", labelHi: "जमा रोख व्हाउचर", type: "amount" },
          { key: "debitTransferVouchers", labelEn: "Debit Transfer Vouchers", labelHi: "नावे हस्तांतरण व्हाउचर", type: "amount" },
          { key: "creditTransferVouchers", labelEn: "Credit Transfer Vouchers", labelHi: "जमा हस्तांतरण व्हाउचर", type: "amount" },
          { key: "debitClVouchers", labelEn: "Debit CL Vouchers", labelHi: "नावे सीएल व्हाउचर", type: "amount" },
          { key: "creditClVouchers", labelEn: "Credit CL Vouchers", labelHi: "जमा सीएल व्हाउचर", type: "amount" },
        ],
      },
    ],
    pickers: { branch: PICKER_BRANCH, gl: PICKER_GL_ACCOUNT },
  },

  modifyCashhandlingRecord: {
    titleEn: "Modify Cashhandling Record",
    titleHi: "रोख व्यवहार नोंदीमध्ये बदल करा",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    sections: [
      {
        titleEn: "Cash Handling Information",
        titleHi: "रोख व्यवहार माहिती",
        subtitleEn: "Select the branch and transaction details before recording cash denominations.",
        subtitleHi: "रोख मूल्यवर्ग नोंदवण्यापूर्वी शाखा आणि व्यवहार तपशील निवडा.",
        columns: 4,
        fields: [
          { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", type: "picker", picker: "branch" },
          { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", type: "readonly" },
          { key: "asOnDate", labelEn: "As On Date", labelHi: "दिनांकानुसार", type: "date" },
          { key: "scrollNumber", labelEn: "Scroll Number", labelHi: "स्क्रोल क्रमांक", type: "picker", picker: "scroll" },
        ],
      },
      {
        titleEn: "Cash Denomination Summary",
        titleHi: "रोख मूल्यवर्ग सारांश",
        subtitleEn: "Enter the denomination-wise cash count and verify the total cash amount.",
        subtitleHi: "मूल्यवर्गानुसार रोख मोजणी नोंदवा व एकूण रोख रक्कम पडताळून पहा.",
        columns: 4,
        fields: [
          { key: "cashHandlingNumber", labelEn: "Cash Handling Number", labelHi: "रोख हाताळणी क्रमांक", type: "readonly" },
          { key: "amount", labelEn: "Amount", labelHi: "रक्कम", type: "amount" },
          { key: "returnAmount", labelEn: "Return Amount", labelHi: "परतावा रक्कम", type: "amount" },
          { key: "receipt2000", labelEn: "Receipt 2000", labelHi: "पावती २०००", type: "amount" },
          { key: "payment2000", labelEn: "Payment 2000", labelHi: "देयक २०००", type: "amount" },
          { key: "receipt500", labelEn: "Receipt 500", labelHi: "पावती ५००", type: "amount" },
          { key: "payment500", labelEn: "Payment 500", labelHi: "देयक ५००", type: "amount" },
          { key: "receipt200", labelEn: "Receipt 200", labelHi: "पावती २००", type: "amount" },
          { key: "payment200", labelEn: "Payment 200", labelHi: "देयक २००", type: "amount" },
          { key: "receipt100", labelEn: "Receipt 100", labelHi: "पावती १००", type: "amount" },
          { key: "payment100", labelEn: "Payment 100", labelHi: "देयक १००", type: "amount" },
          { key: "receipt50", labelEn: "Receipt 50", labelHi: "पावती ५०", type: "amount" },
          { key: "payment50", labelEn: "Payment 50", labelHi: "देयक ५०", type: "amount" },
          { key: "receipt20", labelEn: "Receipt 20", labelHi: "पावती २०", type: "amount" },
          { key: "payment20", labelEn: "Payment 20", labelHi: "देयक २०", type: "amount" },
          { key: "receipt10", labelEn: "Receipt 10", labelHi: "पावती १०", type: "amount" },
          { key: "receiptChange", labelEn: "Receipt Change", labelHi: "पावती सुट्टे", type: "amount" },
          { key: "paymentChange", labelEn: "Payment Change", labelHi: "देयक सुट्टे", type: "amount" },
        ],
      },
    ],
    pickers: { branch: PICKER_BRANCH, scroll: PICKER_SCROLL },
  },

  modifyDenominationScroll: {
    titleEn: "Modify Denomination Scroll",
    titleHi: "मूल्य बदलण्याची स्क्रोल",
    subtitleEn: "View the parameter information and associated details.",
    subtitleHi: "पॅरामीटरची माहिती आणि संबंधित तपशील पहा.",
    sections: [
      {
        columns: 2,
        fields: [
          { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", type: "picker", picker: "branch" },
          { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", type: "readonly" },
          { key: "scrollNumber", labelEn: "Scroll Number", labelHi: "स्क्रोल क्रमांक", type: "picker", picker: "scroll" },
          { key: "asOnDate", labelEn: "As On Date", labelHi: "दिनांकानुसार", type: "select", options: AS_ON_DATE_OPTIONS },
        ],
      },
    ],
    pickers: { branch: PICKER_BRANCH, scroll: PICKER_SCROLL },
  },
};

export const getFormSectionsConfig = (masterKey) => FORM_SECTIONS_CONFIG[masterKey];

