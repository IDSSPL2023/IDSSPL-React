const BASE_URL = import.meta.env.VITE_MASTER_MAINTENANCE_API_URL || "http://13.202.249.213:8080";

export interface ClearingTypeRecord {
  id: string;
  description: string;
  clearingHouseCode: string;
  payableRequired: string;
  payableHead: string;
  receivableRequired: string;
  receivableHead: string;
}

export interface ProductRecord {
  productCode: string;
  description: string;
  shortDescription: string;
  accountType: string;
  implemented: string;
  cashTransactionAllowed: string;
  defaultMinimumBalanceId: number;
  interestRoundingFactor: number;
  nomineeRequired: string;
  inwardClearingAllowed: string;
  panCardAllowed: string;
  individual: string;
}

export interface GlAccountOption {
  glAccountCode: string;
  description: string;
}

/** Shape returned by the Branch list browse — a subset of the full detail record. */
export interface BranchSummary {
  branchCode: string;
  name: string;
  cityCode: string;
  zip: string;
  emailId: string;
}

/** Shape returned by Get Branch By Code / sent to Update Branch. */
export interface BranchDetail {
  branchCode: string;
  name: string;
  nameShort: string;
  address1: string;
  address2: string;
  address3: string;
  cityCode: string;
  zip: string;
  ipAddress1: string;
  ipAddress2: string;
  emailId: string;
  phone1: string;
  phone2: string;
  phone3: string;
  phone4: string;
  regionCode: string | null;
  noOfficer: number | null;
  noClerk: number | null;
  noSubStaff: number | null;
  rtgsCode: string;
  lastChequeSrno: number;
  tanNo: string;
  isImplemented: string;
  createdDate: string;
  modifiedDate: string | null;
}

export interface BranchAccount {
  branchCode: string;
  inwardClearingAccountCode: string;
  outwardClearingAccountCode: string;
}

export interface BranchAccountValidation {
  branchCode: string;
  branchName: string;
  inwardClearingAccountCode: string;
  outwardClearingAccountCode: string;
  existingMapping: boolean;
  addModifyEnabled: boolean;
  message: string;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const list = record.content ?? record.data ?? record.results ?? record.items;
  return Array.isArray(list) ? list : [];
}

/** GET /default-branch-accounts — browse all branch clearing-account mappings. */
export async function fetchBranchAccount(): Promise<BranchAccount[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/default-branch-accounts`);
  if (!response.ok) throw new Error(`Failed to load Bank Accounts (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    branchCode: String(item.branchCode ?? ""),
    inwardClearingAccountCode: String(item.inwardClearingAccountCode ?? ""),
    outwardClearingAccountCode: String(item.outwardClearingAccountCode ?? ""),
  }));
}

/** POST /default-branch-accounts/branches/search — search branch accounts by branch code or name. */
export interface BranchAccountSearchParams {
  searchBy?: "BRANCH_CODE" | "NAME";
  textToSearch?: string;
}

export async function searchBranchAccounts(
  params: BranchAccountSearchParams = {}
): Promise<BranchAccount[]> {
  const { searchBy = "NAME", textToSearch = "" } = params;

  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/default-branch-accounts/branches/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to search branch accounts (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    branchCode: String(item.branchCode ?? ""),
    inwardClearingAccountCode: String(item.inwardClearingAccountCode ?? ""),
    outwardClearingAccountCode: String(item.outwardClearingAccountCode ?? ""),
  }));
}

