const DEFAULT_API_BASE_URL = "https://promptlybotbackendpython-production.up.railway.app";

export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export function apiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
