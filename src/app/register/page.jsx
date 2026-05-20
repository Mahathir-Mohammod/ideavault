"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const PASSWORD_RULES = [
  { id: "length",    label: "At least 6 characters",  test: (p) => p.length >= 6 },
  { id: "uppercase", label: "One uppercase letter",    test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter",    test: (p) => /[a-z]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);
  const passwordsMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched(true);
    if (!allRulesPassed) {
      showToast("Password does not meet all requirements.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      name, email, password,
      image: photoURL || undefined,
    });
    if (error) {
      showToast(error.message || "Registration failed. Please try again.", "error");
      setIsLoading(false);
      return;
    }
    // Sign out to clear the auto-created session so navbar shows Login/Register on /login
    await authClient.signOut();
    showToast("Account created! Redirecting to login...", "success");
    setTimeout(() => router.push("/login"), 1200);
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    setIsLoading(false);
  };

  return (
    <>

      <div className="auth-root">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            </div>
            <span className="auth-logo-text">IdeaVault</span>
          </div>

          <h1 className="auth-heading">Create an account</h1>
          <p className="auth-subtext">Join IdeaVault and share your ideas</p>

          <button className="btn-google" onClick={handleGoogleSignUp} disabled={isLoading}>
            <svg style={{flexShrink:0}} width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="auth-divider">
            <div className="auth-div-line" />
            <span className="auth-div-text">OR SIGN UP WITH EMAIL</span>
            <div className="auth-div-line" />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input type="text" placeholder="John Doe" className="auth-input"
                value={name} onChange={(e) => setName(e.target.value)}
                required disabled={isLoading} />
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input type="email" placeholder="you@example.com" className="auth-input"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required disabled={isLoading} />
            </div>

            <div className="field-group">
              <label className="field-label">
                Photo URL <span className="field-label-opt">(optional)</span>
              </label>
              <input type="url" placeholder="https://example.com/photo.jpg" className="auth-input"
                value={photoURL} onChange={(e) => setPhotoURL(e.target.value)}
                disabled={isLoading} />
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-row">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`auth-input has-toggle ${
                    passwordTouched
                      ? allRulesPassed ? "input-ok" : "input-err"
                      : ""
                  }`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                  required disabled={isLoading}
                />
                <button type="button" className="toggle-pw"
                  onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {passwordTouched && password.length > 0 && (
                <div className="pw-rules">
                  {ruleResults.map((rule) => (
                    <div key={rule.id} className={`rule-item ${rule.passed ? "passed" : "failed"}`}>
                      <div className={`rule-dot ${rule.passed ? "passed" : "failed"}`}>
                        {rule.passed ? (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                            stroke="var(--auth-rule-check)" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <div style={{width:4,height:4,borderRadius:"50%",
                            background:"var(--auth-rule-dot-fail)",filter:"brightness(3)"}}/>
                        )}
                      </div>
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="field-group">
              <label className="field-label">Confirm Password</label>
              <div className="field-row">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`auth-input has-toggle ${
                    confirmPassword.length > 0
                      ? passwordsMatch ? "input-ok" : "input-err"
                      : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required disabled={isLoading}
                />
                <button type="button" className="toggle-pw"
                  onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {passwordsMismatch && (
                <div className="match-hint bad">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Passwords do not match
                </div>
              )}
              {passwordsMatch && (
                <div className="match-hint ok">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Passwords match
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? <div className="spinner" /> : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/login">Login</Link>
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

/* ─── Eye toggle icons ─── */
function EyeOpen() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