/** POST /default-branch-accounts/validate — validate branch account entry. */
export async function validateBranchAccount(
  payload: {
    branchCode: string;
    inwardClearingAccountCode: string;
    outwardClearingAccountCode: string;
  }
): Promise<BranchAccountValidation> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/default-branch-accounts/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to validate branch account (${response.status})`);
  const data = (await parseJson(response)) as Record<string, unknown>;
  return {
    branchCode: String(data.branchCode ?? ""),
    branchName: String(data.branchName ?? ""),
    inwardClearingAccountCode: String(data.inwardClearingAccountCode ?? ""),
    outwardClearingAccountCode: String(data.outwardClearingAccountCode ?? ""),
    existingMapping: Boolean(data.existingMapping),
    addModifyEnabled: Boolean(data.addModifyEnabled),
    message: String(data.message ?? ""),
  };
}

/** POST /default-branch-accounts/save — save branch account entry. */
export async function saveBranchAccount(
  payload: {
    branchCode: string;
    inwardClearingAccountCode: string;
    outwardClearingAccountCode: string;
  }
): Promise<BranchAccount> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/default-branch-accounts/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to save branch account (${response.status})`);
  const data = (await parseJson(response)) as Record<string, unknown>;
  return {
    branchCode: String(data.branchCode ?? payload.branchCode),
    inwardClearingAccountCode: String(data.inwardClearingAccountCode ?? payload.inwardClearingAccountCode),
    outwardClearingAccountCode: String(data.outwardClearingAccountCode ?? payload.outwardClearingAccountCode),
  };
}

/** PUT /default-branch-accounts/{branchCode} — update branch account entry. */
export async function updateBranchAccount(
  branchCode: string,
  payload: {
    inwardClearingAccountCode: string;
    outwardClearingAccountCode: string;
  }
): Promise<BranchAccount> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/default-branch-accounts/${encodeURIComponent(branchCode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to update branch account (${response.status})`);
  const data = (await parseJson(response)) as Record<string, unknown>;
  return {
    branchCode: String(data.branchCode ?? branchCode),
    inwardClearingAccountCode: String(data.inwardClearingAccountCode ?? payload.inwardClearingAccountCode),
    outwardClearingAccountCode: String(data.outwardClearingAccountCode ?? payload.outwardClearingAccountCode),
  };
}

/** GET /clearing-types — browse all clearing types. */
export async function fetchClearingTypes(): Promise<ClearingTypeRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/clearing-types`);
  if (!response.ok) throw new Error(`Failed to load clearing types (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    id: String(item.id ?? ""),
    description: String(item.description ?? ""),
    clearingHouseCode: String(item.clearingHouseCode ?? ""),
    payableRequired: String(item.payableRequired ?? ""),
    payableHead: String(item.payableHead ?? ""),
    receivableRequired: String(item.receivableRequired ?? ""),
    receivableHead: String(item.receivableHead ?? ""),
  }));
}

/** POST /clearing-types — creates a new clearing type. */
export async function createClearingType(payload: {
  id: string;
  description: string;
  clearingHouseCode: string;
  payableRequired: string;
  payableHead: string;
  receivableRequired: string;
  receivableHead: string;
}): Promise<ClearingTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/clearing-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(payload.id) || payload.id,
      description: payload.description,
      clearingHouseCode: payload.clearingHouseCode,
      payableRequired: payload.payableRequired,
      payableHead: payload.payableHead,
      receivableRequired: payload.receivableRequired,
      receivableHead: payload.receivableHead,
    }),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create clearing type (${response.status})`));
  }
  return {
    id: String(data?.id ?? payload.id),
    description: String(data?.description ?? payload.description),
    clearingHouseCode: String(data?.clearingHouseCode ?? payload.clearingHouseCode),
    payableRequired: String(data?.payableRequired ?? payload.payableRequired),
    payableHead: String(data?.payableHead ?? payload.payableHead),
    receivableRequired: String(data?.receivableRequired ?? payload.receivableRequired),
    receivableHead: String(data?.receivableHead ?? payload.receivableHead),
  };
}

