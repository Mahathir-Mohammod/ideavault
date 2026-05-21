"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

function MessageIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function EmptyInteractionsIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <path d="M8 9h8M8 13h6" />
      <circle cx="12" cy="12" r="9" strokeDasharray="2 4" />
    </svg>
  );
}

function CommentBadgeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="ix-card ix-skeleton-card">
      <div className="ix-skel-row">
        <div className="ix-skel-cat" />
        <div className="ix-skel-time" />
      </div>
      <div className="ix-skel-title" />
      <div className="ix-skel-desc" />
      <div className="ix-skel-desc short" />
      <div className="ix-skel-tags">
        <div className="ix-skel-tag" />
        <div className="ix-skel-tag" />
      </div>
      <div className="ix-skel-divider" />
      <div className="ix-skel-comment" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="ix-page">
      <div className="ix-container">
        <div className="ix-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyInteractionsPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInteractions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/ideas/interacted", {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch interactions");
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
      router.push("/login?redirect=/my-interactions");
      return;
    }
    if (!session) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ideas/interacted", {
          credentials: "include",
        });
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch interactions");
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

  if (authPending) return <LoadingSkeleton />;
  if (!session) return null;

  if (loading) {
    return (
      <>
        <Toaster />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Toaster />
        <div className="ix-page">
          <div className="ix-container">
            <div className="ix-error">
              <p>{error}</p>
              <button className="ix-btn ix-btn-secondary" onClick={fetchInteractions}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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

      <div className="ix-page">
        <div className="ix-container">
          <div className="ix-header">
            <div className="ix-header-left">
              <div className="ix-overline">
                <MessageIcon size={14} />
                My Activity
              </div>
              <h1>My Interactions</h1>
              <p>
                {loading
                  ? "Loading…"
                  : `You have commented on ${ideas.length} idea${ideas.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Empty State */}
          {!loading && !error && ideas.length === 0 && (
            <div className="ix-empty">
              <EmptyInteractionsIcon />
              <h2>No interactions yet</h2>
              <p>Start engaging with the community by commenting on ideas that inspire you.</p>
              <Link href="/ideas" className="ix-btn ix-btn-primary">
                Browse Ideas
              </Link>
            </div>
          )}

          {!loading && !error && ideas.length > 0 && (
            <div className="ix-grid">
              {ideas.map((idea, idx) => (
                <div
                  className="ix-card"
                  key={idea._id}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="ix-card-top">
                    <span className="ix-category">{idea.category || "Uncategorized"}</span>
                    <span className="ix-time">{timeAgo(idea.createdAt)}</span>
                  </div>

                  <h3 className="ix-card-title">{idea.title}</h3>
                  <p className="ix-card-desc">{idea.shortDesc}</p>

                  {idea.tags && idea.tags.length > 0 && (
                    <div className="ix-card-tags">
                      {idea.tags.map((tag) => (
                        <span key={tag} className="ix-card-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Commented Badge */}
                  <div className="ix-badge-row">
                    <span className="ix-commented-badge">
                      <CommentBadgeIcon size={12} />
                      {idea.userComments?.length || 0} comment{(idea.userComments?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <span className="ix-total-comments">
                      {idea.commentCount || 0} total
                    </span>
                  </div>
                  {idea.userComments && idea.userComments.length > 0 && (
                    <div className="ix-comment-preview">
                      <p className="ix-cp-label">Your latest comment</p>
                      <p className="ix-cp-text">
                        &ldquo;{idea.userComments[idea.userComments.length - 1].text.slice(0, 120)}
                        {idea.userComments[idea.userComments.length - 1].text.length > 120 ? "…" : ""}&rdquo;
                      </p>
                      <span className="ix-cp-time">
                        {timeAgo(idea.userComments[idea.userComments.length - 1].createdAt)}
                      </span>
                    </div>
                  )}

                  <div className="ix-card-divider" />

                  {/* View Details CTA */}
                  <div className="ix-card-footer">
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="ix-view-btn"
                    >
                      View Idea
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
