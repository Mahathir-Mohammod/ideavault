"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Toaster } from "react-hot-toast";

function SkeletonProfile() {
  return (
    <div className="pr-page">
      <div className="pr-skel">
        <div className="pr-skel-avatar" />
        <div className="pr-skel-line" style={{ width: "50%" }} />
        <div className="pr-skel-line-sm" />
        <div className="pr-skel-btn" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?redirect=/profile");
    }
  }, [session, isPending, router]);

  if (isPending) return <SkeletonProfile />;
  if (!session) return null;

  const user = session.user;
  const hasImage = !!user.image;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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

      <div className="pr-page">
        <div className="pr-card">
          {/* Avatar / Photo */}
          <div className="pr-avatar">
            {hasImage ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="pr-avatar-img"
              />
            ) : (
              <div className="pr-avatar-initials">{initials}</div>
            )}
          </div>

          <h1 className="pr-name">{user.name || "User"}</h1>
          <p className="pr-email">{user.email || ""}</p>

          <div className="pr-divider" />
          <div className="pr-actions">
            <Link href="/profile/edit" className="pr-edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </Link>
            <Link href="/" className="pr-home-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/>
              </svg>
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}