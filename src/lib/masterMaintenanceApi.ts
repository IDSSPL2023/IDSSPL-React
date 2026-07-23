const BASE_URL = import.meta.env.VITE_MASTER_MAINTENANCE_API_URL || "http://13.202.249.213:8080";

export interface CityRecord {
  cityCode: string;
  name: string;
  countryCode: string;
  countryName: string;
}

export interface CountryOption {
  code: string;
  name: string;
}

export interface StateRecord {
  stateCode: string;
  countryCode: string;
  stateName: string;
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

/** GET /cities — full CityDE data used to populate the City Master table. */
// export async function fetchCities(): Promise<CityRecord[]> {
//   const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/cities`);
//   if (!response.ok) throw new Error(`Failed to load cities (${response.status})`);
//   const data = await parseJson(response);
//   return extractList(data).map((item) => ({
//     cityCode: String(item.cityCode ?? ""),
//     name: String(item.name ?? ""),
//     countryCode: String(item.countryCode ?? ""),
//     countryName: String(item.countryName ?? ""),
//   }));
// }

// lib/masterMaintenanceApi.ts

// lib/masterMaintenanceApi.ts

export interface CityRecord {
  cityCode: string;
  name: string;
  // countryCode?: string;
  // countryName?: string;
}

export interface CitySearchParams {
  searchBy?: "CODE" | "NAME";
  textToSearch?: string;
}

export async function fetchCities(
  params: CitySearchParams = {}
): Promise<CityRecord[]> {
  const { searchBy = "NAME", textToSearch = "" } = params;

  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/cities/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to load cities (${response.status})`);
  }
  
  const data = await parseJson(response);
  
  return extractList(data).map((item) => ({
    cityCode: String(item.cityCode ?? item.code ?? item.value ?? ""),
    name: String(item.name ?? item.cityName ?? item.label ?? item.text ?? ""),
    countryCode: String(item.countryCode ?? ""),
    countryName: String(item.countryName ?? ""),
  }));
}

/** GET /cities — full CityDE data used to populate the City Master table. */
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

// lib/masterMaintenanceApi.ts

// export async function fetchCities(params?: {
//   searchBy?: string;
//   textToSearch?: string;
// }): Promise<CityRecord[]> {
//   let url = `${BASE_URL}/api/v1/master-maintenance/cities`;
  
//   // Build query params if provided
//   if (params?.searchBy && params?.textToSearch) {
//     const searchParams = new URLSearchParams();
//     searchParams.append('searchBy', params.searchBy);
//     searchParams.append('textToSearch', params.textToSearch);
//     url += `?${searchParams.toString()}`;
//   }
  
//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`Failed to load cities (${response.status})`);
//   const data = await parseJson(response);
//   return extractList(data).map((item) => ({
//     cityCode: String(item.cityCode ?? ""),
//     name: String(item.name ?? ""),
//     countryCode: String(item.countryCode ?? ""),
//     countryName: String(item.countryName ?? ""),
//   }));
// }
/** POST /countries/search — empty textToSearch returns all countries; used for the Country dropdown. */
export interface CountrySearchParams {
  searchBy?: string;   // "NAME" | "CODE" | ...
  textToSearch?: string;
}

export async function fetchCountries(
  params: CountrySearchParams = {}
): Promise<CountryOption[]> {
  const { searchBy = "NAME", textToSearch = "" } = params;

  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/countries/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to load countries (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    code: String(item.code ?? item.countryCode ?? item.value ?? ""),
    name: String(item.name ?? item.countryName ?? item.label ?? item.text ?? ""),
  }));
}

/** POST /cities — creates a new city; the server assigns cityCode and returns 409 if the name already exists. */
export async function createCity(payload: {
  name: string;
  countryCode: string;
}): Promise<CityRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create city (${response.status})`));
  }
  return {
    cityCode: String(data?.cityCode ?? ""),
    name: String(data?.name ?? payload.name),
    countryCode: String(data?.countryCode ?? payload.countryCode),
    countryName: String(data?.countryName ?? ""),
  };
}

/** GET /master/states — browse returning stateCode, countryCode, stateName. */
export async function fetchStates(payload?: {
  searchBy: "CODE" | "NAME" | "STATE_NAME" | "COUNTRY_CODE";
  textToSearch: string;
}): Promise<StateRecord[]> {
  const response = await fetch(
    `${BASE_URL}/api/v1/master-maintenance/states/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok)
    throw new Error(`Failed to load states (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    stateCode: String(item.stateCode ?? ""),
    countryCode: String(item.countryCode ?? ""),
    stateName: String(item.stateName ?? ""),
  }));
}

/**
 * POST /master/states — creates a state; stateCode is client-supplied. The server
 * responds 200 even on logical failure (e.g. duplicate code), signaling the error via
 * `{ hasError: true, responseMessage }` in the body rather than an HTTP error status.
 */
export async function createState(payload: {
  stateCode: string;
  countryCode: string;
  stateName: string;
}): Promise<StateRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/states`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create state (${response.status})`));
  }
  const body = (data?.body ?? data) as Record<string, unknown> | undefined;
  return {
    stateCode: String(body?.stateCode ?? payload.stateCode),
    countryCode: String(body?.countryCode ?? payload.countryCode),
    stateName: String(body?.stateName ?? payload.stateName),
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
