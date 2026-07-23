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

// Account Master endpoints go here, following the same fetch/create/update
// pattern as headoffice.api.ts and globalmaster.api.ts.
