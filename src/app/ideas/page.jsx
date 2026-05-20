"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "react-hot-toast";

const CATEGORIES = [
  "All",
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

function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function PlusIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      <circle cx="12" cy="12" r="9" strokeDasharray="2 4" />
    </svg>
  );
}

function NoResultsIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-brand-red)" }}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="ip-skel-card">
      <div className="ip-skel-row">
        <div className="ip-skel-cat" />
        <div className="ip-skel-time" />
      </div>
      <div className="ip-skel-title" />
      <div className="ip-skel-desc" />
      <div className="ip-skel-desc short" />
      <div className="ip-skel-tags">
        <div className="ip-skel-tag" />
        <div className="ip-skel-tag" />
        <div className="ip-skel-tag" />
      </div>
      <div className="ip-skel-divider" />
      <div className="ip-skel-btn-row">
        <div className="ip-skel-btn" />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="ip-auth-skel">
      <div className="ip-auth-spinner" />
    </div>
  );
}
/*MAIN IDEAS PAGE */
export default function IdeasPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredCount, setFilteredCount] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    if (!authPending && !session) {
      router.push("/login?redirect=/ideas");
    }
  }, [session, authPending, router]);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/ideas", {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch ideas");
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.ideas || [];
      setIdeas(list);
      setFilteredCount(list.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ideas", {
          credentials: "include",
        });
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch ideas");
        }
        const data = await res.json();
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data.ideas || [];
          setIdeas(list);
          setFilteredCount(list.length);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [session]);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      !searchQuery.trim() ||
      idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      idea.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalFiltered = filteredIdeas.length;

  const updateScrollState = useCallback(() => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollCategories = useCallback((direction) => {
    const el = categoriesRef.current;
    if (!el) return;
    const scrollAmount = 240;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 300);
  }, [updateScrollState]);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  if (authPending) return <LoadingSpinner />;
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
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error: { iconTheme: { primary: "var(--color-brand-red)", secondary: "#fff" } },
        }}
      />

      <div className="ip-page">
        <div className="ip-container">
          {/* ─── Page Header ─── */}
          <div className="ip-header">
            <div className="ip-overline">
              <SparkleIcon />
              Explore Innovation
            </div>
            <h1 className="ip-title">
              Discover <em>Ideas</em>
            </h1>
            <p className="ip-subtitle">
              Browse groundbreaking startup ideas from the community. Find your next big opportunity.
            </p>
          </div>

          {/* ─── Search & Filter Bar ─── */}
          <div className="ip-search-section">
            <div className="ip-search-wrap">
              <span className="ip-search-icon">
                <SearchIcon size={20} />
              </span>
              <input
                ref={searchRef}
                type="text"
                className="ip-search-input"
                placeholder="Search ideas by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search ideas"
              />
            </div>

            <div className="ip-categories-wrap">
              {/* Left scroll arrow */}
              {canScrollLeft && (
                <button
                  className="ip-scroll-arrow ip-scroll-left"
                  onClick={() => scrollCategories("left")}
                  aria-label="Scroll categories left"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
              <div className="ip-categories" ref={categoriesRef} role="tablist" aria-label="Filter by category">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    className={`ip-cat-pill${selectedCategory === cat ? " active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Right scroll arrow */}
              {canScrollRight && (
                <button
                  className="ip-scroll-arrow ip-scroll-right"
                  onClick={() => scrollCategories("right")}
                  aria-label="Scroll categories right"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ─── Data Loading ─── */}
          {loading && (
            <div className="ip-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ─── Error State ─── */}
          {!loading && error && (
            <div className="ip-error">
              <p>{error}</p>
              <button className="ip-retry-btn" onClick={fetchIdeas}>
                Try Again
              </button>
            </div>
          )}

          {/* ─── Loaded with Data ─── */}
          {!loading && !error && ideas.length > 0 && (
            <>
              {/* Meta bar */}
              <div className="ip-meta">
                <div className="ip-meta-count">
                  <span className="ip-meta-dot" />
                  {totalFiltered === ideas.length
                    ? `${ideas.length} idea${ideas.length !== 1 ? "s" : ""}`
                    : `Showing ${totalFiltered} of ${ideas.length} ideas`}
                </div>
                {(searchQuery || selectedCategory !== "All") && totalFiltered === 0 && (
                  <button
                    className="ip-clear-btn"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Empty search results */}
              {totalFiltered === 0 ? (
                <div className="ip-empty">
                  <NoResultsIcon />
                  <h2>No ideas match your search</h2>
                  <p>Try different keywords or browse all categories to find what you are looking for.</p>
                  <button
                    className="ip-empty-btn"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); searchRef.current?.focus(); }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* Ideas Grid */
                <div className="ip-grid">
                  {filteredIdeas.map((idea, idx) => (
                    <div
                      className="ip-card"
                      key={idea._id}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      {/* Top row: category + time */}
                      <div className="ip-card-top">
                        <span className="ip-category">{idea.category || "Uncategorized"}</span>
                        <span className="ip-time">{timeAgo(idea.createdAt)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="ip-card-title">{idea.title}</h3>

                      {/* Short description */}
                      <p className="ip-card-desc">{idea.shortDesc}</p>

                      {/* Tags */}
                      {idea.tags && idea.tags.length > 0 && (
                        <div className="ip-card-tags">
                          {idea.tags.map((tag) => (
                            <span key={tag} className="ip-card-tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Divider */}
                      <div className="ip-card-divider" />

                      {/* View Details CTA */}
                      <div className="ip-card-footer">
                        <Link
                          href={`/ideas/${idea._id}`}
                          className="ip-view-btn"
                        >
                          View Details
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── Empty State (no ideas at all) ─── */}
          {!loading && !error && ideas.length === 0 && (
            <div className="ip-empty">
              <EmptyIcon />
              <h2>No ideas yet</h2>
              <p>The community is just getting started. Be the first to share your groundbreaking idea.</p>
              <Link href="/add-idea" className="ip-empty-btn">
                <PlusIcon size={18} />
                Share Your Idea
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
