"use client";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function adminFetch(endpoint, options = {}) {
  const url = `${BASE}/api/admin${endpoint}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  getStats: () => adminFetch("/stats"),

  getUsers: (params = {}) =>
    adminFetch(`/users?${new URLSearchParams(params)}`),

  updateUserRole: (id, role) =>
    adminFetch(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  deleteUser: (id) =>
    adminFetch(`/users/${id}`, { method: "DELETE" }),

  getIdeas: (params = {}) =>
    adminFetch(`/ideas?${new URLSearchParams(params)}`),

  deleteIdea: (id) =>
    adminFetch(`/ideas/${id}`, { method: "DELETE" }),
};
