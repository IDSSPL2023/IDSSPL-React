import { apiGet, apiPost, apiPut, extractList } from "./httpClient";

export interface ConstitutionRecord {
  constitutionCode: string;
  description: string;
}

const toConstitutionRecord = (
  item: Record<string, unknown>,
  fallbackCode?: string,
): ConstitutionRecord => ({
  constitutionCode: String(
    item.constitutionCode ?? item.code ?? fallbackCode ?? "",
  ),
  description: String(item.description ?? ""),
});

/** GET /constitutions — browse all constitution-type records. */
export async function fetchConstitutions(): Promise<ConstitutionRecord[]> {
  const data = await apiGet("/api/v1/master-maintenance/constitutions");
  return extractList(data).map((item) => toConstitutionRecord(item));
}

/** GET /constitutions/{code} — full detail, used to populate View/Edit. */
export async function fetchConstitutionByCode(
  constitutionCode: string,
): Promise<ConstitutionRecord> {
  const data = await apiGet<Record<string, unknown>>(
    `/api/v1/master-maintenance/constitutions/${encodeURIComponent(constitutionCode)}`,
  );
  return toConstitutionRecord(data ?? {}, constitutionCode);
}

/** POST /constitutions — creates a constitution-type record (code is client-supplied). */
export async function createConstitution(
  payload: ConstitutionRecord,
): Promise<ConstitutionRecord> {
  const data = await apiPost<Record<string, unknown>>(
    "/api/v1/master-maintenance/constitutions",
    payload,
  );
  return toConstitutionRecord(data ?? payload, payload.constitutionCode);
}

/** PUT /constitutions/{code} — updates an existing constitution-type record's description. */
export async function updateConstitution(payload: {
  description: string;
  constitutionCode: string;
}): Promise<ConstitutionRecord> {
  const data = await apiPut<Record<string, unknown>>(
    `/api/v1/master-maintenance/constitutions`,
    payload,
  );
  return toConstitutionRecord(data ?? payload);
}