/** GET /clearing-types/{id} — full clearing type detail, used to populate View/Edit. */
export async function fetchClearingTypeById(id: string): Promise<ClearingTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/clearing-types/${encodeURIComponent(id)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load clearing type (${response.status})`));
  }
  return {
    id: String(data?.id ?? id),
    description: String(data?.description ?? ""),
    clearingHouseCode: String(data?.clearingHouseCode ?? ""),
    payableRequired: String(data?.payableRequired ?? ""),
    payableHead: String(data?.payableHead ?? ""),
    receivableRequired: String(data?.receivableRequired ?? ""),
    receivableHead: String(data?.receivableHead ?? ""),
  };
}

/** PUT /clearing-types/{id} — updates an existing clearing type. */
export async function updateClearingType(
  id: string,
  payload: {
    description: string;
    clearingHouseCode: string;
    payableRequired: string;
    payableHead: string;
    receivableRequired: string;
    receivableHead: string;
  }
): Promise<ClearingTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/clearing-types/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update clearing type (${response.status})`));
  }
  return {
    id,
    description: String(data?.description ?? payload.description),
    clearingHouseCode: String(data?.clearingHouseCode ?? payload.clearingHouseCode),
    payableRequired: String(data?.payableRequired ?? payload.payableRequired),
    payableHead: String(data?.payableHead ?? payload.payableHead),
    receivableRequired: String(data?.receivableRequired ?? payload.receivableRequired),
    receivableHead: String(data?.receivableHead ?? payload.receivableHead),
  };
}

/** GET /products — browse all products. */
export async function fetchProducts(): Promise<ProductRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/products`);
  if (!response.ok) throw new Error(`Failed to load products (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    productCode: String(item.productCode ?? ""),
    description: String(item.description ?? ""),
    shortDescription: String(item.shortDescription ?? ""),
    accountType: String(item.accountType ?? ""),
    implemented: String(item.implemented ?? ""),
    cashTransactionAllowed: String(item.cashTransactionAllowed ?? ""),
    defaultMinimumBalanceId: Number(item.defaultMinimumBalanceId ?? 0),
    interestRoundingFactor: Number(item.interestRoundingFactor ?? 0),
    nomineeRequired: String(item.nomineeRequired ?? ""),
    inwardClearingAllowed: String(item.inwardClearingAllowed ?? ""),
    panCardAllowed: String(item.panCardAllowed ?? ""),
    individual: String(item.individual ?? ""),
  }));
}

/** POST /gl-accounts/search — used to populate the GL Account Code picklist. */
export async function searchGlAccounts(params: { searchBy?: string; textToSearch?: string } = {}): Promise<GlAccountOption[]> {
  const { searchBy = "GL_ACCOUNT_CODE", textToSearch = "" } = params;
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to load GL accounts (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    glAccountCode: String(item.glAccountCode ?? item.code ?? ""),
    description: String(item.description ?? ""),
  }));
}

/**
 * POST /products — creates a product. Mirrors the legacy "Create New Product" screen:
 * the product fields are nested, and the GL account code used to seed the ledger rows
 * is passed alongside it.
 */
