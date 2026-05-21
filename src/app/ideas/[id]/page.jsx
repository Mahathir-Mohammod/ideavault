"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "react-hot-toast";


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

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ArrowLeftIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function SendIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function EditIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
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

function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function MessageIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function EmptyCommentIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <path d="M8 9h8M8 13h6" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className="id-page">
      <div className="id-container">
        <div className="id-skeleton">
          <div className="id-skel-back" />
          <div className="id-skel-cat" />
          <div className="id-skel-title" />
          <div className="id-skel-desc wide" />
          <div className="id-skel-desc" />
          <div className="id-skel-desc wide" />
          <div className="id-skel-tags">
            <div className="id-skel-tag" />
            <div className="id-skel-tag" />
            <div className="id-skel-tag" />
          </div>
          <div className="id-skel-divider" />
          <div className="id-skel-section" />
          <div className="id-skel-desc wide" />
          <div className="id-skel-desc" />
          <div className="id-skel-desc wide" />
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ comment, onClose, onConfirm, deleting }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="id-modal-overlay" onClick={handleBackdropClick}>
      <div className="id-modal">
        <div className="id-modal-header">
          <h3 className="id-modal-title">Delete Comment</h3>
          <button className="id-modal-close" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="id-modal-body">
          <div className="id-modal-icon">
            <TrashIcon size={24} />
          </div>
          <p className="id-modal-text">Are you sure you want to delete this comment?</p>
          {comment && (
            <p className="id-modal-preview">&ldquo;{comment.text.slice(0, 100)}{comment.text.length > 100 ? "…" : ""}&rdquo;</p>
          )}
          <p className="id-modal-sub">This action cannot be undone.</p>
        </div>
        <div className="id-modal-actions">
          <button
            type="button"
            className="id-btn id-btn-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="id-btn id-btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="id-spinner-sm" />
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

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete
  const [deletingComment, setDeletingComment] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* Fetch Idea */
  const fetchIdea = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("NOT_FOUND");
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch idea");
      }
      const data = await res.json();
      setIdea(data.idea || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ideas/${id}`, {
          credentials: "include",
        });
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 404) throw new Error("NOT_FOUND");
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch idea");
        }
        const data = await res.json();
        if (!cancelled) setIdea(data.idea || data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [session, id]);

  /* Auth Redirect */
  useEffect(() => {
    if (!authPending && !session) {
      router.push(`/login?redirect=/ideas/${id}`);
    }
  }, [session, authPending, router, id]);

  /* Comment Handlers */
  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add comment");
      setIdea((prev) => ({
        ...prev,
        comments: [data.comment || data, ...(prev.comments || [])],
      }));
      setCommentText("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId) => {
    const text = editText.trim();
    if (!text) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update comment");
      setIdea((prev) => ({
        ...prev,
        comments: (prev.comments || []).map((c) =>
          c._id === commentId ? { ...c, text: data.comment?.text || data.text || text, updatedAt: new Date().toISOString() } : c
        ),
      }));
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingComment) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${id}/comments/${deletingComment._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }
      setIdea((prev) => ({ ...prev,
        comments: (prev.comments || []).filter((c) => c._id !== deletingComment._id),
      }));
      setDeletingComment(null);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  /* Auth Guard */

  if (authPending) return <LoadingSkeleton />;
  if (!session) return null;

  /*  Loading / Error / Not Found */

  if (loading) return <LoadingSkeleton />;

  if (error === "NOT_FOUND") {
    return (
      <div className="id-page">
        <div className="id-container">
          <div className="id-error">
            <div className="id-error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01" />
              </svg>
            </div>
            <h2>Idea not found</h2>
            <p>This idea doesn't exist or has been removed.</p>
            <Link href="/ideas" className="id-btn id-btn-primary">
              Back to Ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="id-page">
        <div className="id-container">
          <div className="id-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="id-btn id-btn-primary" onClick={fetchIdea}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) return <LoadingSkeleton />;

  const comments = idea.comments || [];
  const userId = session.user.id;

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

      <div className="id-page">
        <div className="id-container">
          <Link href="/ideas" className="id-back-btn">
            <ArrowLeftIcon size={16} />
            Back to Ideas
          </Link>
          <div className="id-header">
            <div className="id-header-top">
              <span className="id-category">{idea.category || "Uncategorized"}</span>
              <span className="id-time">{timeAgo(idea.createdAt)}</span>
            </div>
            <h1 className="id-title">{idea.title}</h1>
            {idea.authorName && (
              <p className="id-author">
                by <span className="id-author-name">{idea.authorName}</span>
              </p>
            )}
            {idea.tags && idea.tags.length > 0 && (
              <div className="id-tags">
                {idea.tags.map((tag) => (
                  <span key={tag} className="id-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="id-body">
            {idea.imageUrl && (
              <div className="id-image-wrap">
                <img
                  src={idea.imageUrl}
                  alt={idea.title}
                  className="id-image"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}

            <div className="id-description">
              <p>{idea.shortDesc}</p>
            </div>

            {idea.detailedDesc && (
              <div className="id-section">
                <h3 className="id-section-title">Detailed Description</h3>
                <div className="id-section-content">
                  {idea.detailedDesc.split("\n").map((line, i) => (
                    <p key={i}>{line || "\u00A0"}</p>
                  ))}
                </div>
              </div>
            )}

            {(idea.problemStatement || idea.proposedSolution || idea.targetAudience || idea.budget) && (
              <div className="id-detail-grid">
                {idea.problemStatement && (
                  <div className="id-detail-item">
                    <h4 className="id-detail-label">Problem Statement</h4>
                    <p className="id-detail-text">{idea.problemStatement}</p>
                  </div>
                )}
                {idea.proposedSolution && (
                  <div className="id-detail-item">
                    <h4 className="id-detail-label">Proposed Solution</h4>
                    <p className="id-detail-text">{idea.proposedSolution}</p>
                  </div>
                )}
                {idea.targetAudience && (
                  <div className="id-detail-item">
                    <h4 className="id-detail-label">Target Audience</h4>
                    <p className="id-detail-text">{idea.targetAudience}</p>
                  </div>
                )}
                {idea.budget && (
                  <div className="id-detail-item">
                    <h4 className="id-detail-label">Estimated Budget</h4>
                    <p className="id-detail-text">${Number(idea.budget).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="id-meta-footer">
              <span className="id-meta-label">Posted on {formatDate(idea.createdAt)}</span>
              {idea.updatedAt !== idea.createdAt && (
                <span className="id-meta-label">· Updated {timeAgo(idea.updatedAt)}</span>
              )}
            </div>
          </div>
          <div className="id-comment-section">
            <div className="id-comment-header">
              <MessageIcon size={18} />
              <h2>Comments</h2>
              <span className="id-comment-count">{comments.length}</span>
            </div>
            <form className="id-comment-form" onSubmit={handleAddComment}>
              <textarea
                className="id-cf-textarea"
                placeholder="Share your thoughts on this idea…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
                rows={3}
                disabled={submitting}
                required
              />
              <div className="id-cf-actions">
                <span className="id-cf-counter">{commentText.length}/500</span>
                <button
                  type="submit"
                  className="id-cf-btn"
                  disabled={submitting || !commentText.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="id-spinner-sm" />
                      Posting…
                    </>
                  ) : (
                    <>
                      <SendIcon size={14} />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </form>

            {comments.length === 0 ? (
              <div className="id-empty">
                <EmptyCommentIcon />
                <p className="id-empty-text">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="id-comment-list">
                {comments.map((comment) => {
                  const isOwn = comment.userId === userId;
                  const isEditing = editingId === comment._id;

                  return (
                    <div className="id-comment" key={comment._id}>
                      <div className="id-c-avatar">
                        {comment.userName
                          ? comment.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                          : "U"
                        }
                      </div>
                      <div className="id-c-body">
                        <div className="id-c-info">
                          <span className="id-c-name">{comment.userName || "Unknown"}</span>
                          <span className="id-c-time">
                            {timeAgo(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt && " · edited"}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="id-ce-wrap">
                            <textarea
                              className="id-ce-textarea"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              maxLength={500}
                              rows={3}
                              disabled={savingEdit}
                              autoFocus
                            />
                            <div className="id-ce-actions">
                              <button
                                type="button"
                                className="id-ce-cancel"
                                onClick={handleCancelEdit}
                                disabled={savingEdit}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="id-ce-save"
                                onClick={() => handleSaveEdit(comment._id)}
                                disabled={savingEdit || !editText.trim()}
                              >
                                {savingEdit ? (
                                  <>
                                    <span className="id-spinner-sm" />
                                    Saving…
                                  </>
                                ) : (
                                  <>
                                    <CheckIcon size={12} />
                                    Save
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="id-c-text">{comment.text}</p>
                        )}

                        {isOwn && !isEditing && (
                          <div className="id-c-actions">
                            <button
                              className="id-c-btn id-c-btn-edit"
                              onClick={() => handleStartEdit(comment)}
                              aria-label="Edit comment"
                              title="Edit"
                            >
                              <EditIcon size={12} />
                              Edit
                            </button>
                            <button
                              className="id-c-btn id-c-btn-delete"
                              onClick={() => setDeletingComment(comment)}
                              aria-label="Delete comment"
                              title="Delete"
                            >
                              <TrashIcon size={12} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {deletingComment && (
        <DeleteModal
          comment={deletingComment}
          onClose={() => setDeletingComment(null)}
          onConfirm={handleDeleteComment}
          deleting={deleting}
        />
      )}
    </>
  );
}