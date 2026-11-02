/**
 * Shared API base-URL configuration.
 *
 * All frontend requests and backend-served image URLs resolve their host from
 * here so the deployed site can be pointed at the live backend by setting the
 * `VITE_API_URL` env var (e.g. in the Vercel dashboard). When no env var is set
 * the app falls back to the local dev backend so `npm run dev` keeps working.
 */

// Root backend origin, e.g. "https://api.example.com" or "http://localhost:8000".
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Convenience base for endpoints under the "/api" prefix.
// Honors the legacy `VITE_API_BASE_URL` override when present for backward
// compatibility, otherwise derives from `API_URL`.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || `${API_URL}/api`;
