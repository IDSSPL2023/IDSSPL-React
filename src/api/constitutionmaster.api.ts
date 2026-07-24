import { apiGet, apiPost, apiPut, extractList } from "./httpClient";

export interface ConstitutionRecord {
  constitutionCode: string;
  description: string;
}

export interface SearchConstitutionsRequest {
  page?: number;
  size?: number;
  searchBy?: "constitutionCode" | "description";
  textToSearch?: string;
  sort?: {
    field: string;
    direction: "ASC" | "DESC";
  };
}

export interface SearchConstitutionsResponse {
  content: ConstitutionRecord[];
  totalPages: number;
  totalElements: number;
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

export async function searchConstitutions(
  request: SearchConstitutionsRequest = {},
): Promise<SearchConstitutionsResponse> {
  const { page = 0, size = 20, searchBy, textToSearch, sort } = request;

  const params: Record<string, string | number | boolean | undefined> = {
    page,
    size,
  };
  if (sort) {
    params.sortField = sort.field;
    params.sortDirection = sort.direction;
  }

  const body: { searchBy?: string; textToSearch?: string } = {};
  if (searchBy && textToSearch) {
    body.searchBy = searchBy;
    body.textToSearch = textToSearch;
  }

  const data = await apiPost<Record<string, unknown>>(
    "/api/v1/master-maintenance/constitutions/search",
    body,
    { params },
  );

  const content = extractList(data).map((item) => toConstitutionRecord(item));
  const totalPages =
    typeof data?.totalPages === "number"
      ? data.totalPages
      : Math.ceil(
          (typeof data?.totalElements === "number"
            ? data.totalElements
            : content.length) / size,
        );
  const totalElements =
    typeof data?.totalElements === "number"
      ? data.totalElements
      : content.length;

  return { content, totalPages, totalElements };
}

export async function fetchConstitutions(): Promise<ConstitutionRecord[]> {
  const result = await searchConstitutions({ page: 0, size: 20 });
  return result.content;
}

export async function fetchConstitutionByCode(
  constitutionCode: string,
): Promise<ConstitutionRecord> {
  const data = await apiGet<Record<string, unknown>>(
    `/api/v1/master-maintenance/constitutions/${encodeURIComponent(constitutionCode)}`,
  );
  return toConstitutionRecord(data ?? {}, constitutionCode);
}

export async function createConstitution(
  payload: ConstitutionRecord,
): Promise<ConstitutionRecord> {
  const data = await apiPost<Record<string, unknown>>(
    "/api/v1/master-maintenance/constitutions",
    payload,
  );
  return toConstitutionRecord(data ?? payload, payload.constitutionCode);
}

export async function updateConstitution(payload: {
  description: string;
  constitutionCode: string;
}): Promise<ConstitutionRecord> {
  const data = await apiPut<Record<string, unknown>>(
    "/api/v1/master-maintenance/constitutions",
    payload,
  );
  return toConstitutionRecord(data ?? payload, payload.constitutionCode);
}
