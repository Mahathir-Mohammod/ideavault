"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      showToast(error.message || "Invalid email or password. Please try again.", "error");
      setIsLoading(false);
      return;
    }
    showToast("Login successful! Redirecting...", "success");
    setTimeout(() => router.push("/"), 1000);
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        :root,
        [data-theme="light"] {
          --auth-page-bg:       #f4f5f7;
          --auth-glow-a:        rgba(99,102,241,0.10);
          --auth-glow-b:        rgba(168,85,247,0.07);

          --auth-card-bg:       rgba(255,255,255,0.88);
          --auth-card-border:   rgba(0,0,0,0.07);
          --auth-card-shadow:   0 24px 48px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9);

          --auth-heading:       #0f0f14;
          --auth-sub:           rgba(15,15,20,0.45);
          --auth-label:         rgba(15,15,20,0.55);
          --auth-footer:        rgba(15,15,20,0.40);

          --auth-input-bg:      rgba(0,0,0,0.03);
          --auth-input-bd:      rgba(0,0,0,0.10);
          --auth-input-color:   #0f0f14;
          --auth-input-ph:      rgba(0,0,0,0.22);
          --auth-focus-bg:      rgba(99,102,241,0.05);
          --auth-focus-bd:      rgba(99,102,241,0.50);
          --auth-focus-sh:      0 0 0 3px rgba(99,102,241,0.10);

          --auth-google-bg:     rgba(0,0,0,0.03);
          --auth-google-bd:     rgba(0,0,0,0.10);
          --auth-google-color:  rgba(15,15,20,0.80);
          --auth-google-hbg:    rgba(0,0,0,0.06);
          --auth-google-hbd:    rgba(0,0,0,0.16);

          --auth-div-line:      rgba(0,0,0,0.08);
          --auth-div-text:      rgba(0,0,0,0.28);

          --auth-eye:           rgba(0,0,0,0.28);
          --auth-eye-hover:     rgba(0,0,0,0.65);

          --auth-forgot:        rgba(99,102,241,0.80);
          --auth-forgot-hover:  #6366f1;

          --auth-link:          #6366f1;
          --auth-link-hover:    #4f46e5;

          --auth-toast-err-bg:  rgba(239,68,68,0.10);
          --auth-toast-err-bd:  rgba(239,68,68,0.25);
          --auth-toast-err-txt: #b91c1c;
          --auth-toast-ok-bg:   rgba(34,197,94,0.10);
          --auth-toast-ok-bd:   rgba(34,197,94,0.25);
          --auth-toast-ok-txt:  #15803d;
        }
        [data-theme="dark"] {
          --auth-page-bg:       #0a0a0f;
          --auth-glow-a:        rgba(99,102,241,0.18);
          --auth-glow-b:        rgba(168,85,247,0.12);

          --auth-card-bg:       rgba(255,255,255,0.03);
          --auth-card-border:   rgba(255,255,255,0.08);
          --auth-card-shadow:   0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);

          --auth-heading:       #ffffff;
          --auth-sub:           rgba(255,255,255,0.38);
          --auth-label:         rgba(255,255,255,0.55);
          --auth-footer:        rgba(255,255,255,0.30);

          --auth-input-bg:      rgba(255,255,255,0.04);
          --auth-input-bd:      rgba(255,255,255,0.08);
          --auth-input-color:   #ffffff;
          --auth-input-ph:      rgba(255,255,255,0.20);
          --auth-focus-bg:      rgba(99,102,241,0.07);
          --auth-focus-bd:      rgba(99,102,241,0.60);
          --auth-focus-sh:      0 0 0 3px rgba(99,102,241,0.12);

          --auth-google-bg:     rgba(255,255,255,0.05);
          --auth-google-bd:     rgba(255,255,255,0.10);
          --auth-google-color:  rgba(255,255,255,0.82);
          --auth-google-hbg:    rgba(255,255,255,0.09);
          --auth-google-hbd:    rgba(255,255,255,0.18);

          --auth-div-line:      rgba(255,255,255,0.07);
          --auth-div-text:      rgba(255,255,255,0.22);

          --auth-eye:           rgba(255,255,255,0.28);
          --auth-eye-hover:     rgba(255,255,255,0.70);

          --auth-forgot:        rgba(129,140,248,0.80);
          --auth-forgot-hover:  #818cf8;

          --auth-link:          #818cf8;
          --auth-link-hover:    #a5b4fc;

          --auth-toast-err-bg:  rgba(239,68,68,0.15);
          --auth-toast-err-bd:  rgba(239,68,68,0.30);
          --auth-toast-err-txt: #fca5a5;
          --auth-toast-ok-bg:   rgba(34,197,94,0.15);
          --auth-toast-ok-bd:   rgba(34,197,94,0.30);
          --auth-toast-ok-txt:  #86efac;
        }

        .auth-root {
          min-height: calc(100vh - 4rem);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem;
          background-color: var(--auth-page-bg);
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, var(--auth-glow-a) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 110%, var(--auth-glow-b) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
          transition: background-color 0.3s;
        }

        .auth-card {
          width: 100%; max-width: 420px;
          background: var(--auth-card-bg);
          border: 1px solid var(--auth-card-border);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(20px);
          box-shadow: var(--auth-card-shadow);
          animation: cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        @keyframes cardIn {
          from { opacity:0; transform: translateY(20px) scale(0.98); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        .auth-logo {
          display:flex; align-items:center; justify-content:center;
          gap:10px; margin-bottom:1.75rem;
        }
        .auth-logo-icon {
          width:36px; height:36px;
          background: linear-gradient(135deg,#6366f1,#a855f7);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
        }
        .auth-logo-text {
          font-family:'Syne',sans-serif; font-weight:800; font-size:1.25rem;
          color: var(--auth-heading); letter-spacing:-0.02em; transition:color 0.3s;
        }

        .auth-heading {
          font-family:'Syne',sans-serif; font-size:1.75rem; font-weight:700;
          color: var(--auth-heading); text-align:center; letter-spacing:-0.03em;
          margin:0; transition:color 0.3s;
        }
        .auth-subtext {
          text-align:center; color: var(--auth-sub); font-size:0.875rem;
          margin:0.4rem 0 1.75rem; font-weight:300; transition:color 0.3s;
        }

        .btn-google {
          width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
          padding:0.7rem 1rem;
          background: var(--auth-google-bg); border:1px solid var(--auth-google-bd);
          border-radius:12px; color: var(--auth-google-color);
          font-size:0.9rem; font-weight:500; cursor:pointer;
          font-family:'DM Sans',sans-serif; transition:all 0.2s;
        }
        .btn-google:hover:not(:disabled) {
          background: var(--auth-google-hbg); border-color: var(--auth-google-hbd);
          transform:translateY(-1px);
        }
        .btn-google:disabled { opacity:0.5; cursor:not-allowed; }

        .auth-divider { display:flex; align-items:center; gap:12px; margin:1.25rem 0; }
        .auth-div-line { flex:1; height:1px; background: var(--auth-div-line); transition:background 0.3s; }
        .auth-div-text {
          font-size:0.7rem; color: var(--auth-div-text);
          letter-spacing:0.1em; font-weight:500; white-space:nowrap; transition:color 0.3s;
        }
        .auth-form { display:flex; flex-direction:column; gap:1rem; }
        .field-group { display:flex; flex-direction:column; gap:5px; }
        .field-label {
          font-size:0.8rem; font-weight:500; color: var(--auth-label);
          letter-spacing:0.01em; transition:color 0.3s;
        }
        .field-row { position:relative; }

        .auth-input {
          width:100%; padding:0.7rem 1rem;
          background: var(--auth-input-bg); border:1px solid var(--auth-input-bd);
          border-radius:10px; color: var(--auth-input-color);
          font-size:0.9rem; font-family:'DM Sans',sans-serif;
          outline:none; box-sizing:border-box;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, color 0.3s;
        }
        .auth-input::placeholder { color: var(--auth-input-ph); }
        .auth-input:focus {
          border-color: var(--auth-focus-bd);
          background: var(--auth-focus-bg);
          box-shadow: var(--auth-focus-sh);
        }
        .auth-input:disabled { opacity:0.5; }
        .auth-input.has-toggle { padding-right:2.75rem; }

        .toggle-pw {
          position:absolute; right:0.75rem; top:50%; transform:translateY(-50%);
          background:none; border:none; color: var(--auth-eye);
          cursor:pointer; padding:4px; display:flex; align-items:center;
          transition:color 0.2s;
        }
        .toggle-pw:hover { color: var(--auth-eye-hover); }

        .forgot-row { text-align:right; margin-top:4px; }
        .forgot-row a {
          font-size:0.78rem; color: var(--auth-forgot);
          text-decoration:none; transition:color 0.2s;
        }
        .forgot-row a:hover { color: var(--auth-forgot-hover); }

        .btn-submit {
          width:100%; padding:0.75rem 1rem;
          background: linear-gradient(135deg,#6366f1,#7c3aed);
          border:none; border-radius:12px;
          color:#fff; font-size:0.92rem; font-weight:600;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          margin-top:0.5rem; letter-spacing:0.01em;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          transform:translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .btn-submit:active:not(:disabled) { transform:translateY(0); }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .spinner {
          width:18px; height:18px;
          border:2px solid rgba(255,255,255,0.3);
          border-top-color:#fff; border-radius:50%;
          animation:spin 0.7s linear infinite; margin:0 auto;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .auth-footer {
          text-align:center; margin-top:1.5rem;
          font-size:0.85rem; color: var(--auth-footer); transition:color 0.3s;
        }
        .auth-footer a {
          color: var(--auth-link); font-weight:600;
          text-decoration:none; transition:color 0.2s;
        }
        .auth-footer a:hover { color: var(--auth-link-hover); }

        .toast-wrap {
          position:fixed; top:1.25rem; left:50%;
          transform:translateX(-50%); z-index:9999;
          animation:toastIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes toastIn {
          from { opacity:0; transform:translateX(-50%) translateY(-12px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        .toast-inner {
          display:flex; align-items:center; gap:10px;
          padding:0.75rem 1.25rem; border-radius:12px;
          font-size:0.88rem; font-family:'DM Sans',sans-serif;
          font-weight:500; white-space:nowrap;
          box-shadow:0 8px 32px rgba(0,0,0,0.2);
        }
        .toast-err {
          background: var(--auth-toast-err-bg); border:1px solid var(--auth-toast-err-bd);
          color: var(--auth-toast-err-txt);
        }
        .toast-ok {
          background: var(--auth-toast-ok-bg); border:1px solid var(--auth-toast-ok-bd);
          color: var(--auth-toast-ok-txt);
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            </div>
            <span className="auth-logo-text">IdeaVault</span>
          </div>

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subtext">Sign in to continue to IdeaVault</p>

          <button className="btn-google" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg style={{flexShrink:0}} width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <div className="auth-div-line" />
            <span className="auth-div-text">OR LOGIN WITH EMAIL</span>
            <div className="auth-div-line" />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                type="email" placeholder="you@example.com"
                className="auth-input"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-row">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="auth-input has-toggle"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required disabled={isLoading}
                />
                <button type="button" className="toggle-pw"
                  onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="forgot-row">
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? <div className="spinner" /> : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link href="/register">Register</Link>
          </p>
        </div>
      </div>

      {toast.show && (
        <div className="toast-wrap">
          <div className={`toast-inner ${toast.type === "error" ? "toast-err" : "toast-ok"}`}>
            {toast.type === "error" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}