export async function createProduct(payload: {
  product: {
    productCode: string;
    description: string;
    shortDescription: string;
    accountType: string;
    implemented: string;
    cashTransactionAllowed: string;
    defaultMinimumBalanceId: number;
    interestRoundingFactor: number;
    nomineeRequired: string;
    inwardClearingAllowed: string;
    panCardAllowed: string;
    individual: string;
  };
  glAccountCode: string;
}): Promise<ProductRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create product (${response.status})`));
  }
  const body = ((data?.product as Record<string, unknown>) ?? data ?? {}) as Record<string, unknown>;
  return {
    productCode: String(body.productCode ?? payload.product.productCode),
    description: String(body.description ?? payload.product.description),
    shortDescription: String(body.shortDescription ?? payload.product.shortDescription),
    accountType: String(body.accountType ?? payload.product.accountType),
    implemented: String(body.implemented ?? payload.product.implemented),
    cashTransactionAllowed: String(body.cashTransactionAllowed ?? payload.product.cashTransactionAllowed),
    defaultMinimumBalanceId: Number(body.defaultMinimumBalanceId ?? payload.product.defaultMinimumBalanceId),
    interestRoundingFactor: Number(body.interestRoundingFactor ?? payload.product.interestRoundingFactor),
    nomineeRequired: String(body.nomineeRequired ?? payload.product.nomineeRequired),
    inwardClearingAllowed: String(body.inwardClearingAllowed ?? payload.product.inwardClearingAllowed),
    panCardAllowed: String(body.panCardAllowed ?? payload.product.panCardAllowed),
    individual: String(body.individual ?? payload.product.individual),
  };
}

export interface DepositInterestRateRecord {
  accountTypeCode: string;
  categoryCode: string;
  dateOfApplication: string;
  fromPeriod: number;
  toPeriod: number;
  unitOfPeriod: string;
  rateOfInterest: number;
}

/** GET /deposit-interest-rates — browse all TD/RD/PG interest rate slabs. */
export async function fetchDepositInterestRates(): Promise<DepositInterestRateRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-interest-rates`);
  if (!response.ok) throw new Error(`Failed to load deposit interest rates (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => {
    const id = (item.id as Record<string, unknown>) ?? item;
    return {
      accountTypeCode: String(id.accountTypeCode ?? ""),
      categoryCode: String(id.categoryCode ?? ""),
      dateOfApplication: String(id.dateOfApplication ?? ""),
      fromPeriod: Number(id.fromPeriod ?? 0),
      toPeriod: Number(id.toPeriod ?? 0),
      unitOfPeriod: String(id.unitOfPeriod ?? ""),
      rateOfInterest: Number(item.rateOfInterest ?? 0),
    };
  });
}

/** POST /deposit-interest-rates — creates a TD/RD/PG interest rate slab. */
export async function createDepositInterestRate(payload: {
  accountTypeCode: string;
  categoryCode: string;
  dateOfApplication: string;
  fromPeriod: number;
  toPeriod: number;
  unitOfPeriod: string;
  rateOfInterest: number;
}): Promise<DepositInterestRateRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-interest-rates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: {
        accountTypeCode: payload.accountTypeCode,
        categoryCode: payload.categoryCode,
        dateOfApplication: `${payload.dateOfApplication}T00:00:00`,
        fromPeriod: payload.fromPeriod,
        toPeriod: payload.toPeriod,
        unitOfPeriod: payload.unitOfPeriod,
      },
      rateOfInterest: payload.rateOfInterest,
    }),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create deposit interest rate (${response.status})`));
  }
  return payload;
}

export interface InstallmentTypeRecord {
  id: string;
  description: string;
  diaryBased: string;
  principalArrearsOnDiary: string;
  interestArrearsOnDiary: string;
  installmentOn: string;
}

const toInstallmentTypeRecord = (item: Record<string, unknown>, fallbackId?: string): InstallmentTypeRecord => ({
  id: String(item.id ?? fallbackId ?? ""),
  description: String(item.description ?? ""),
  diaryBased: String(item.diaryBased ?? ""),
  principalArrearsOnDiary: String(item.principalArrearsOnDiary ?? ""),
  interestArrearsOnDiary: String(item.interestArrearsOnDiary ?? ""),
  installmentOn: String(item.installmentOn ?? ""),
});

/** GET /installment-types — browse all installment types. */
export async function fetchInstallmentTypes(): Promise<InstallmentTypeRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/installment-types`);
  if (!response.ok) throw new Error(`Failed to load installment types (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => toInstallmentTypeRecord(item));
}

/** GET /installment-types/{id} — full detail, used to populate View/Edit. */
export async function fetchInstallmentTypeById(id: string): Promise<InstallmentTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/installment-types/${encodeURIComponent(id)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load installment type (${response.status})`));
  }
  return toInstallmentTypeRecord(data ?? {}, id);
}

/** POST /installment-types — creates an installment type. */
export async function createInstallmentType(payload: {
  id: string;
  description: string;
  diaryBased: string;
  principalArrearsOnDiary: string;
  interestArrearsOnDiary: string;
  installmentOn: string;
}): Promise<InstallmentTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/installment-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create installment type (${response.status})`));
  }
  return toInstallmentTypeRecord(data ?? payload, payload.id);
}

