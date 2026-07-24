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

export interface StateSearchParams {
  searchBy?: "CODE" | "NAME" | "STATE_NAME" | "COUNTRY_CODE";
  textToSearch?: string;
}

/** POST /states/search — empty textToSearch returns every state; used for the State Master table. */
export async function fetchStates(params: StateSearchParams = {}): Promise<StateRecord[]> {
  const { searchBy = "NAME", textToSearch = "" } = params;
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/states/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchBy, textToSearch }),
  });
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

export interface VehicleOwnedTypeRecord {
  vehicleOwnedId: number;
  description: string;
}

/** GET /vehicle-owned-types — browse all vehicle owned types (only 4 real rows fit in one size=20 call). */
export async function fetchVehicleOwnedTypes(): Promise<VehicleOwnedTypeRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/vehicle-owned-types?page=0&size=20`);
  if (!response.ok) throw new Error(`Failed to load vehicle owned types (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    vehicleOwnedId: Number(item.vehicleOwnedId ?? 0),
    description: String(item.description ?? ""),
  }));
}

/** POST /vehicle-owned-types/find — load a single row by its natural key, used for Edit. */
export async function fetchVehicleOwnedTypeById(vehicleOwnedId: number): Promise<VehicleOwnedTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/vehicle-owned-types/find`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicleOwnedId }),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to load vehicle owned type (${response.status})`));
  }
  return {
    vehicleOwnedId: Number(data?.vehicleOwnedId ?? vehicleOwnedId),
    description: String(data?.description ?? ""),
  };
}

/** POST /vehicle-owned-types — strict create. */
export async function createVehicleOwnedType(payload: VehicleOwnedTypeRecord): Promise<VehicleOwnedTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/vehicle-owned-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create vehicle owned type (${response.status})`));
  }
  return {
    vehicleOwnedId: Number(data?.vehicleOwnedId ?? payload.vehicleOwnedId),
    description: String(data?.description ?? payload.description),
  };
}

/** PUT /vehicle-owned-types — strict update; vehicleOwnedId travels in the body, not the URL. */
export async function updateVehicleOwnedType(payload: VehicleOwnedTypeRecord): Promise<VehicleOwnedTypeRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/vehicle-owned-types`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update vehicle owned type (${response.status})`));
  }
  return {
    vehicleOwnedId: Number(data?.vehicleOwnedId ?? payload.vehicleOwnedId),
    description: String(data?.description ?? payload.description),
  };
}

export interface SocialSubSectorRecord {
  socialSectorId: number;
  socialSubSectorId: number;
  description: string;
}

/** GET /social-sub-sectors — browse all social sub sectors; 46 real rows exceed the default size=20 page, so fetch with size=200 in one shot (still comfortably under the backend's 200 hard cap). */
export async function fetchSocialSubSectors(): Promise<SocialSubSectorRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/social-sub-sectors?page=0&size=200`);
  if (!response.ok) throw new Error(`Failed to load social sub sectors (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    socialSectorId: Number(item.socialSectorId ?? 0),
    socialSubSectorId: Number(item.socialSubSectorId ?? 0),
    description: String(item.description ?? ""),
  }));
}

/** POST /social-sub-sectors — strict create; natural key is the (socialSectorId, socialSubSectorId) pair. */
export async function createSocialSubSector(payload: SocialSubSectorRecord): Promise<SocialSubSectorRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/social-sub-sectors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create social sub sector (${response.status})`));
  }
  return {
    socialSectorId: Number(data?.socialSectorId ?? payload.socialSectorId),
    socialSubSectorId: Number(data?.socialSubSectorId ?? payload.socialSubSectorId),
    description: String(data?.description ?? payload.description),
  };
}

/** PUT /social-sub-sectors — strict update; the composite key travels in the body, not the URL. */
export async function updateSocialSubSector(payload: SocialSubSectorRecord): Promise<SocialSubSectorRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/social-sub-sectors`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update social sub sector (${response.status})`));
  }
  return {
    socialSectorId: Number(data?.socialSectorId ?? payload.socialSectorId),
    socialSubSectorId: Number(data?.socialSubSectorId ?? payload.socialSubSectorId),
    description: String(data?.description ?? payload.description),
  };
}

export interface AddressProofRecord {
  addressProofId: number;
  description: string;
}

/** GET /address-proofs — browse all address proofs (only 13 real rows fit in one size=200 call). */
export async function fetchAddressProofs(): Promise<AddressProofRecord[]> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/address-proofs?page=0&size=200`);
  if (!response.ok) throw new Error(`Failed to load address proofs (${response.status})`);
  const data = await parseJson(response);
  return extractList(data).map((item) => ({
    addressProofId: Number(item.addressProofId ?? 0),
    description: String(item.description ?? ""),
  }));
}

/** POST /address-proofs — strict create. */
export async function createAddressProof(payload: AddressProofRecord): Promise<AddressProofRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/address-proofs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to create address proof (${response.status})`));
  }
  return {
    addressProofId: Number(data?.addressProofId ?? payload.addressProofId),
    description: String(data?.description ?? payload.description),
  };
}

/** PUT /address-proofs — strict update; addressProofId travels in the body, not the URL. */
export async function updateAddressProof(payload: AddressProofRecord): Promise<AddressProofRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/master-maintenance/address-proofs`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(response)) as Record<string, unknown> | null;
  if (!response.ok || data?.hasError) {
    throw new Error(String(data?.responseMessage ?? `Failed to update address proof (${response.status})`));
  }
  return {
    addressProofId: Number(data?.addressProofId ?? payload.addressProofId),
    description: String(data?.description ?? payload.description),
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
