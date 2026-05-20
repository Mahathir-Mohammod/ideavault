/* eslint-disable @next/next/no-html-link-for-pages */
import "./globals.css";

export const metadata = {
  title: "404 \u2014 This Page Ghosted Us",
  description: "The page you're looking for pulled a disappearing act.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{
        backgroundColor: "var(--bg-page)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        margin: 0,
        padding: "1.5rem",
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "520px",
        }}>
          <div style={{
            fontSize: "clamp(6rem, 15vw, 10rem)",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            lineHeight: 1,
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-brand-red)",
            marginBottom: "0.25rem",
          }}>
            404
          </div>
          <p style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-secondary)",
            fontWeight: 500,
            marginBottom: "0.5rem",
          }}>
            This page {"doesn't"} exist.
          </p>
          <p style={{
            fontSize: "var(--text-base)",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}>
            Either <strong style={{ color: "var(--text-primary)" }}>you</strong> typed a wrong URL, <br />
            or <strong style={{ color: "var(--text-primary)" }}>the idea</strong> was so brilliant it evaporated into the void. <br />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              (Probably the first one. {"Let's"} be real.)
            </span>
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/"
              className="btn btn-primary"
              style={{
                textDecoration: "none",
                fontSize: "var(--text-sm)",
                padding: "var(--space-3) var(--space-6)",
              }}
            >
              Take Me Home
            </a>
          </div>

          <p style={{
            marginTop: "3rem",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
          }}>
            Error 404 &middot; Idea Not Found &middot; Plz Try Again
          </p>
        </div>
      </body>
    </html>
  );
}