// app/login/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation: Just check if fields aren't empty
    if (email === "test@example.com" && password === "password") {
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => router.push("/"), 1000); // Redirect to home on success
    } else {
      showToast("Invalid email or password. Please try again.", "error");
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    showToast("Google login successful! Redirecting...", "success");
    setTimeout(() => router.push("/"), 1000);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <div className="card-body">
          
          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-base-content/60 mt-1 text-sm">Sign in to continue to IdeaVault</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="btn btn-outline btn-block gap-3 mb-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="divider text-base-content/50 text-xs m-0">OR LOGIN WITH EMAIL</div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:outline-none focus:input-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:outline-none focus:input-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <label className="label">
                <Link href="/forgot-password" className="label-text-alt link link-hover text-primary">
                  Forgot password?
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm mt-4 text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="link link-primary font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"} shadow-lg`}>
            <div className="flex items-center gap-2">
              {toast.type === "error" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}