/** PUT /installment-types/{id} — updates an existing installment type. */
export async function updateInstallmentType(
  id: string,
  payload: {
    description: string;
    diaryBased: string;
    principalArrearsOnDiary: string;
    interestArrearsOnDiary: string;
    installmentOn: string;
  }
): Promise<InstallmentTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/installment-types/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update installment type (${response.status})`));
  }
  return toInstallmentTypeRecord(data ?? payload, id);
}

export interface IndustryRecord {
  id: string;
  description: string;
}

const toIndustryRecord = (item: Record<string, unknown>, fallbackId?: string): IndustryRecord => ({
  id: String(item.id ?? fallbackId ?? ""),
  description: String(item.description ?? ""),
});

/** GET /industries — browse all industries. */
export async function fetchIndustries(): Promise<IndustryRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/industries`);
  if (!response.ok) throw new Error(`Failed to load industries (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => toIndustryRecord(item));
}

/** GET /industries/{id} — full detail, used to populate View/Edit. */
export async function fetchIndustryById(id: string): Promise<IndustryRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/industries/${encodeURIComponent(id)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load industry (${response.status})`));
  }
  return toIndustryRecord(data ?? {}, id);
}

/** POST /industries — creates an industry (id is 0..99, client-supplied). */
export async function createIndustry(payload: { id: string; description: string }): Promise<IndustryRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/industries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(payload.id) || payload.id, description: payload.description }),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create industry (${response.status})`));
  }
  return toIndustryRecord(data ?? payload, payload.id);
}

/** PUT /industries/{id} — updates an existing industry's description. */
export async function updateIndustry(id: string, payload: { description: string }): Promise<IndustryRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/industries/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update industry (${response.status})`));
  }
  return toIndustryRecord(data ?? payload, id);
}

export interface DepositRuleRecord {
  id: string;
  description: string;
}

const toDepositRuleRecord = (item: Record<string, unknown>, fallbackId?: string): DepositRuleRecord => ({
  id: String(item.id ?? fallbackId ?? ""),
  description: String(item.description ?? ""),
});

/** GET /deposit-rules — browse all deposit rules. */
export async function fetchDepositRules(): Promise<DepositRuleRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-rules`);
  if (!response.ok) throw new Error(`Failed to load deposit rules (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => toDepositRuleRecord(item));
}

/** GET /deposit-rules/{id} — full detail, used to populate View/Edit. */
export async function fetchDepositRuleById(id: string): Promise<DepositRuleRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-rules/${encodeURIComponent(id)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load deposit rule (${response.status})`));
  }
  return toDepositRuleRecord(data ?? {}, id);
}

/** POST /deposit-rules — creates a deposit rule (id is the legacy two-digit Deposit Rule Id). */
export async function createDepositRule(payload: { id: string; description: string }): Promise<DepositRuleRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(payload.id) || payload.id, description: payload.description }),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create deposit rule (${response.status})`));
  }
  return toDepositRuleRecord(data ?? payload, payload.id);
}

/** PUT /deposit-rules/{id} — updates an existing deposit rule's description. */
export async function updateDepositRule(id: string, payload: { description: string }): Promise<DepositRuleRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/deposit-rules/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update deposit rule (${response.status})`));
  }
  return toDepositRuleRecord(data ?? payload, id);
}

export interface FinalAccountGroupRecord {
  code: string;
  description: string;
}

const toFinalAccountGroupRecord = (item: Record<string, unknown>, fallbackCode?: string): FinalAccountGroupRecord => ({
  code: String(item.code ?? fallbackCode ?? ""),
  description: String(item.description ?? ""),
});

/** GET /final-account-groups — browse all final account groups. */
export async function fetchFinalAccountGroups(): Promise<FinalAccountGroupRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/final-account-groups`);
  if (!response.ok) throw new Error(`Failed to load final account groups (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => toFinalAccountGroupRecord(item));
}

/** GET /final-account-groups/{code} — full detail, used to populate View/Edit. */
export async function fetchFinalAccountGroupByCode(code: string): Promise<FinalAccountGroupRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/final-account-groups/${encodeURIComponent(code)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load final account group (${response.status})`));
  }
  return toFinalAccountGroupRecord(data ?? {}, code);
}

