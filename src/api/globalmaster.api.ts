const BASE_URL = import.meta.env.VITE_MASTER_MAINTENANCE_API_URL || "http://13.202.249.213:8080";

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

export interface CityRecord {
  cityCode: string;
  name: string;
  countryCode: string;
  countryName: string;
}

export interface CitySearchParams {
  searchBy?: "CODE" | "NAME";
  textToSearch?: string;
}

/** POST /cities/search — empty textToSearch returns every city; used for the City Master table and picklist. */
export async function fetchCities(params: CitySearchParams = {}): Promise<CityRecord[]> {
  const { searchBy = "NAME", textToSearch = "" } = params;
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/cities/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
  if (!response.ok) throw new Error(`Failed to load cities (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    cityCode: String(item.cityCode ?? item.code ?? item.value ?? ""),
    name: String(item.name ?? item.cityName ?? item.label ?? item.text ?? ""),
    countryCode: String(item.countryCode ?? ""),
    countryName: String(item.countryName ?? ""),
  }));
}

/** POST /cities — creates a new city; the server assigns cityCode and returns 409 if the name already exists. */
export async function createCity(payload: { name: string; countryCode: string }): Promise<CityRecord> {
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

export interface StateRecord {
  stateCode: string;
  countryCode: string;
  stateName: string;
}

/** GET /master/states — browse returning stateCode, countryCode, stateName. */
export async function fetchStates(): Promise<StateRecord[]> {
  const response = await fetch(`${BASE_URL}/master/states`);
  if (!response.ok) throw new Error(`Failed to load states (${response.status})`);
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
  const response = await fetch(`${BASE_URL}/master/states`, {
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

export interface CountryOption {
  code: string;
  name: string;
}

export interface CountrySearchParams {
  searchBy?: string; // "NAME" | "CODE" | ...
  textToSearch?: string;
}

/** POST /countries/search — empty textToSearch returns all countries; used for the Country dropdown. */
export async function fetchCountries(params: CountrySearchParams = {}): Promise<CountryOption[]> {
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
