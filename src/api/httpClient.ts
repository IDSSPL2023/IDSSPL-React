// Generic fetch-based API client shared across every `*.api.ts` module.
// Centralizes the BASE_URL lookup, JSON parsing, and the
// `{ hasError, responseMessage }` soft-error convention the master-maintenance
// backend uses (it often responds 200 OK even on logical failure).
const DEFAULT_BASE_URL = "http://13.202.249.213:8080";

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_MASTER_MAINTENANCE_API_URL || DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function buildUrl(path: string, params?: ApiRequestOptions["params"]): string {
  const url = new URL(path.startsWith("http") ? path : `${getApiBaseUrl()}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function request<T = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  });

  const data = await parseJson(response);
  const record = !Array.isArray(data) && data && typeof data === "object" ? (data as Record<string, unknown>) : null;

  if (!response.ok || record?.hasError) {
    const message = typeof record?.responseMessage === "string" ? record.responseMessage : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const apiGet = <T = unknown>(path: string, options?: ApiRequestOptions): Promise<T> =>
  request<T>("GET", path, undefined, options);

export const apiPost = <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
  request<T>("POST", path, body, options);

export const apiPut = <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
  request<T>("PUT", path, body, options);

export const apiPatch = <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
  request<T>("PATCH", path, body, options);

export const apiDelete = <T = unknown>(path: string, options?: ApiRequestOptions): Promise<T> =>
  request<T>("DELETE", path, undefined, options);

/** Unwraps the common list-envelope shapes (`content`/`data`/`results`/`items`) or a bare array. */
export function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const list = record.content ?? record.data ?? record.results ?? record.items;
  return Array.isArray(list) ? list : [];
}