/** POST /final-account-groups — creates a final account group (four-character legacy code). */
export async function createFinalAccountGroup(payload: { code: string; description: string }): Promise<FinalAccountGroupRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/final-account-groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create final account group (${response.status})`));
  }
  return toFinalAccountGroupRecord(data ?? payload, payload.code);
}

/** PUT /final-account-groups/{code} — updates an existing final account group's description. */
export async function updateFinalAccountGroup(code: string, payload: { description: string }): Promise<FinalAccountGroupRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/final-account-groups/${encodeURIComponent(code)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update final account group (${response.status})`));
  }
  return toFinalAccountGroupRecord(data ?? payload, code);
}

export interface GlAccountRecord {
  glAccountCode: string;
  // Not part of the documented create/update request body, but tolerated on
  // read in case the list/detail response includes them (legacy GL rows are
  // conceptually scoped per branch/product). Defaults to "" when absent.
  branchCode: string;
  productCode: string;
  accountSerial: string;
  description: string;
  sequenceNumber: number;
  alie: string;
  transactionAllowed: string;
  dayBookSequenceNumber: number;
  directOuterInBspl: string;
  positiveFinalAccountGroup: string;
  negativeFinalAccountGroup: string;
  cdRatioGroupCode: string;
  includeExpenseStatement: string;
  createOutListWhen: string;
}

const toGlAccountRecord = (item: Record<string, unknown>, fallbackCode?: string): GlAccountRecord => ({
  glAccountCode: String(item.glAccountCode ?? fallbackCode ?? ""),
  branchCode: String(item.branchCode ?? ""),
  productCode: String(item.productCode ?? ""),
  accountSerial: String(item.accountSerial ?? ""),
  description: String(item.description ?? ""),
  sequenceNumber: Number(item.sequenceNumber ?? 0),
  alie: String(item.alie ?? "A"),
  transactionAllowed: String(item.transactionAllowed ?? "Y"),
  dayBookSequenceNumber: Number(item.dayBookSequenceNumber ?? 0),
  directOuterInBspl: String(item.directOuterInBspl ?? "N"),
  positiveFinalAccountGroup: String(item.positiveFinalAccountGroup ?? ""),
  negativeFinalAccountGroup: String(item.negativeFinalAccountGroup ?? ""),
  cdRatioGroupCode: String(item.cdRatioGroupCode ?? ""),
  includeExpenseStatement: String(item.includeExpenseStatement ?? "N"),
  createOutListWhen: String(item.createOutListWhen ?? "N"),
});

/** GET /gl-accounts — browse all GL accounts. */
export async function fetchGlAccounts(): Promise<GlAccountRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts`);
  if (!response.ok) throw new Error(`Failed to load GL accounts (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => toGlAccountRecord(item));
}

/** GET /gl-accounts/{glAccountCode} — full detail, used to populate View/Edit. */
export async function fetchGlAccountByCode(glAccountCode: string): Promise<GlAccountRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts/${encodeURIComponent(glAccountCode)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load GL account (${response.status})`));
  }
  return toGlAccountRecord(data ?? {}, glAccountCode);
}

/** POST /gl-accounts — creates a GL account. effectiveDate/userId seed the ledger rows. */
export async function createGlAccount(payload: {
  glAccount: Omit<GlAccountRecord, "sequenceNumber" | "dayBookSequenceNumber"> & {
    sequenceNumber: number;
    dayBookSequenceNumber: number;
  };
  effectiveDate: string;
  userId: string;
}): Promise<GlAccountRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create GL account (${response.status})`));
  }
  return toGlAccountRecord(data ?? payload.glAccount, payload.glAccount.glAccountCode);
}

