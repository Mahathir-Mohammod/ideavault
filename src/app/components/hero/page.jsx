"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: "slide1",
    title: "Fuel Your Next Big Venture",
    accent: "Venture",
    desc: "Connect with innovators, find early-stage funding, and turn your disruptive concepts into market leaders.",
  },
  {
    id: "slide2",
    title: "Decentralized Crowdfunding",
    accent: "Crowdfunding",
    desc: "Empowering creators to pitch ideas directly to a global community without traditional gatekeepers.",
  },
  {
    id: "slide3",
    title: "AI-Driven Market Validation",
    accent: "Validation",
    desc: "Test your startup hypotheses using real-time predictive analytics and community-driven stress tests.",
  },
];
const STATS = [
  { number: "200+", label: "Ideas" },
  { number: "1K+", label: "Investors" },
  { number: "50+", label: "Experts" },
];

const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_DURATION = 700;
function highlightAccent(text, accentWord) {
  if (!accentWord) return text;
  const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === accentWord.toLowerCase() ? (
      <span key={i} className="text-[var(--text-accent)]">
        {part}
      </span>
    ) : (
      part
    )
  );
}
export default function HeroPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const animTimeoutRef = useRef(null);
  const autoPlayRef = useRef(null);
  const goToSlide = useCallback(
    (index) => {
      if (isAnimating) return;
      if (index === activeIndex) return;

      setIsAnimating(true);

      const total = SLIDES.length;
      const next = ((index % total) + total) % total;

      requestAnimationFrame(() => {
        setActiveIndex(next);

        animTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, TRANSITION_DURATION);
      });
    },
    [activeIndex, isAnimating]
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
        return next;
      });
    }, AUTOPLAY_INTERVAL);
  }, [stopAutoPlay]);

  useEffect(() => {
    if (!isHovered) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return stopAutoPlay;
  }, [isHovered, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (el) el.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 60; // px

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, [goNext, goPrev]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      stopAutoPlay();
    };
  }, [stopAutoPlay]);


  const slide = SLIDES[activeIndex];
  const prevSlide = SLIDES[(activeIndex - 1 + SLIDES.length) % SLIDES.length];
  const nextSlide = SLIDES[(activeIndex + 1) % SLIDES.length];

  return (
    <>
      {/*Embedded styles*/}
      <style>{`
        /* --- Blob pulse --- */
        @keyframes blobPulse {
          0%   { transform: scale(1) translate(0,0); opacity: 0.5; }
          50%  { transform: scale(1.12) translate(12px,-12px); opacity: 0.9; }
          100% { transform: scale(0.95) translate(-8px,8px); opacity: 0.6; }
        }
        @keyframes blobPulse2 {
          0%   { transform: scale(1) translate(0,0); opacity: 0.4; }
          50%  { transform: scale(1.08) translate(-10px,10px); opacity: 0.7; }
          100% { transform: scale(0.92) translate(8px,-8px); opacity: 0.5; }
        }
        /* --- Sparkle --- */
        @keyframes sparkle {
          0%   { opacity: 0.08; transform: scale(0.8) rotate(0deg); }
          100% { opacity: 0.2; transform: scale(1.3) rotate(45deg); }
        }
        /* --- Overline dot pulse --- */
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        /* --- Scroll bounce --- */
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%      { transform: translateY(6px); opacity: 0.3; }
        }
        /* --- Slide content stagger animations --- */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpOverline {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* --- Reduced motion override --- */
        @media (prefers-reduced-motion: reduce) {
          .hero-blob,
          .hero-blob2,
          .hero-sparkle,
          .hero-dot-pulse,
          .hero-scroll-wheel { animation: none !important; }
          .hero-slide-content > * { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Hero Container */}
      <section
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured ideas carousel"
        className="relative flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-page)]"
        style={{
          minHeight: "calc(100vh - var(--nav-height, 72px))",
          paddingTop: "var(--space-4)",
          backgroundImage: "var(--bg-stripe)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Decorative Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="hero-blob absolute rounded-full"
            style={{
              width: "clamp(300px, 50vw, 700px)",
              height: "clamp(300px, 50vw, 700px)",
              top: "8%",
              right: "-10%",
              background:
                "radial-gradient(circle at center, color-mix(in srgb, var(--color-brand-red) 14%, transparent) 0%, transparent 70%)",
              animation: "blobPulse 8s ease-in-out infinite alternate",
              willChange: "transform",
            }}/>
          <div
            className="hero-blob2 absolute rounded-full hidden md:block"
            style={{
              width: "clamp(250px, 40vw, 500px)",
              height: "clamp(250px, 40vw, 500px)",
              bottom: "5%",
              left: "-15%",
              background:
                "radial-gradient(circle at center, color-mix(in srgb, var(--color-brand-red) 9%, transparent) 0%, transparent 70%)",
              animation: "blobPulse2 10s ease-in-out infinite alternate-reverse",
              willChange: "transform",
            }}
          />

          {/* Decorative dots*/}
          <div className="absolute top-[12%] left-[5%] grid grid-cols-2 gap-3 opacity-40 z-0 max-md:hidden">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-brand-red)", opacity: 0.3 }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ border: "1.5px solid var(--dot-outline)", opacity: 0.3 }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ border: "1.5px solid var(--dot-outline)", opacity: 0.3 }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-brand-red)", opacity: 0.3 }}
            />
          </div>

          <div
            className="hero-sparkle absolute top-[20%] right-[8%] max-md:hidden"
            style={{
              color: "var(--sparkle-color)",
              fontSize: "1.25rem",
              opacity: 0.12,
              animation: "sparkle 3s ease-in-out infinite alternate",
            }}
          >
            ✦
          </div>
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
            style={{
              height: "40%",
              background:
                "linear-gradient(to top, var(--bg-page) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Slide Container */}
        <div className="relative w-full max-w-[var(--container-max)] mx-auto px-[var(--container-pad)] flex-1 flex items-center justify-center z-[var(--z-raised)]" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-12)" }}>
          <div
            className="absolute inset-0 flex items-center justify-center px-[var(--container-pad)] py-8 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0 }}
          >
            <div className="max-w-[820px] text-center mx-auto">
              <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--text-muted)] mb-6">
                {prevSlide.title}
              </span>
            </div>
          </div>

          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${activeIndex + 1} of ${SLIDES.length}`}
            aria-live="polite"
            className="hero-slide-content absolute inset-0 flex items-center justify-center px-[var(--container-pad)] py-12 md:py-16"
          >
            <div className="w-full max-w-[880px] text-center mx-auto">
              <div
                className="hero-overline"
                style={{
                  animation: isAnimating
                    ? "fadeUpOverline 0.5s ease-out 0.1s both"
                    : "fadeUpOverline 0.5s ease-out 0.1s both",
                  marginBottom: "var(--space-8)",
                }}
              >
                <span className="inline-flex items-center gap-3 font-[var(--font-body)] text-xs font-semibold tracking-[0.18em] uppercase text-[var(--text-muted)]">
                  <span
                    className="hero-dot-pulse inline-block w-[0.375rem] h-[0.375rem] rounded-full"
                    style={{
                      backgroundColor: "var(--color-brand-red)",
                      animation: "dotPulse 2s ease-in-out infinite",
                    }}
                  />
                  IdeaVault Presents
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-[var(--font-display)] text-[var(--text-hero)] font-[var(--fw-extrabold)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--text-primary)]"
                style={{
                  marginBottom: "var(--space-8)",
                  animation: isAnimating
                    ? "fadeUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both"
                    : "fadeUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
                }}
              >
                {highlightAccent(slide.title, slide.accent)}
              </h1>

              {/* Description */}
              <p
                className="font-[var(--font-body)] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-[var(--text-secondary)] max-w-[640px] mx-auto"
                style={{
                  marginBottom: "var(--space-12)",
                  animation: isAnimating
                    ? "fadeUp 0.5s ease-out 0.35s both"
                    : "fadeUp 0.5s ease-out 0.35s both",
                }}
              >
                {slide.desc}
              </p>

              {/* CTA Group */}
              <div
                className="flex flex-wrap items-center justify-center gap-5 md:gap-6 max-sm:flex-col max-sm:w-full"
                style={{
                  animation: isAnimating
                    ? "fadeUp 0.5s ease-out 0.45s both"
                    : "fadeUp 0.5s ease-out 0.45s both",
                }}
              >
                <Link
                  href="/ideas"
                  className="btn btn-primary max-sm:w-full"
                >
                  Explore Ideas
                </Link>
                <button className="btn btn-secondary max-sm:w-full">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Next slide */}
          <div
            className="absolute inset-0 flex items-center justify-center px-[var(--container-pad)] py-8 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0 }}
          >
            <div className="max-w-[820px] text-center mx-auto">
              <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--text-muted)] mb-6">
                {nextSlide.title}
              </span>
            </div>
          </div>
        </div>

       

        {/*Navigation Row*/}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 md:gap-10 z-[var(--z-raised)]">
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="hero-nav-btn flex items-center justify-center w-11 h-11 rounded-full border text-sm cursor-pointer shrink-0 max-sm:hidden"
            style={{
              borderColor: "var(--border-default)",
              backgroundColor: "color-mix(in srgb, var(--bg-page) 70%, transparent)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "var(--text-secondary)",
              transition:
                "background-color 250ms var(--ease-out), border-color 250ms var(--ease-out), color 250ms var(--ease-out), transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--bg-surface) 80%, transparent)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--bg-page) 70%, transparent)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.92)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
          >
            ❮
          </button>

          {/* Dots */}
          <div className="flex items-center gap-3" role="tablist" aria-label="Slide indicators">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}`}
                className="border-none p-0 cursor-pointer shrink-0 rounded-full transition-all duration-[var(--duration-base)]"
                style={{
                  width: i === activeIndex ? "1.75rem" : "0.625rem",
                  height: "0.625rem",
                  backgroundColor:
                    i === activeIndex
                      ? "var(--dot-filled)"
                      : "var(--dot-outline)",
                  borderRadius: i === activeIndex ? "999px" : "9999px",
                  transform: i === activeIndex ? "scaleY(1.15)" : "scaleY(1)",
                  transition:
                    "background-color 250ms var(--ease-out), width 250ms var(--ease-out), transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={(e) => {
                  if (i !== activeIndex) {
                    e.currentTarget.style.backgroundColor =
                      "var(--text-muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (i !== activeIndex) {
                    e.currentTarget.style.backgroundColor =
                      "var(--dot-outline)";
                  }
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="hero-nav-btn flex items-center justify-center w-11 h-11 rounded-full border text-sm cursor-pointer shrink-0 max-sm:hidden"
            style={{
              borderColor: "var(--border-default)",
              backgroundColor: "color-mix(in srgb, var(--bg-page) 70%, transparent)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "var(--text-secondary)",
              transition:
                "background-color 250ms var(--ease-out), border-color 250ms var(--ease-out), color 250ms var(--ease-out), transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--bg-surface) 80%, transparent)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--bg-page) 70%, transparent)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.92)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
          >
            ❯
          </button>
        </div>
      </section>
    </>
  );
}
