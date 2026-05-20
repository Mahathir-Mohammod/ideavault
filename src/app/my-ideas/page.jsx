"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "react-hot-toast";

const CATEGORIES = [
  "FinTech", "HealthTech", "EdTech", "CleanTech", "AI / ML",
  "Web3 / Crypto", "SaaS", "E-Commerce", "Social", "Other",
];

function timeAgo(date) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function EditIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function PlusIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CloseIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      <circle cx="12" cy="12" r="9" strokeDasharray="2 4" />
    </svg>
  );
}

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const tag = val.trim().slice(0, 25);
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag]);
    }
    setInput("");
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--bg-input)",
          border: "1.5px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          minHeight: "2.75rem",
          cursor: "text",
        }}
        onClick={() => document.getElementById("modal-tag-input").focus()}
      >
        {tags.map((t) => (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              padding: "2px var(--space-3)",
              borderRadius: "var(--radius-full)",
              background: "var(--color-brand-red)",
              color: "#fff",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            {t}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(t); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.7)", fontSize: "0.75rem",
                lineHeight: 1, paddingLeft: "2px",
              }}
            >×</button>
          </span>
        ))}
        <input
          id="modal-tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length === 0 ? "Type & press Enter to add tags" : ""}
          style={{
            flex: 1, minWidth: "8rem",
            background: "transparent", border: "none", outline: "none",
            color: "var(--text-primary)",
            fontSize: "var(--text-base)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
        {tags.length}/8 tags · press Enter or comma to add
      </p>
    </div>
  );
}

