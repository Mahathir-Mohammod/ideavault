"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";


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

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-brand-red)" }}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CommentIcon({ count }) {
  return (
    <span className="ti-comment-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      {count}
    </span>
  );
}

function FireIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-brand-red)" }}>
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-3.866 3-8 7-13 4 5 7 9.134 7 13 0 3.866-3.134 7-7 7z" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="ti-skel-card">
      <div className="ti-skel-row">
        <div className="ti-skel-cat" />
        <div className="ti-skel-time" />
      </div>
      <div className="ti-skel-title" />
      <div className="ti-skel-desc" />
      <div className="ti-skel-desc short" />
      <div className="ti-skel-tags">
        <div className="ti-skel-tag" />
        <div className="ti-skel-tag" />
      </div>
      <div className="ti-skel-divider" />
      <div className="ti-skel-btn-row">
        <div className="ti-skel-btn" />
      </div>
    </div>
  );
}

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/ideas/trending`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch trending ideas");
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

    fetchTrending();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="ti-section">
      <div className="ti-container">
        <div className="ti-header">
          <div className="ti-overline">
            <FireIcon />
            Trending Now
          </div>
          <h2 className="ti-title">
            <em>Trending</em> Ideas
          </h2>
          <p className="ti-subtitle">
            The most talked-about ideas in the community right now.
          </p>
        </div>

        {loading && (
          <div className="ti-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="ti-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && ideas.length === 0 && (
          <div className="ti-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <h3>No trending ideas yet</h3>
            <p>Ideas with the most engagement will appear here.</p>
          </div>
        )}

        {!loading && !error && ideas.length > 0 && (
          <div className="ti-grid">
            {ideas.map((idea, idx) => (
              <div
                className="ti-card"
                key={idea._id}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="ti-card-top">
                  <span className="ti-badge">{idea.category || "Uncategorized"}</span>
                  <div className="ti-card-meta">
                    <CommentIcon count={idea.commentCount || 0} />
                    <span className="ti-time">{timeAgo(idea.createdAt)}</span>
                  </div>
                </div>

                <h3 className="ti-card-title">{idea.title}</h3>
                <p className="ti-card-desc">{idea.shortDesc}</p>
                <div className="ti-card-info">
                  {idea.authorName && (
                    <span className="ti-author">by {idea.authorName}</span>
                  )}
                  {idea.tags && idea.tags.length > 0 && (
                    <span className="ti-tag">{idea.tags[0]}</span>
                  )}
                </div>

                <div className="ti-card-divider" />
                
                <div className="ti-card-footer">
                  <Link href={`/ideas/${idea._id}`} className="ti-view-btn">
                    View Details
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
