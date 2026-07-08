"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/admin-api";
import toast from "react-hot-toast";

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit, skip: page * limit };
      if (search) params.search = search;
      const res = await adminApi.getIdeas(params);
      setIdeas(res.ideas);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    if (!window.confirm(`Delete idea "${ideaTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteIdea(ideaId);
      toast.success(`Idea "${ideaTitle}" deleted`);
      fetchIdeas();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Ideas</h1>
      <p className="admin-page-subtitle">Moderate all ideas on the platform ({total} total)</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by title..."
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
          <div className="admin-loading">Loading ideas...</div>
        ) : ideas.length === 0 ? (
          <div className="admin-empty">No ideas found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Comments</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea._id}>
                  <td className="admin-cell-title">
                    <span className="admin-title-text">{idea.title}</span>
                    {idea.shortDesc && (
                      <span className="admin-title-desc">{idea.shortDesc.slice(0, 80)}{idea.shortDesc.length > 80 ? "..." : ""}</span>
                    )}
                  </td>
                  <td>{idea.authorName || "Unknown"}</td>
                  <td>
                    <span className="admin-badge">{idea.category || "Uncategorized"}</span>
                  </td>
                  <td>{idea.commentCount ?? 0}</td>
                  <td className="admin-cell-date">
                    {idea.createdAt
                      ? new Date(idea.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-danger-sm"
                      onClick={() => handleDeleteIdea(idea._id, idea.title)}
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
