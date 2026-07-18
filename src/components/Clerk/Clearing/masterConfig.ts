// Config-driven definitions for the Clerk > Clearing masters. Adding a 4th
// module later only means adding an entry to MASTERS below — ClearingFormModal
// and HeroClearing render purely off this config, same approach as
// SupportUtility's FormSectionsModal + masterConfig.

export type ClearingFieldType = "text" | "date" | "amount" | "readonly" | "picker";
export type ClearingPickerKey =
  | "bank"
  | "branch"
  | "clearingType"
  | "schedule"
  | "customer"
  | "account"
  | "instrumentType"
  | "glOutlet"
  | "rejectionType";

export interface ClearingField {
  key: string;
  labelKey: string;
  type: ClearingFieldType;
  picker?: ClearingPickerKey;
}

export interface ClearingSection {
  titleKey: string;
  subtitleKey?: string;
  columns: 2 | 3 | 4;
  fields: ClearingField[];
}

export interface ClearingMaster {
  key: string;
  icon: string;
  cardTitleKey: string;
  cardDescriptionKey: string;
  modalTitleKey: string;
  modalSubtitleKey: string;
  successTitleKey: string;
  sections: ClearingSection[];
  primaryActionLabelKey: string;
}

interface CodeNameRow {
  code: string;
  name: string;
}

export interface ClearingPickerConfig {
  titleKey: string;
  columnKeys: { key: keyof CodeNameRow; labelKey: string }[];
  rows: CodeNameRow[];
}

const BANK_ROWS: CodeNameRow[] = [
  { code: "00021010000008", name: "Swami Vivekanand Urban Co-op Bank" },
  { code: "00022010000001", name: "Sahyadri Urban Co-op Bank" },
  { code: "00025050007604", name: "Janata Sahakari Bank" },
];

const BRANCH_ROWS: CodeNameRow[] = [
  { code: "010", name: "Main Branch" },
  { code: "011", name: "City Branch" },
  { code: "012", name: "Market Branch" },
];

const CLEARING_TYPE_ROWS: CodeNameRow[] = [
  { code: "0001", name: "Local Clearing" },
  { code: "0002", name: "Outstation Clearing" },
  { code: "0003", name: "High Value Clearing" },
];

const SCHEDULE_ROWS: CodeNameRow[] = [
  { code: "SCH001", name: "Morning Schedule" },
  { code: "SCH002", name: "Afternoon Schedule" },
  { code: "SCH003", name: "Return Schedule" },
];

const CUSTOMER_ROWS: CodeNameRow[] = [
  { code: "C0001", name: "Ramesh Patil" },
  { code: "C0002", name: "Suresh Kulkarni" },
  { code: "C0003", name: "Anita Deshmukh" },
];

const ACCOUNT_ROWS: CodeNameRow[] = [
  { code: "00022010000001", name: "Ramesh Patil" },
  { code: "00025050007604", name: "Suresh Kulkarni" },
  { code: "00000000400120", name: "Anita Deshmukh" },
];

const INSTRUMENT_TYPE_ROWS: CodeNameRow[] = [
  { code: "CHQ", name: "Cheque" },
  { code: "DD", name: "Demand Draft" },
  { code: "PO", name: "Pay Order" },
];

const GL_OUTLET_ROWS: CodeNameRow[] = [
  { code: "GL1001", name: "Outward Clearing Suspense" },
  { code: "GL1002", name: "Inward Clearing Suspense" },
  { code: "GL1003", name: "Sundry Creditors" },
];

const REJECTION_TYPE_ROWS: CodeNameRow[] = [
  { code: "01", name: "Insufficient Funds" },
  { code: "02", name: "Signature Mismatch" },
  { code: "03", name: "Payment Stopped" },
];