function Field({ label, optional, counter, maxLen, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--fw-semibold)",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          {label}
          {optional && (
            <span style={{ fontWeight: "var(--fw-regular)", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
              (optional)
            </span>
          )}
        </label>
        {counter !== undefined && maxLen && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            {counter}/{maxLen}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.25rem 0" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
      <span style={{
        fontSize: "0.65rem", fontWeight: 600,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--text-muted)", whiteSpace: "nowrap",
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="mi-card mi-skeleton-card">
      <div className="mi-skel-cat" />
      <div className="mi-skel-title" />
      <div className="mi-skel-desc" />
      <div className="mi-skel-desc short" />
      <div className="mi-skel-tags">
        <div className="mi-skel-tag" />
        <div className="mi-skel-tag" />
        <div className="mi-skel-tag" />
      </div>
      <div className="mi-skel-actions">
        <div className="mi-skel-btn" />
        <div className="mi-skel-btn" />
      </div>
    </div>
  );
}

function LoadingAuthSkeleton() {
  return (
    <div className="mi-auth-skel">
      <div className="mi-auth-spinner" />
    </div>
  );
}

function UpdateModal({ idea, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: idea?.title || "",
    shortDesc: idea?.shortDesc || "",
    detailedDesc: idea?.detailedDesc || "",
    category: idea?.category || "",
    imageUrl: idea?.imageUrl || "",
    budget: idea?.budget ? String(idea.budget) : "",
    targetAudience: idea?.targetAudience || "",
    problemStatement: idea?.problemStatement || "",
    proposedSolution: idea?.proposedSolution || "",
  });
  const [tags, setTags] = useState(idea?.tags || []);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${idea._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          shortDesc: form.shortDesc,
          detailedDesc: form.detailedDesc,
          category: form.category,
          tags,
          imageUrl: form.imageUrl || undefined,
          budget: form.budget ? Number(form.budget) : undefined,
          targetAudience: form.targetAudience,
          problemStatement: form.problemStatement,
          proposedSolution: form.proposedSolution,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update idea");
      toast.success("Idea updated successfully");
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    border: "1.5px solid var(--border-default)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-3) var(--space-4)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    outline: "none",
    resize: "none",
    transition: "border-color 250ms ease",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="mi-modal-overlay" onClick={handleBackdropClick}>
      <div className="mi-modal mi-modal-update">
        <div className="mi-modal-header">
          <h2 className="mi-modal-title">Edit Idea</h2>
          <button className="mi-modal-close" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form className="mi-modal-form" onSubmit={handleSave}>
          <Field label="Idea Title" counter={form.title.length} maxLen={120}>
            <input
              placeholder="e.g. AI-powered mental health companion"
              maxLength={120}
              value={form.title}
              onChange={set("title")}
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Short Description" counter={form.shortDesc.length} maxLen={300}>
            <textarea
              placeholder="A one-line pitch that captures your idea"
              maxLength={300}
              rows={2}
              value={form.shortDesc}
              onChange={set("shortDesc")}
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Detailed Description" counter={form.detailedDesc.length} maxLen={5000}>
            <textarea
              placeholder="Describe your idea in detail"
              maxLength={5000}
              rows={4}
              value={form.detailedDesc}
              onChange={set("detailedDesc")}
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={set("category")}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
              required
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Tags" optional>
            <TagInput tags={tags} setTags={setTags} />
          </Field>

          <SectionDivider label="optional details" />

          <Field label="Image URL" optional>
            <input
              placeholder="https://example.com/preview.jpg"
              value={form.imageUrl}
              onChange={set("imageUrl")}
              style={inputStyle}
            />
          </Field>

          <Field label="Estimated Budget" optional>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={form.budget}
              onChange={set("budget")}
              style={inputStyle}
            />
          </Field>

          <SectionDivider label="problem & solution" />

          <Field label="Target Audience" counter={form.targetAudience.length} maxLen={200}>
            <input
              placeholder="e.g. College students, remote workers, pet owners"
              maxLength={200}
              value={form.targetAudience}
              onChange={set("targetAudience")}
              style={inputStyle}
            />
          </Field>

          <Field label="Problem Statement" counter={form.problemStatement.length} maxLen={2000}>
            <textarea
              placeholder="What specific problem does your idea solve?"
              maxLength={2000}
              rows={4}
              value={form.problemStatement}
              onChange={set("problemStatement")}
              style={inputStyle}
            />
          </Field>

          <Field label="Proposed Solution" counter={form.proposedSolution.length} maxLen={2000}>
            <textarea
              placeholder="How does your solution address the problem?"
              maxLength={2000}
              rows={4}
              value={form.proposedSolution}
              onChange={set("proposedSolution")}
              style={inputStyle}
            />
          </Field>

          <div className="mi-modal-actions">
            <button type="button" className="mi-btn mi-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="mi-btn mi-btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="mi-spinner-sm" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ idea, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${idea._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete idea");
      }
      toast.success("Idea deleted successfully");
      onDeleted();
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="mi-modal-overlay" onClick={handleBackdropClick}>
      <div className="mi-modal mi-modal-delete">
        <div className="mi-modal-header">
          <h2 className="mi-modal-title">Delete Idea</h2>
          <button className="mi-modal-close" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="mi-del-body">
          <div className="mi-del-icon">
            <DeleteIcon size={28} />
          </div>
          <p className="mi-del-text">
            Are you sure you want to delete <strong>{'"'}{idea?.title}{'"'}</strong>?
          </p>
          <p className="mi-del-sub">This action cannot be undone.</p>
        </div>
        <div className="mi-modal-actions">
          <button
            type="button"
            className="mi-btn mi-btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="mi-btn mi-btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="mi-spinner-sm" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyIdeasPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [deletingIdea, setDeletingIdea] = useState(null);

  const fetchMyIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/ideas/my", {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch ideas");
      }
      const data = await res.json();
      setIdeas(Array.isArray(data) ? data : data.ideas || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authPending && !session) {
      router.push("/login?redirect=/my-ideas");
      return;
    }
    if (!session) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ideas/my", {
          credentials: "include",
        });
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch ideas");
        }
        const data = await res.json();
        if (!cancelled) {
          setIdeas(Array.isArray(data) ? data : data.ideas || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [session, authPending, router]);

  if (authPending) return <LoadingAuthSkeleton />;
  if (!session) return null;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "var(--color-brand-red)", secondary: "#fff" },
          },
        }}
      />

      <div className="mi-page">
        <div className="mi-container">
          <div className="mi-header">
            <div className="mi-header-left">
              <h1>My Ideas</h1>
              <p>
                {loading
                  ? "Loading…"
                  : `You have ${ideas.length} idea${ideas.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="mi-header-actions">
              <Link href="/add-idea" className="mi-btn mi-btn-primary">
                <PlusIcon size={16} />
                Create New Idea
              </Link>
            </div>
          </div>

          {loading && (
            <div className="mi-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mi-error">
              <p>{error}</p>
              <button className="mi-btn mi-btn-secondary" onClick={fetchMyIdeas}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && ideas.length === 0 && (
            <div className="mi-empty">
              <EmptyStateIcon />
              <h2>No ideas yet</h2>
              <p>Your first big idea is waiting to be shared. Start your journey.</p>
              <Link href="/add-idea" className="mi-btn mi-btn-primary">
                <PlusIcon size={16} />
                Create Your First Idea
              </Link>
            </div>
          )}

          {!loading && !error && ideas.length > 0 && (
            <div className="mi-grid">
              {ideas.map((idea, idx) => (
                <div
                  className="mi-card"
                  key={idea._id}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="mi-card-top">
                    <span className="mi-category">{idea.category || "Uncategorized"}</span>
                    <span className="mi-time">{timeAgo(idea.createdAt)}</span>
                  </div>

                  <h3 className="mi-card-title">{idea.title}</h3>

                  <p className="mi-card-desc">{idea.shortDesc}</p>

                  {idea.tags && idea.tags.length > 0 && (
                    <div className="mi-card-tags">
                      {idea.tags.map((tag) => (
                        <span key={tag} className="mi-card-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="mi-card-actions">
                    <button
                      className="mi-btn-ghost"
                      onClick={() => setEditingIdea(idea)}
                      aria-label="Edit idea"
                      title="Edit"
                    >
                      <EditIcon size={15} />
                    </button>
                    <button
                      className="mi-btn-ghost mi-btn-ghost-danger"
                      onClick={() => setDeletingIdea(idea)}
                      aria-label="Delete idea"
                      title="Delete"
                    >
                      <DeleteIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingIdea && (
        <UpdateModal
          idea={editingIdea}
          onClose={() => setEditingIdea(null)}
          onSaved={() => {
            setEditingIdea(null);
            fetchMyIdeas();
          }}
        />
      )}

      {deletingIdea && (
        <DeleteModal
          idea={deletingIdea}
          onClose={() => setDeletingIdea(null)}
          onDeleted={() => {
            setDeletingIdea(null);
            fetchMyIdeas();
          }}
        />
      )}
    </>
  );
}
