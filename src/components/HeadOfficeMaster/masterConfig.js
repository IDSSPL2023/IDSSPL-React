import { IdCard, IndianRupee, User, Layers } from "lucide-react";

export const MASTERS = [
  { icon: "Wallet", titleEn: "Account Minimum Balance", titleHi: "खात्यातील किमान शिल्लक", key: "accountMinBal" },
  { icon: "UserCircle", titleEn: "Account Type", titleHi: "खात्याचा प्रकार", key: "accountType" },
  { icon: "ShieldCheck", titleEn: "Activity Code Master", titleHi: "क्रियाकलाप कोड मास्टर", key: "activityCode" },
  { icon: "GitBranch", titleEn: "Branch Master", titleHi: "शाखा मास्टर", key: "branch" },
  { icon: "SlidersHorizontal", titleEn: "Branch Parameter Master", titleHi: "शाखा पॅरामीटर मास्टर", key: "branchParameter" },
  { icon: "CreditCard", titleEn: "Cheque Type", titleHi: "चेक प्रकार", key: "chequeType" },
  { icon: "ShieldAlert", titleEn: "Classification Code Master", titleHi: "वर्गीकरण कोड मास्टर", key: "classificationCode" },
  { icon: "Keyboard", titleEn: "Clearing Type", titleHi: "क्लीयरिंग प्रकार", key: "clearingType" },
  { icon: "Package", titleEn: "Product Master Maintenance", titleHi: "उत्पादन मास्टर मेंटेनन्स", key: "productMaster" },
  { icon: "Share2", titleEn: "Default Branch Accounts", titleHi: "डीफॉल्ट शाखा खाती", key: "defaultBranchAccounts" },
  { icon: "FileText", titleEn: "TD Interest Rate Master", titleHi: "मुदत ठेव (TD) व्याजदर मास्टर", key: "tdInterestRate" },
  { icon: "Coins", titleEn: "Product Parameter Deposit", titleHi: "उत्पादन पॅरामीटर ठेव", key: "productParameterDeposit" },
  { icon: "IndianRupee", titleEn: "Deposit Rule Code", titleHi: "ठेव नियम कोड", key: "depositRule" },
  { icon: "Users", titleEn: "Final Account Group Code", titleHi: "अंतिम खाते गट कोड", key: "finalAccountGroup" },
  { icon: "BookUser", titleEn: "GL Account Master", titleHi: "जीएल खाते मास्टर", key: "glAccount" },
  { icon: "Globe2", titleEn: "Global Account Parameters", titleHi: "जागतिक खाते पॅरामीटर्स", key: "globalAccountParameters" },
  { icon: "Landmark", titleEn: "Industry Master", titleHi: "उद्योग मास्टर", key: "industry" },
  { icon: "Settings", titleEn: "Installment Type", titleHi: "हप्ता प्रकार", key: "installmentType" },
  { icon: "Box", titleEn: "Instrument Type", titleHi: "साधन प्रकार", key: "instrumentType" },
  { icon: "FileEdit", titleEn: "Loan Rule Code", titleHi: "कर्ज नियम कोड", key: "loanRule" },
  { icon: "Lock", titleEn: "Locker Type Master", titleHi: "लॉकर प्रकार मास्टर", key: "lockerType" },
  { icon: "BadgeCheck", titleEn: "MIS Code Master", titleHi: "एमआयएस कोड मास्टर", key: "misCode" },
  { icon: "RefreshCcw", titleEn: "Mode Of Sanction Master", titleHi: "मंजुरीचा प्रकार मास्टर", key: "modeOfSanction" },
  { icon: "MessageSquare", titleEn: "News Strip", titleHi: "बातमी पट्टी", key: "newsStrip" },
  { icon: "ScanLine", titleEn: "Parameter PG", titleHi: "पॅरामीटर PG", key: "parameterPg" },
  { icon: "Users2", titleEn: "Product To Account Fixed Asset", titleHi: "उत्पादन ते खाते स्थावर मालमत्ता", key: "productToAccountFixedAsset" },
  { icon: "UserSquare2", titleEn: "Product To Account", titleHi: "उत्पादन ते खाते", key: "productToAccount" },
  { icon: "Layers", titleEn: "Program", titleHi: "कार्यक्रम", key: "program" },
  { icon: "CircleUserRound", titleEn: "Purpose Code Master", titleHi: "उद्देश कोड मास्टर", key: "purposeCode" },
  { icon: "Diamond", titleEn: "RD PG Penal Int Rates", titleHi: "आरडी PG दंड व्याजदर", key: "rdPgPenalIntRates" },
  { icon: "ArchiveX", titleEn: "Rejection Type", titleHi: "नकार प्रकार", key: "rejectionType" },
  { icon: "UserCog", titleEn: "Sanction Authority Master", titleHi: "मंजुरी प्राधिकरण मास्टर", key: "sanctionAuthority" },
  { icon: "Banknote", titleEn: "SB CA Interest Rates", titleHi: "SB CA व्याजदर", key: "sbCaInterestRates" },
  { icon: "Receipt", titleEn: "Service Charges", titleHi: "सेवा शुल्क", key: "serviceCharges" },
  { icon: "UserPen", titleEn: "Standard Nonstand AC Updation", titleHi: "मानक नॉनस्टँड AC अद्यतन", key: "standardNonstandAc" },
  { icon: "ImageIcon", titleEn: "TD Payable File", titleHi: "TD देय फाइल", key: "tdPayableFile" },
  { icon: "FileSignature", titleEn: "TL/CC Payable File", titleHi: "TL/CC देय फाइल", key: "tlCcPayableFile" },
  { icon: "Clock", titleEn: "Product Parameter Loan", titleHi: "उत्पादन पॅरामीटर कर्ज", key: "productParameterLoan" },
  { icon: "FileText", titleEn: "Arbitration Details Master", titleHi: "लवाद तपशील मास्टर", key: "arbitrationDetails" },
];

