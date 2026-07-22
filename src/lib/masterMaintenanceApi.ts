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
export async function fetchCities(): Promise<CityRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/cities`);
  if (!response.ok) throw new Error(`Failed to load cities (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    cityCode: String(item.cityCode ?? ""),
    name: String(item.name ?? ""),
    countryCode: String(item.countryCode ?? ""),
    countryName: String(item.countryName ?? ""),
  }));
}

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
  if (!response.ok) throw new Error(`Failed to create city (${response.status})`);
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  return {
    cityCode: String(data?.cityCode ?? ""),
    name: String(data?.name ?? payload.name),
    countryCode: String(data?.countryCode ?? payload.countryCode),
    countryName: String(data?.countryName ?? ""),
  };
}