export const CLEARING_PICKERS: Record<ClearingPickerKey, ClearingPickerConfig> = {
  bank: {
    titleKey: "clearing.fields.bankCode",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.bankCode" },
      { key: "name", labelKey: "clearing.fields.bankName" },
    ],
    rows: BANK_ROWS,
  },
  branch: {
    titleKey: "clearing.fields.branchCode",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.branchCode" },
      { key: "name", labelKey: "clearing.fields.branchName" },
    ],
    rows: BRANCH_ROWS,
  },
  clearingType: {
    titleKey: "clearing.fields.clearingTypeId",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.clearingTypeId" },
      { key: "name", labelKey: "clearing.fields.clearingTypeName" },
    ],
    rows: CLEARING_TYPE_ROWS,
  },
  schedule: {
    titleKey: "clearing.fields.scheduleNumber",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.scheduleNumber" },
      { key: "name", labelKey: "clearing.fields.clearingTypeName" },
    ],
    rows: SCHEDULE_ROWS,
  },
  customer: {
    titleKey: "clearing.fields.customerId",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.customerId" },
      { key: "name", labelKey: "clearing.fields.customerName" },
    ],
    rows: CUSTOMER_ROWS,
  },
  account: {
    titleKey: "clearing.fields.accountCode",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.accountCode" },
      { key: "name", labelKey: "clearing.fields.accountName" },
    ],
    rows: ACCOUNT_ROWS,
  },
  instrumentType: {
    titleKey: "clearing.fields.instrumentType",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.instrumentType" },
      { key: "name", labelKey: "clearing.fields.accountName" },
    ],
    rows: INSTRUMENT_TYPE_ROWS,
  },
  glOutlet: {
    titleKey: "clearing.fields.glOutletDescription",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.glOutlistDocNo" },
      { key: "name", labelKey: "clearing.fields.glOutletDescription" },
    ],
    rows: GL_OUTLET_ROWS,
  },
  rejectionType: {
    titleKey: "clearing.fields.rejectionTypeId",
    columnKeys: [
      { key: "code", labelKey: "clearing.fields.rejectionTypeId" },
      { key: "name", labelKey: "clearing.fields.rejectionDescription" },
    ],
    rows: REJECTION_TYPE_ROWS,
  },
};

const branchInformationSection: ClearingSection = {
  titleKey: "clearing.sections.branchInformation.title",
  subtitleKey: "clearing.sections.branchInformation.subtitle",
  columns: 4,
  fields: [
    { key: "bankCode", labelKey: "clearing.fields.bankCode", type: "picker", picker: "bank" },
    { key: "bankName", labelKey: "clearing.fields.bankName", type: "readonly" },
    { key: "branchCode", labelKey: "clearing.fields.branchCode", type: "picker", picker: "branch" },
    { key: "branchName", labelKey: "clearing.fields.branchName", type: "readonly" },
  ],
};

const clearingDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.clearingDetails.title",
  subtitleKey: "clearing.sections.clearingDetails.subtitle",
  columns: 4,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyOutwardScheduleNo", labelKey: "clearing.fields.dailyOutwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "clearingSerialNumber", labelKey: "clearing.fields.clearingSerialNumber", type: "text" },
  ],
};

const customerAccountDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.customerAccountDetails.title",
  subtitleKey: "clearing.sections.customerAccountDetails.subtitle",
  columns: 4,
  fields: [
    { key: "customerId", labelKey: "clearing.fields.customerId", type: "picker", picker: "customer" },
    { key: "customerName", labelKey: "clearing.fields.customerName", type: "readonly" },
    { key: "accountCode", labelKey: "clearing.fields.accountCode", type: "picker", picker: "account" },
    { key: "accountName", labelKey: "clearing.fields.accountName", type: "readonly" },
    { key: "payeeName", labelKey: "clearing.fields.payeeName", type: "text" },
    { key: "drawerName", labelKey: "clearing.fields.drawerName", type: "text" },
    { key: "draweeBankCode", labelKey: "clearing.fields.bankCode", type: "picker", picker: "bank" },
    { key: "draweeBankName", labelKey: "clearing.fields.bankName", type: "readonly" },
    { key: "draweeBranchCode", labelKey: "clearing.fields.branchCode", type: "picker", picker: "branch" },
    { key: "draweeBranchName", labelKey: "clearing.fields.branchName", type: "readonly" },
  ],
};

const instrumentDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.instrumentDetails.title",
  subtitleKey: "clearing.sections.instrumentDetails.subtitle",
  columns: 4,
  fields: [
    { key: "instrumentType", labelKey: "clearing.fields.instrumentType", type: "picker", picker: "instrumentType" },
    { key: "instrumentNumber", labelKey: "clearing.fields.instrumentNumber", type: "text" },
    { key: "instrumentDate", labelKey: "clearing.fields.instrumentDate", type: "date" },
    { key: "instrumentAmount", labelKey: "clearing.fields.instrumentAmount", type: "amount" },
    { key: "outletSerialNo", labelKey: "clearing.fields.outletSerialNo", type: "text" },
    { key: "glOutletDescription", labelKey: "clearing.fields.glOutletDescription", type: "picker", picker: "glOutlet" },
    { key: "glOutlistDocNo", labelKey: "clearing.fields.glOutlistDocNo", type: "text" },
  ],
};

const returnDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.returnDetails.title",
  subtitleKey: "clearing.sections.returnDetails.subtitle",
  columns: 4,
  fields: [
    { key: "rejectionTypeId", labelKey: "clearing.fields.rejectionTypeId", type: "picker", picker: "rejectionType" },
    { key: "rejectionDescription", labelKey: "clearing.fields.rejectionDescription", type: "readonly" },
    { key: "chequeReturnCharges", labelKey: "clearing.fields.chequeReturnCharges", type: "amount" },
    { key: "serviceTax", labelKey: "clearing.fields.serviceTax", type: "amount" },
    { key: "returnScrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "adviceNumber", labelKey: "clearing.fields.adviceNumber", type: "text" },
    { key: "adviceDate", labelKey: "clearing.fields.adviceDate", type: "date" },
    { key: "originalResponding", labelKey: "clearing.fields.originalResponding", type: "text" },
  ],
};

const subBranchInwardDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 2,
  fields: [
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyInwardScheduleNo", labelKey: "clearing.fields.dailyInwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "accountCode", labelKey: "clearing.fields.accountCode", type: "picker", picker: "account" },
    { key: "accountName", labelKey: "clearing.fields.accountName", type: "readonly" },
    { key: "adviceNumber", labelKey: "clearing.fields.adviceNumber", type: "text" },
    { key: "amount", labelKey: "clearing.fields.amount", type: "amount" },
  ],
};

const postingMarkDetailsSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 4,
  fields: [
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "scheduleNumber", labelKey: "clearing.fields.scheduleNumber", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "adviceNumber", labelKey: "clearing.fields.adviceNumber", type: "text" },
    { key: "adviceDate", labelKey: "clearing.fields.adviceDate", type: "date" },
    { key: "originalResponding", labelKey: "clearing.fields.originalResponding", type: "text" },
    { key: "numberOfInstruments", labelKey: "clearing.fields.numberOfInstruments", type: "text" },
    { key: "totalAmount", labelKey: "clearing.fields.totalAmount", type: "amount" },
    { key: "bounceNoOfInstruments", labelKey: "clearing.fields.bounceNoOfInstruments", type: "text" },
    { key: "bounceTotalAmount", labelKey: "clearing.fields.totalAmount", type: "amount" },
  ],
};

const tallySection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 4,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "numberOfInstruments", labelKey: "clearing.fields.numberOfInstruments", type: "text" },
    { key: "totalAmount", labelKey: "clearing.fields.totalAmount", type: "amount" },
  ],
};

const closingSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 2,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "closingRemark", labelKey: "clearing.fields.closingRemark", type: "text" },
  ],
};

const generateInwardScheduleSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 2,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyInwardScheduleNo", labelKey: "clearing.fields.dailyInwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
  ],
};

const generateOutwardScheduleSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 2,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyOutwardScheduleNo", labelKey: "clearing.fields.dailyOutwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
  ],
};

const importOutwardScheduleDetailSection: ClearingSection = {
  titleKey: "clearing.sections.details.title",
  subtitleKey: "clearing.sections.details.subtitle",
  columns: 2,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyOutwardScheduleNo", labelKey: "clearing.fields.dailyOutwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "fileName", labelKey: "clearing.fields.fileName", type: "text" },
  ],
};

const inwardEntryScheduleSection: ClearingSection = {
  titleKey: "clearing.sections.clearingDetails.title",
  subtitleKey: "clearing.sections.clearingDetails.subtitle",
  columns: 4,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyInwardScheduleNo", labelKey: "clearing.fields.dailyInwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
  ],
};

const outwardEntryScheduleSection: ClearingSection = {
  titleKey: "clearing.sections.clearingDetails.title",
  subtitleKey: "clearing.sections.clearingDetails.subtitle",
  columns: 4,
  fields: [
    { key: "date", labelKey: "clearing.fields.date", type: "date" },
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "dailyOutwardScheduleNo", labelKey: "clearing.fields.dailyOutwardScheduleNo", type: "picker", picker: "schedule" },
    { key: "scheduleDate", labelKey: "clearing.fields.scheduleDate", type: "date" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
  ],
};

