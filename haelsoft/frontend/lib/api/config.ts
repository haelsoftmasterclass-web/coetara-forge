/** API base URL. The server may use a private address (API_BASE_URL); the browser uses the public one. */
export function apiBaseUrl(): string {
  const serverUrl = typeof window === "undefined" ? process.env.API_BASE_URL : undefined;
  return (serverUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
}

export const REVALIDATE_SECONDS = Number(process.env.API_REVALIDATE_SECONDS || 60);