const FIELD_ICONS = {
  id: IdCard,
  rupee: IndianRupee,
  user: User,
  layers: Layers,
};

const accountMinBalRows = Array.from({ length: 13 }, (_, i) => {
  const v = i * 100;
  return {
    id: String(i),
    minBalanceId: String(v),
    minBalance: String(v),
    minBalanceCheque: String(v),
    minBalanceAtm: String(v),
  };
});

const accountTypeRows = [
  { id: "1", accountId: "SB", accountName: "SAVING DEPOSIT", createdDate: "05 DEC 2023, 11:03 AM", loanDeposit: "General" },
  { id: "2", accountId: "CA", accountName: "CURRENT ACCOUNT", createdDate: "05 DEC 2023, 11:05 AM", loanDeposit: "General" },
  { id: "3", accountId: "RD", accountName: "RECURRING DEPOSIT", createdDate: "06 DEC 2023, 09:15 AM", loanDeposit: "General" },
  { id: "4", accountId: "FD", accountName: "FIXED DEPOSIT", createdDate: "06 DEC 2023, 10:22 AM", loanDeposit: "General" },
  { id: "5", accountId: "CC", accountName: "CASH CREDIT", createdDate: "07 DEC 2023, 08:45 AM", loanDeposit: "General" },
  { id: "6", accountId: "OD", accountName: "OVER DRAFT", createdDate: "07 DEC 2023, 02:30 PM", loanDeposit: "General" },
  { id: "7", accountId: "GL", accountName: "GENERAL LEDGER", createdDate: "08 DEC 2023, 11:00 AM", loanDeposit: "General" },
  { id: "8", accountId: "PG", accountName: "PIGMY DEPOSIT", createdDate: "08 DEC 2023, 03:15 PM", loanDeposit: "General" },
  { id: "9", accountId: "TL", accountName: "TERM LOAN", createdDate: "09 DEC 2023, 09:00 AM", loanDeposit: "General" },
];

export const MASTER_CONFIG = {
  accountMinBal: {
    columns: [
      { key: "minBalanceId", label: "Minimum Balance ID" },
      { key: "minBalance", label: "Minimum Balance" },
      { key: "minBalanceCheque", label: "Minimum Balance With Cheque" },
      { key: "minBalanceAtm", label: "Minimum Balance With ATM" },
    ],
    rows: accountMinBalRows,
    fields: [
      { key: "minBalanceId", labelEn: "Minimum Balance ID", labelHi: "किमान शिल्लक आयडी", placeholder: "Enter Minimum Balance ID", icon: "id", readOnlyOnEdit: true },
      { key: "minBalance", labelEn: "Minimum Balance", labelHi: "किमान शिल्लक", placeholder: "Enter Minimum Balance", icon: "rupee" },
      { key: "minBalanceCheque", labelEn: "Minimum Balance With Cheque", labelHi: "धनादेश सुविधेसह किमान शिल्लक", placeholder: "Enter Minimum Balance With Cheque", icon: "rupee" },
      { key: "minBalanceAtm", labelEn: "Minimum Balance With ATM", labelHi: "एटीएम सुविधेसह किमान शिल्लक", placeholder: "Enter Minimum Balance With ATM", icon: "rupee" },
    ],
    filterFields: [
      { key: "minBalanceId", label: "Minimum Balance ID" },
      { key: "minBalance", label: "Minimum Balance" },
    ],
  },
  accountType: {
    columns: [
      { key: "accountId", label: "Account ID" },
      { key: "accountName", label: "Account Name" },
      { key: "createdDate", label: "Created Date" },
      { key: "loanDeposit", label: "Loan Deposit" },
    ],
    rows: accountTypeRows,
    fields: [
      { key: "accountId", labelEn: "Account Type ID", labelHi: "खात्याचा प्रकार आयडी", placeholder: "Enter Account Type ID", icon: "id", readOnlyOnEdit: true },
      { key: "accountName", labelEn: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: "user" },
      { key: "loanDeposit", labelEn: "Loan Deposit", labelHi: "कर्ज ठेव", placeholder: "Enter Loan Deposit", icon: "layers" },
    ],
    filterFields: [
      { key: "accountId", label: "Account ID" },
      { key: "accountName", label: "Account Name" },
      { key: "loanDeposit", label: "Loan Deposit" },
    ],
  },
};

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