const bounceMarkSection: ClearingSection = {
  titleKey: "clearing.sections.returnDetails.title",
  subtitleKey: "clearing.sections.returnDetails.subtitle",
  columns: 4,
  fields: [
    { key: "clearingTypeId", labelKey: "clearing.fields.clearingTypeId", type: "picker", picker: "clearingType" },
    { key: "clearingTypeName", labelKey: "clearing.fields.clearingTypeName", type: "readonly" },
    { key: "scrollNumber", labelKey: "clearing.fields.scrollNumber", type: "text" },
    { key: "adviceNumber", labelKey: "clearing.fields.adviceNumber", type: "text" },
    { key: "adviceDate", labelKey: "clearing.fields.adviceDate", type: "date" },
    { key: "rejectionTypeId", labelKey: "clearing.fields.rejectionTypeId", type: "picker", picker: "rejectionType" },
    { key: "rejectionDescription", labelKey: "clearing.fields.rejectionDescription", type: "readonly" },
    { key: "chequeReturnCharges", labelKey: "clearing.fields.chequeReturnCharges", type: "amount" },
  ],
};

export const CLEARING_MASTERS: ClearingMaster[] = [
  {
    key: "owClearingLateReturn",
    icon: "ScrollText",
    cardTitleKey: "clearing.masters.owClearingLateReturn.cardTitle",
    cardDescriptionKey: "clearing.masters.owClearingLateReturn.cardDescription",
    modalTitleKey: "clearing.masters.owClearingLateReturn.modalTitle",
    modalSubtitleKey: "clearing.masters.owClearingLateReturn.modalSubtitle",
    successTitleKey: "clearing.masters.owClearingLateReturn.successTitle",
    sections: [
      branchInformationSection,
      clearingDetailsSection,
      customerAccountDetailsSection,
      instrumentDetailsSection,
      returnDetailsSection,
    ],
    primaryActionLabelKey: "common.modify",
  },
  {
    key: "subBranchInwardReturn",
    icon: "ArrowLeftRight",
    cardTitleKey: "clearing.masters.subBranchInwardReturn.cardTitle",
    cardDescriptionKey: "clearing.masters.subBranchInwardReturn.cardDescription",
    modalTitleKey: "clearing.masters.subBranchInwardReturn.modalTitle",
    modalSubtitleKey: "clearing.masters.subBranchInwardReturn.modalSubtitle",
    successTitleKey: "clearing.masters.subBranchInwardReturn.successTitle",
    sections: [subBranchInwardDetailsSection],
    primaryActionLabelKey: "common.save",
  },
  {
    key: "owClearingPostingMark",
    icon: "Banknote",
    cardTitleKey: "clearing.masters.owClearingPostingMark.cardTitle",
    cardDescriptionKey: "clearing.masters.owClearingPostingMark.cardDescription",
    modalTitleKey: "clearing.masters.owClearingPostingMark.modalTitle",
    modalSubtitleKey: "clearing.masters.owClearingPostingMark.modalSubtitle",
    successTitleKey: "clearing.masters.owClearingPostingMark.successTitle",
    sections: [postingMarkDetailsSection],
    primaryActionLabelKey: "clearing.actions.postToAccount",
  },
  {
    key: "clearingTallyWithClearingHouse",
    icon: "ClipboardList",
    cardTitleKey: "clearing.masters.clearingTallyWithClearingHouse.cardTitle",
    cardDescriptionKey: "clearing.masters.clearingTallyWithClearingHouse.cardDescription",
    modalTitleKey: "clearing.masters.clearingTallyWithClearingHouse.modalTitle",
    modalSubtitleKey: "clearing.masters.clearingTallyWithClearingHouse.modalSubtitle",
    successTitleKey: "clearing.masters.clearingTallyWithClearingHouse.successTitle",
    sections: [tallySection],
    primaryActionLabelKey: "clearing.actions.tally",
  },
  {
    key: "firstSecondClearingClosing",
    icon: "CalendarCheck",
    cardTitleKey: "clearing.masters.firstSecondClearingClosing.cardTitle",
    cardDescriptionKey: "clearing.masters.firstSecondClearingClosing.cardDescription",
    modalTitleKey: "clearing.masters.firstSecondClearingClosing.modalTitle",
    modalSubtitleKey: "clearing.masters.firstSecondClearingClosing.modalSubtitle",
    successTitleKey: "clearing.masters.firstSecondClearingClosing.successTitle",
    sections: [closingSection],
    primaryActionLabelKey: "clearing.actions.close",
  },
  {
    key: "generateInwardSchedule",
    icon: "ArrowDownToLine",
    cardTitleKey: "clearing.masters.generateInwardSchedule.cardTitle",
    cardDescriptionKey: "clearing.masters.generateInwardSchedule.cardDescription",
    modalTitleKey: "clearing.masters.generateInwardSchedule.modalTitle",
    modalSubtitleKey: "clearing.masters.generateInwardSchedule.modalSubtitle",
    successTitleKey: "clearing.masters.generateInwardSchedule.successTitle",
    sections: [generateInwardScheduleSection],
    primaryActionLabelKey: "clearing.actions.generate",
  },
  {
    key: "generateOutwardSchedule",
    icon: "ArrowUpFromLine",
    cardTitleKey: "clearing.masters.generateOutwardSchedule.cardTitle",
    cardDescriptionKey: "clearing.masters.generateOutwardSchedule.cardDescription",
    modalTitleKey: "clearing.masters.generateOutwardSchedule.modalTitle",
    modalSubtitleKey: "clearing.masters.generateOutwardSchedule.modalSubtitle",
    successTitleKey: "clearing.masters.generateOutwardSchedule.successTitle",
    sections: [generateOutwardScheduleSection],
    primaryActionLabelKey: "clearing.actions.generate",
  },
  {
    key: "importDailyOutwardScheduleDetail",
    icon: "FileInput",
    cardTitleKey: "clearing.masters.importDailyOutwardScheduleDetail.cardTitle",
    cardDescriptionKey: "clearing.masters.importDailyOutwardScheduleDetail.cardDescription",
    modalTitleKey: "clearing.masters.importDailyOutwardScheduleDetail.modalTitle",
    modalSubtitleKey: "clearing.masters.importDailyOutwardScheduleDetail.modalSubtitle",
    successTitleKey: "clearing.masters.importDailyOutwardScheduleDetail.successTitle",
    sections: [importOutwardScheduleDetailSection],
    primaryActionLabelKey: "clearing.actions.import",
  },
  {
    key: "inwardClearingEntry",
    icon: "Inbox",
    cardTitleKey: "clearing.masters.inwardClearingEntry.cardTitle",
    cardDescriptionKey: "clearing.masters.inwardClearingEntry.cardDescription",
    modalTitleKey: "clearing.masters.inwardClearingEntry.modalTitle",
    modalSubtitleKey: "clearing.masters.inwardClearingEntry.modalSubtitle",
    successTitleKey: "clearing.masters.inwardClearingEntry.successTitle",
    sections: [branchInformationSection, inwardEntryScheduleSection, instrumentDetailsSection],
    primaryActionLabelKey: "common.save",
  },
  {
    key: "owClearingBounceMark",
    icon: "AlertTriangle",
    cardTitleKey: "clearing.masters.owClearingBounceMark.cardTitle",
    cardDescriptionKey: "clearing.masters.owClearingBounceMark.cardDescription",
    modalTitleKey: "clearing.masters.owClearingBounceMark.modalTitle",
    modalSubtitleKey: "clearing.masters.owClearingBounceMark.modalSubtitle",
    successTitleKey: "clearing.masters.owClearingBounceMark.successTitle",
    sections: [bounceMarkSection],
    primaryActionLabelKey: "common.modify",
  },
  {
    key: "outwardClearingEntry",
    icon: "Send",
    cardTitleKey: "clearing.masters.outwardClearingEntry.cardTitle",
    cardDescriptionKey: "clearing.masters.outwardClearingEntry.cardDescription",
    modalTitleKey: "clearing.masters.outwardClearingEntry.modalTitle",
    modalSubtitleKey: "clearing.masters.outwardClearingEntry.modalSubtitle",
    successTitleKey: "clearing.masters.outwardClearingEntry.successTitle",
    sections: [branchInformationSection, outwardEntryScheduleSection, instrumentDetailsSection],
    primaryActionLabelKey: "common.save",
  },
];

export const getClearingMaster = (key: string): ClearingMaster | undefined =>
  CLEARING_MASTERS.find((m) => m.key === key);
