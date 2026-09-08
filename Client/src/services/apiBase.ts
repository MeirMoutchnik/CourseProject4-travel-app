/** Dev default `/api` → Vite proxy to Server. Override with VITE_API_URL if needed. */
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";
