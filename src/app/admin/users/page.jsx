"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/admin-api";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit, skip: page * limit };
      if (search) params.search = search;
      const res = await adminApi.getUsers(params);
      setUsers(res.users);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success(`Role changed to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}" and all their ideas? This cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      toast.success(`User "${userName}" deleted`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-subtitle">Manage all registered users ({total} total)</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="admin-input"
        />
        <button type="submit" className="admin-btn admin-btn-primary">
          Search
        </button>
        {search && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(0);
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Error */}
      {error && <div className="admin-error">{error}</div>}

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="admin-empty">No users found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td className="admin-cell-name">{user.name || "—"}</td>
                  <td className="admin-cell-email">{user.email}</td>
                  <td>
                    <select
                      value={user.role || "user"}
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                      className="admin-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user.emailVerified ? "✅" : "❌"}</td>
                  <td className="admin-cell-date">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-danger-sm"
                      onClick={() =>
                        handleDeleteUser(user._id || user.id, user.name || user.email)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn admin-btn-ghost"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </button>
          <span className="admin-page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="admin-btn admin-btn-ghost"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