/** PUT /gl-accounts/{glAccountCode} — updates an existing GL account (glAccountCode itself is fixed). */
export async function updateGlAccount(
  glAccountCode: string,
  payload: Omit<GlAccountRecord, "glAccountCode">
): Promise<GlAccountRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts/${encodeURIComponent(glAccountCode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update GL account (${response.status})`));
  }
  return toGlAccountRecord(data ?? payload, glAccountCode);
}

export interface FinalAccountGroupOption {
  code: string;
  description: string;
}

/** POST /gl-accounts/final-account-groups/search — populates the positive/negative Final Account Master picklists. */
export async function searchFinalAccountGroupsForGl(params: {
  groupFor: "POSITIVE" | "NEGATIVE";
  searchBy?: string;
  textToSearch?: string;
}): Promise<FinalAccountGroupOption[]> {
  const { groupFor, searchBy = "DESCRIPTION", textToSearch = "" } = params;
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts/final-account-groups/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupFor, searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to load final account groups (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    code: String(item.code ?? item.finalAccountGroupCode ?? ""),
    description: String(item.description ?? ""),
  }));
}

export interface CdRatioGroupOption {
  code: string;
  description: string;
}

/** POST /gl-accounts/cd-ratio-groups/search — populates the CD Ratio Group picklist. */
export async function searchCdRatioGroups(params: { searchBy?: string; textToSearch?: string } = {}): Promise<CdRatioGroupOption[]> {
  const { searchBy = "DESCRIPTION", textToSearch = "" } = params;
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/gl-accounts/cd-ratio-groups/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to load CD ratio groups (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    code: String(item.code ?? item.cdRatioGroupCode ?? ""),
    description: String(item.description ?? ""),
  }));
}

export interface InstrumentTypeRecord {
  code: string;
  description: string;
}

/**
 * POST /instrument-types/search — there is no plain GET list for this master;
 * an empty textToSearch returns every row, which is how the browse table is populated.
 */
export async function fetchInstrumentTypes(): Promise<InstrumentTypeRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/instrument-types/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy: "DESCRIPTION", textToSearch: "" }),
  });
  if (!response.ok) throw new Error(`Failed to load instrument types (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    code: String(item.code ?? ""),
    description: String(item.description ?? ""),
  }));
}

/** POST /instrument-types/save — idempotent create-or-update by natural key (code). */
export async function saveInstrumentType(payload: { code: string; description: string }): Promise<InstrumentTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/instrument-types/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to save instrument type (${response.status})`));
  }
  return {
    code: String(data?.code ?? payload.code),
    description: String(data?.description ?? payload.description),
  };
}

/** GET /products/{productCode} — full product detail, used to populate View/Edit. */
export async function fetchProductByCode(productCode: string): Promise<ProductRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/products/${encodeURIComponent(productCode)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load product (${response.status})`));
  }
  return {
    productCode: String(data?.productCode ?? productCode),
    description: String(data?.description ?? ""),
    shortDescription: String(data?.shortDescription ?? ""),
    accountType: String(data?.accountType ?? ""),
    implemented: String(data?.implemented ?? ""),
    cashTransactionAllowed: String(data?.cashTransactionAllowed ?? ""),
    defaultMinimumBalanceId: Number(data?.defaultMinimumBalanceId ?? 0),
    interestRoundingFactor: Number(data?.interestRoundingFactor ?? 0),
    nomineeRequired: String(data?.nomineeRequired ?? ""),
    inwardClearingAllowed: String(data?.inwardClearingAllowed ?? ""),
    panCardAllowed: String(data?.panCardAllowed ?? ""),
    individual: String(data?.individual ?? ""),
  };
}

