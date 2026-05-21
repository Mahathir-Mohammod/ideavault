"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
  "FinTech", "HealthTech", "EdTech", "CleanTech", "AI / ML",
  "Web3 / Crypto", "SaaS", "E-Commerce", "Social", "Other",
];

function Counter({ end, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1200;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div
      ref={ref}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: "var(--fw-extrabold)",
          color: "var(--text-primary)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {count.toLocaleString()}{end >= 1000 ? "+" : ""}
      </span>
      <span
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--text-muted)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
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
        onClick={() => document.getElementById("tag-input-field").focus()}
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
          id="tag-input-field"
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
        {tags.length}/8 tags · 2–25 chars each · press Enter or comma to add
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

export default function AddIdeaPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();

  const [form, setForm] = useState({
    title: "", shortDesc: "", detailedDesc: "", category: "",
    imageUrl: "", budget: "", targetAudience: "",
    problemStatement: "", proposedSolution: "",
  });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (!authPending && !session) {
      router.push("/login?redirect=/add-idea");
    }
  }, [session, authPending, router]);

  if (authPending) return null;
  if (!session) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm({
      title: "", shortDesc: "", detailedDesc: "", category: "",
      imageUrl: "", budget: "", targetAudience: "",
      problemStatement: "", proposedSolution: "",
    });
    setTags([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas`, {
        method: "POST",
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

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit idea");
      }

      toast.success("Submit done");
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    border: `1.5px solid ${focused === name ? "var(--color-brand-red)" : "var(--border-default)"}`,
    borderRadius: "var(--radius-md)",
    padding: "var(--space-3) var(--space-4)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    outline: "none",
    resize: "none",
    transition: "border-color 250ms ease",
  });

  return (
    <>

      <div className="add-idea-page">
        <aside className="ai-left">
          <div className="ai-overline">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Share Your Vision
          </div>

          <h1 className="ai-hero">
            Spark your<br />
            next <em>big idea</em>
          </h1>

          <p className="ai-sub">
            Every groundbreaking startup began as a single thought. Give your idea
            the stage it deserves — the community is ready to listen, collaborate,
            and bring it to life.
          </p>

          <div className="ai-stats">
            <Counter end={10000} label="Ideas Shared" />
            <Counter end={2400} label="Startups Born" />
            <Counter end={48} label="Avg. First Feedback" />
            <Counter end={12} label="Categories" />
          </div>
        </aside>

        <main className="ai-right">
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
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--color-brand-red)",
                  secondary: "#fff",
                },
              },
            }}
          />
          <div className="ai-form-card">
            <div style={{ textAlign: "center" }}>
              <div className="ai-form-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h2 className="ai-form-title">Submit Your Idea</h2>
              <p className="ai-form-sub">Fill in the details below to share your startup idea</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ai-fields">
                <Field label="Idea Title" counter={form.title.length} maxLen={120}>
                  <input
                    placeholder="e.g. AI-powered mental health companion"
                    maxLength={120}
                    value={form.title}
                    onChange={set("title")}
                    onFocus={() => setFocused("title")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("title")}
                    required
                  />
                </Field>

                <Field label="Short Description" counter={form.shortDesc.length} maxLen={300}>
                  <textarea
                    placeholder="A one-line pitch that captures your idea (10–300 chars)"
                    maxLength={300}
                    rows={2}
                    value={form.shortDesc}
                    onChange={set("shortDesc")}
                    onFocus={() => setFocused("shortDesc")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("shortDesc")}
                    required
                  />
                </Field>

                <Field label="Detailed Description" counter={form.detailedDesc.length} maxLen={5000}>
                  <textarea
                    placeholder="Describe your idea in detail — what it does, how it works, and why it matters (min 50 chars)"
                    maxLength={5000}
                    rows={4}
                    value={form.detailedDesc}
                    onChange={set("detailedDesc")}
                    onFocus={() => setFocused("detailedDesc")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("detailedDesc")}
                    required
                  />
                </Field>

                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={set("category")}
                    onFocus={() => setFocused("category")}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("category"), appearance: "none", cursor: "pointer" }}
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
                    placeholder="https://example.com/your-idea-preview.jpg"
                    value={form.imageUrl}
                    onChange={set("imageUrl")}
                    onFocus={() => setFocused("imageUrl")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("imageUrl")}
                  />
                </Field>

                <Field label="Estimated Budget" optional>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={form.budget}
                    onChange={set("budget")}
                    onFocus={() => setFocused("budget")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("budget")}
                  />
                </Field>

                <SectionDivider label="problem & solution" />

                <Field label="Target Audience" counter={form.targetAudience.length} maxLen={200}>
                  <input
                    placeholder="e.g. College students, remote workers, pet owners"
                    maxLength={200}
                    value={form.targetAudience}
                    onChange={set("targetAudience")}
                    onFocus={() => setFocused("targetAudience")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("targetAudience")}
                  />
                </Field>

                <Field label="Problem Statement" counter={form.problemStatement.length} maxLen={2000}>
                  <textarea
                    placeholder="What specific problem does your idea solve? Who experiences it and why is it important? (min 20 chars)"
                    maxLength={2000}
                    rows={4}
                    value={form.problemStatement}
                    onChange={set("problemStatement")}
                    onFocus={() => setFocused("problemStatement")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("problemStatement")}
                  />
                </Field>

                <Field label="Proposed Solution" counter={form.proposedSolution.length} maxLen={2000}>
                  <textarea
                    placeholder="How does your solution address the problem? Describe your approach and key differentiators (min 20 chars)"
                    maxLength={2000}
                    rows={4}
                    value={form.proposedSolution}
                    onChange={set("proposedSolution")}
                    onFocus={() => setFocused("proposedSolution")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("proposedSolution")}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="ai-submit"
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      Launch Idea
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}