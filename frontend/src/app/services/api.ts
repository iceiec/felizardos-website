// Base API client — wraps fetch with JWT auth, base URL, and unified error handling.
// Switch VITE_API_URL in .env to point at the Express server (default: http://localhost:5000).

const BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";
const TOKEN_KEY = "felizardos_token";
const AUTH_KEY = "felizardos_admin_auth";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAllAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (_err) {
    // Network error (backend not running, CORS, etc.)
    // Return a failed response shape so callers handle it gracefully
    throw new Error("Network error: Could not reach the server. Is the backend running?");
  }

  if (res.status === 401) {
    // Clear BOTH the JWT token and the admin auth flag to prevent redirect loops
    clearAllAuth();
    // Don't hard-redirect — just throw so the caller can handle it
    throw new Error("Session expired. Please log in again.");
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }

  return json;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