/** PUT /products/{productCode} — updates an existing product. */
export async function updateProduct(
  productCode: string,
  payload: {
    description: string;
    shortDescription: string;
    accountType: string;
    implemented: string;
    cashTransactionAllowed: string;
    defaultMinimumBalanceId: number;
    interestRoundingFactor: number;
    nomineeRequired: string;
    inwardClearingAllowed: string;
  }
): Promise<ProductRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/products/${encodeURIComponent(productCode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update product (${response.status})`));
  }
  return {
    productCode,
    description: String(data?.description ?? payload.description),
    shortDescription: String(data?.shortDescription ?? payload.shortDescription),
    accountType: String(data?.accountType ?? payload.accountType),
    implemented: String(data?.implemented ?? payload.implemented),
    cashTransactionAllowed: String(data?.cashTransactionAllowed ?? payload.cashTransactionAllowed),
    defaultMinimumBalanceId: Number(data?.defaultMinimumBalanceId ?? payload.defaultMinimumBalanceId),
    interestRoundingFactor: Number(data?.interestRoundingFactor ?? payload.interestRoundingFactor),
    nomineeRequired: String(data?.nomineeRequired ?? payload.nomineeRequired),
    inwardClearingAllowed: String(data?.inwardClearingAllowed ?? payload.inwardClearingAllowed),
    panCardAllowed: "N",
    individual: "N",
  };
}

function toBranchDetail(item: Record<string, unknown>): BranchDetail {
  return {
    branchCode: String(item.branchCode ?? ""),
    name: String(item.name ?? ""),
    nameShort: String(item.nameShort ?? "").trim(),
    address1: String(item.address1 ?? ""),
    address2: String(item.address2 ?? ""),
    address3: String(item.address3 ?? ""),
    cityCode: String(item.cityCode ?? ""),
    zip: item.zip != null ? String(item.zip) : "",
    ipAddress1: String(item.ipAddress1 ?? ""),
    ipAddress2: String(item.ipAddress2 ?? ""),
    emailId: String(item.emailId ?? ""),
    phone1: String(item.phone1 ?? ""),
    phone2: String(item.phone2 ?? ""),
    phone3: String(item.phone3 ?? ""),
    phone4: String(item.phone4 ?? ""),
    regionCode: (item.regionCode as string | null) ?? null,
    noOfficer: (item.noOfficer as number | null) ?? null,
    noClerk: (item.noClerk as number | null) ?? null,
    noSubStaff: (item.noSubStaff as number | null) ?? null,
    rtgsCode: String(item.rtgsCode ?? ""),
    lastChequeSrno: Number(item.lastChequeSrno ?? 0),
    tanNo: String(item.tanNo ?? ""),
    isImplemented: String(item.isImplemented ?? "N"),
    createdDate: String(item.createdDate ?? ""),
    modifiedDate: (item.modifiedDate as string | null) ?? null,
  };
}

/**
 * GET /headoffice/branch — browse all branches. The documented contract returns only
 * summary fields, but the live server actually returns the full detail record per
 * branch; `toBranchDetail` tolerates either shape, defaulting missing fields.
 */
export async function fetchBranches(): Promise<BranchDetail[]> {
  const response = await fetch(`${BASE_URL}/headoffice/branch`);
  if (!response.ok) throw new Error(`Failed to load branches (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map(toBranchDetail);
}

/** GET /headoffice/branch/{branchCode} — full branch detail, used to populate View/Edit. */
export async function fetchBranchByCode(branchCode: string): Promise<BranchDetail> {
  const response = await fetch(`${BASE_URL}/headoffice/branch/${encodeURIComponent(branchCode)}`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load branch (${response.status})`));
  }
  return toBranchDetail(data ?? {});
}

/** PUT /headoffice/branch/{branchCode} — updates an existing branch. */
export async function updateBranch(payload: BranchDetail): Promise<BranchDetail> {
  const response = await fetch(`${BASE_URL}/headoffice/branch/${encodeURIComponent(payload.branchCode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update branch (${response.status})`));
  }
  return toBranchDetail(data ?? (payload as unknown as Record<string, unknown>));
}
