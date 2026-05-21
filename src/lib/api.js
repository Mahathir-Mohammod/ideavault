/**
 * Centralized API configuration for IdeaVault.
 *
 * In production (Vercel), NEXT_PUBLIC_API_URL should be set to your
 * Render / Railway backend URL, e.g. "https://ideavault-api.onrender.com"
 *
 * In development, it falls back to "http://localhost:5000".
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
