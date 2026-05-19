"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "../ThemeProvider";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isLoggedIn = !!session;
  const user = session?.user || null;

  const handleLogout = async () => {
    setSigningOut(true);
    setDropdownOpen(false);
    await authClient.signOut();
    setSigningOut(false);
    refetch();
    router.push("/");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isActive = (href) => pathname === href;

  const NavLink = ({ href, icon, children, onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className={`nav-link ${isActive(href) ? "nav-link-active" : ""}`}
    >
      {icon}
      {children}
    </Link>
  );

  return (
    <>
      <style>{`
        /* ─── Light tokens ─── */
        :root,
        [data-theme="light"] {
          --nav-bg:            rgba(255,255,255,0.82);
          --nav-border:        rgba(0,0,0,0.07);
          --nav-shadow:        0 1px 24px rgba(0,0,0,0.07);

          --nav-logo-text:     #0f0f14;
          --nav-logo-accent:   #6366f1;

          --nav-link:          rgba(15,15,20,0.55);
          --nav-link-hover-bg: rgba(99,102,241,0.07);
          --nav-link-hover:    #6366f1;
          --nav-link-active-bg:rgba(99,102,241,0.10);
          --nav-link-active:   #6366f1;
          --nav-link-active-bd:rgba(99,102,241,0.30);

          --nav-icon-btn-bg:   transparent;
          --nav-icon-btn-hover:rgba(0,0,0,0.05);
          --nav-icon-color:    rgba(15,15,20,0.50);
          --nav-icon-hover:    rgba(15,15,20,0.85);

          --nav-sun-color:     #d97706;
          --nav-moon-color:    #6366f1;

          --nav-login-bg:      transparent;
          --nav-login-bd:      rgba(0,0,0,0.12);
          --nav-login-color:   rgba(15,15,20,0.70);
          --nav-login-hbg:     rgba(0,0,0,0.05);

          --nav-avatar-bg:     linear-gradient(135deg,#6366f1,#a855f7);
          --nav-avatar-color:  #ffffff;
          --nav-avatar-ring:   rgba(99,102,241,0.30);

          --nav-drop-bg:       rgba(255,255,255,0.96);
          --nav-drop-border:   rgba(0,0,0,0.08);
          --nav-drop-shadow:   0 16px 48px rgba(0,0,0,0.14);
          --nav-drop-item:     rgba(15,15,20,0.65);
          --nav-drop-item-hbg: rgba(99,102,241,0.07);
          --nav-drop-item-hc:  #6366f1;
          --nav-drop-div:      rgba(0,0,0,0.07);
          --nav-drop-header:   #0f0f14;
          --nav-drop-email:    rgba(15,15,20,0.45);
          --nav-drop-logout:   #dc2626;
          --nav-drop-logout-hbg: rgba(220,38,38,0.07);

          --nav-mobile-bg:     rgba(255,255,255,0.97);
          --nav-mobile-border: rgba(0,0,0,0.07);
          --nav-mobile-div:    rgba(0,0,0,0.07);
          --nav-mobile-label:  rgba(15,15,20,0.35);
          --nav-mobile-link:   rgba(15,15,20,0.65);
          --nav-mobile-link-hbg: rgba(99,102,241,0.07);
          --nav-mobile-link-hc:  #6366f1;
          --nav-mobile-active-bg: rgba(99,102,241,0.10);
          --nav-mobile-active-c:  #6366f1;

          --nav-divider:       rgba(0,0,0,0.07);
        }

        /* ─── Dark tokens ─── */
        [data-theme="dark"] {
          --nav-bg:            rgba(10,10,15,0.85);
          --nav-border:        rgba(255,255,255,0.07);
          --nav-shadow:        0 1px 24px rgba(0,0,0,0.35);

          --nav-logo-text:     #ffffff;
          --nav-logo-accent:   #818cf8;

          --nav-link:          rgba(255,255,255,0.45);
          --nav-link-hover-bg: rgba(99,102,241,0.10);
          --nav-link-hover:    #a5b4fc;
          --nav-link-active-bg:rgba(99,102,241,0.14);
          --nav-link-active:   #a5b4fc;
          --nav-link-active-bd:rgba(129,140,248,0.35);

          --nav-icon-btn-bg:   transparent;
          --nav-icon-btn-hover:rgba(255,255,255,0.06);
          --nav-icon-color:    rgba(255,255,255,0.38);
          --nav-icon-hover:    rgba(255,255,255,0.85);

          --nav-sun-color:     #fbbf24;
          --nav-moon-color:    #a5b4fc;

          --nav-login-bg:      transparent;
          --nav-login-bd:      rgba(255,255,255,0.12);
          --nav-login-color:   rgba(255,255,255,0.60);
          --nav-login-hbg:     rgba(255,255,255,0.06);

          --nav-avatar-bg:     linear-gradient(135deg,#6366f1,#a855f7);
          --nav-avatar-color:  #ffffff;
          --nav-avatar-ring:   rgba(129,140,248,0.40);

          --nav-drop-bg:       rgba(15,15,22,0.97);
          --nav-drop-border:   rgba(255,255,255,0.08);
          --nav-drop-shadow:   0 16px 48px rgba(0,0,0,0.50);
          --nav-drop-item:     rgba(255,255,255,0.55);
          --nav-drop-item-hbg: rgba(99,102,241,0.12);
          --nav-drop-item-hc:  #a5b4fc;
          --nav-drop-div:      rgba(255,255,255,0.07);
          --nav-drop-header:   #ffffff;
          --nav-drop-email:    rgba(255,255,255,0.38);
          --nav-drop-logout:   #f87171;
          --nav-drop-logout-hbg: rgba(248,113,113,0.10);

          --nav-mobile-bg:     rgba(10,10,15,0.98);
          --nav-mobile-border: rgba(255,255,255,0.07);
          --nav-mobile-div:    rgba(255,255,255,0.07);
          --nav-mobile-label:  rgba(255,255,255,0.25);
          --nav-mobile-link:   rgba(255,255,255,0.55);
          --nav-mobile-link-hbg: rgba(99,102,241,0.10);
          --nav-mobile-link-hc:  #a5b4fc;
          --nav-mobile-active-bg: rgba(99,102,241,0.14);
          --nav-mobile-active-c:  #a5b4fc;

          --nav-divider:       rgba(255,255,255,0.07);
        }

        /* ─── Navbar shell ─── */
        .nav-bar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center;
          height: 60px; padding: 0 1.25rem;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          box-shadow: var(--nav-shadow);
          backdrop-filter: blur(18px);
          font-family: 'DM Sans', sans-serif;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        /* ─── Logo ─── */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.15rem;
          color: var(--nav-logo-text);
          letter-spacing: -0.025em;
          transition: color 0.3s;
        }
        .nav-logo-text span { color: var(--nav-logo-accent); transition: color 0.3s; }

        /* ─── Desktop center nav ─── */
        .nav-center {
          display: none;
          align-items: center; gap: 2px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        @media (min-width: 1024px) { .nav-center { display: flex; } }

        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 0.4rem 0.75rem; border-radius: 8px;
          font-size: 0.85rem; font-weight: 500;
          color: var(--nav-link);
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: var(--nav-link-hover-bg);
          color: var(--nav-link-hover);
        }
        .nav-link-active {
          background: var(--nav-link-active-bg);
          color: var(--nav-link-active);
          border-color: var(--nav-link-active-bd);
        }
        .nav-link svg { flex-shrink: 0; opacity: 0.75; }
        .nav-link:hover svg, .nav-link-active svg { opacity: 1; }

        /* ─── Right side ─── */
        .nav-end {
          margin-left: auto;
          display: flex; align-items: center; gap: 6px;
        }

        /* ─── Icon button (theme toggle, hamburger) ─── */
        .icon-btn {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: var(--nav-icon-btn-bg);
          border: none; cursor: pointer;
          color: var(--nav-icon-color);
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .icon-btn:hover {
          background: var(--nav-icon-btn-hover);
          color: var(--nav-icon-hover);
        }

        /* ─── Theme toggle ─── */
        .theme-toggle { position: relative; }
        .theme-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
        .theme-icon-sun  { color: var(--nav-sun-color); }
        .theme-icon-moon { color: var(--nav-moon-color); }

        /* ─── Login / Register buttons ─── */
        .btn-nav-login {
          padding: 0.38rem 0.85rem; border-radius: 8px;
          background: var(--nav-login-bg);
          border: 1px solid var(--nav-login-bd);
          color: var(--nav-login-color);
          font-size: 0.85rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: all 0.18s;
          display: inline-flex; align-items: center;
        }
        .btn-nav-login:hover {
          background: var(--nav-login-hbg);
        }
        .btn-nav-register {
          padding: 0.38rem 0.85rem; border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          border: none;
          color: #fff;
          font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: all 0.18s;
          display: inline-flex; align-items: center;
        }
        .btn-nav-register:hover {
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }

        /* ─── Avatar button ─── */
        .avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--nav-avatar-bg);
          border: 2px solid var(--nav-avatar-ring);
          color: var(--nav-avatar-color);
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.78rem;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.18s; position: relative;
          flex-shrink: 0;
        }
        .avatar-btn:hover {
          box-shadow: 0 0 0 3px var(--nav-avatar-ring);
          transform: scale(1.05);
        }

        /* ─── Dropdown ─── */
        .drop-wrap {
          position: relative;
        }
        .drop-menu {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 224px;
          background: var(--nav-drop-bg);
          border: 1px solid var(--nav-drop-border);
          border-radius: 14px;
          box-shadow: var(--nav-drop-shadow);
          backdrop-filter: blur(20px);
          overflow: hidden;
          animation: dropIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
          z-index: 100;
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .drop-header {
          display: flex; align-items: center; gap: 10px;
          padding: 0.9rem 1rem;
        }
        .drop-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--nav-avatar-bg);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.78rem; flex-shrink: 0;
        }
        .drop-name {
          font-size: 0.85rem; font-weight: 600;
          color: var(--nav-drop-header); transition: color 0.3s;
        }
        .drop-email {
          font-size: 0.74rem; color: var(--nav-drop-email);
          transition: color 0.3s; margin-top: 1px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 148px;
        }

        .drop-divider {
          height: 1px; background: var(--nav-drop-div);
          transition: background 0.3s; margin: 0;
        }

        .drop-section { padding: 0.35rem; }

        .drop-item {
          display: flex; align-items: center; gap: 9px;
          padding: 0.5rem 0.7rem; border-radius: 8px;
          font-size: 0.83rem; font-weight: 500;
          color: var(--nav-drop-item);
          text-decoration: none; background: none; border: none;
          cursor: pointer; width: 100%;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .drop-item:hover {
          background: var(--nav-drop-item-hbg);
          color: var(--nav-drop-item-hc);
        }
        .drop-item svg { flex-shrink: 0; opacity: 0.7; }
        .drop-item:hover svg { opacity: 1; }
        .drop-item-logout {
          color: var(--nav-drop-logout);
        }
        .drop-item-logout:hover {
          background: var(--nav-drop-logout-hbg);
          color: var(--nav-drop-logout);
        }

        /* ─── Loading skeleton ─── */
        .nav-skeleton {
          width: 88px; height: 32px; border-radius: 8px;
          background: linear-gradient(90deg,
            rgba(128,128,128,0.08) 25%,
            rgba(128,128,128,0.16) 50%,
            rgba(128,128,128,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        /* ─── Hamburger ─── */
        .hamburger { display: flex; }
        @media (min-width: 1024px) { .hamburger { display: none; } }
        .lg-hide { display: flex; }
        @media (min-width: 1024px) { .lg-hide { display: none; } }

        /* ─── Mobile menu ─── */
        .mobile-menu {
          position: fixed; top: 60px; left: 0; right: 0;
          background: var(--nav-mobile-bg);
          border-bottom: 1px solid var(--nav-mobile-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          backdrop-filter: blur(20px);
          z-index: 49;
          padding: 0.75rem;
          animation: slideDown 0.25s cubic-bezier(0.16,1,0.3,1) both;
          transition: background 0.3s, border-color 0.3s;
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 0.6rem 0.75rem; border-radius: 9px;
          font-size: 0.9rem; font-weight: 500;
          color: var(--nav-mobile-link);
          text-decoration: none; border: 1px solid transparent;
          transition: all 0.15s;
        }
        .mobile-link:hover {
          background: var(--nav-mobile-link-hbg);
          color: var(--nav-mobile-link-hc);
        }
        .mobile-link.active {
          background: var(--nav-mobile-active-bg);
          color: var(--nav-mobile-active-c);
          border-color: var(--nav-link-active-bd);
        }
        .mobile-link svg { opacity: 0.7; }
        .mobile-link:hover svg, .mobile-link.active svg { opacity: 1; }

        .mobile-divider {
          height: 1px; background: var(--nav-mobile-div);
          margin: 0.5rem 0; transition: background 0.3s;
        }
        .mobile-label {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
          color: var(--nav-mobile-label);
          padding: 0.25rem 0.75rem 0.35rem;
          text-transform: uppercase; transition: color 0.3s;
        }

        .mobile-btn-row {
          display: flex; gap: 8px; padding: 0 0.15rem;
        }
        .mobile-btn-login {
          flex: 1; padding: 0.6rem;
          background: var(--nav-login-bg);
          border: 1px solid var(--nav-login-bd);
          border-radius: 9px;
          color: var(--nav-login-color);
          font-size: 0.88rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; text-align: center;
          transition: background 0.15s;
        }
        .mobile-btn-login:hover { background: var(--nav-login-hbg); }
        .mobile-btn-register {
          flex: 1; padding: 0.6rem;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          border: none; border-radius: 9px;
          color: #fff;
          font-size: 0.88rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; text-align: center;
        }

        .spinner-sm {
          width: 16px; height: 16px;
          border: 2px solid rgba(128,128,128,0.25);
          border-top-color: currentColor; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <nav className="nav-bar">
        {/* ── Logo ── */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="nav-logo-text nav-logo-hide-xs">
            Idea<span>Vault</span>
          </span>
        </Link>

        {/* ── Desktop center links ── */}
        <div className="nav-center">
          <NavLink href="/" icon={<IconHome />}>Home</NavLink>
          <NavLink href="/ideas" icon={<IconIdea />}>Ideas</NavLink>
          {isLoggedIn && (
            <>
              <NavLink href="/add-idea" icon={<IconPlus />}>Add Idea</NavLink>
              <NavLink href="/my-ideas" icon={<IconBox />}>My Ideas</NavLink>
              <NavLink href="/my-interactions" icon={<IconChat />}>My Interactions</NavLink>
            </>
          )}
        </div>

        {/* ── Right side ── */}
        <div className="nav-end">

          {/* Theme toggle */}
          <label className="icon-btn theme-toggle" title="Toggle theme">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            {theme === "dark" ? (
              <svg className="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
              </svg>
            ) : (
              <svg className="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
              </svg>
            )}
          </label>

          {/* Auth area */}
          {isPending ? (
            <div className="nav-skeleton" />
          ) : !isLoggedIn ? (
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <Link href="/login" className="btn-nav-login">Login</Link>
              <Link href="/register" className="btn-nav-register">Register</Link>
            </div>
          ) : (
            <div className="drop-wrap">
              <button
                className="avatar-btn"
                onClick={() => setDropdownOpen(v => !v)}
                aria-label="User menu"
              >
                {userInitials}
              </button>

              {dropdownOpen && (
                <>
                  {/* Click-outside overlay */}
                  <div
                    style={{position:"fixed",inset:0,zIndex:99}}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="drop-menu">
                    {/* User header */}
                    <div className="drop-header">
                      <div className="drop-avatar">{userInitials}</div>
                      <div style={{minWidth:0}}>
                        <div className="drop-name">{user?.name || "User"}</div>
                        <div className="drop-email">{user?.email || ""}</div>
                      </div>
                    </div>

                    <div className="drop-divider" />

                    {/* Mobile-only links inside dropdown */}
                    <div className="drop-section lg-hide" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                      <Link href="/add-idea" className="drop-item" onClick={() => setDropdownOpen(false)}>
                        <IconPlus size={15} /><span>Add Idea</span>
                      </Link>
                      <Link href="/my-ideas" className="drop-item" onClick={() => setDropdownOpen(false)}>
                        <IconBox size={15} /><span>My Ideas</span>
                      </Link>
                      <Link href="/my-interactions" className="drop-item" onClick={() => setDropdownOpen(false)}>
                        <IconChat size={15} /><span>My Interactions</span>
                      </Link>
                      <div className="drop-divider" style={{margin:"4px 0"}} />
                    </div>

                    <div className="drop-section" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                      <Link href="/profile" className="drop-item" onClick={() => setDropdownOpen(false)}>
                        <IconUser size={15} /><span>Profile Management</span>
                      </Link>
                      <Link href="/settings" className="drop-item" onClick={() => setDropdownOpen(false)}>
                        <IconSettings size={15} /><span>Settings</span>
                      </Link>
                    </div>

                    <div className="drop-divider" />

                    <div className="drop-section">
                      <button className="drop-item drop-item-logout" onClick={handleLogout} disabled={signingOut}>
                        {signingOut
                          ? <span className="spinner-sm" />
                          : <IconLogout size={15} />
                        }
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            className="icon-btn hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="mobile-menu">
          <MobileLink href="/" icon={<IconHome />} active={isActive("/")} onClick={() => setMobileOpen(false)}>Home</MobileLink>
          <MobileLink href="/ideas" icon={<IconIdea />} active={isActive("/ideas")} onClick={() => setMobileOpen(false)}>Ideas</MobileLink>

          {isLoggedIn ? (
            <>
              <div className="mobile-divider" />
              <div className="mobile-label">My Space</div>
              <MobileLink href="/add-idea" icon={<IconPlus />} active={isActive("/add-idea")} onClick={() => setMobileOpen(false)}>Add Idea</MobileLink>
              <MobileLink href="/my-ideas" icon={<IconBox />} active={isActive("/my-ideas")} onClick={() => setMobileOpen(false)}>My Ideas</MobileLink>
              <MobileLink href="/my-interactions" icon={<IconChat />} active={isActive("/my-interactions")} onClick={() => setMobileOpen(false)}>My Interactions</MobileLink>
            </>
          ) : (
            <>
              <div className="mobile-divider" />
              <div className="mobile-label">Account</div>
              <div className="mobile-btn-row">
                <Link href="/login" className="mobile-btn-login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="mobile-btn-register" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Compound components ─── */

function NavLink({ href, icon, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`nav-link${isActive ? " nav-link-active" : ""}`}>
      {icon}{children}
    </Link>
  );
}

function MobileLink({ href, icon, children, active, onClick }) {
  return (
    <Link href={href} className={`mobile-link${active ? " active" : ""}`} onClick={onClick}>
      {icon}{children}
    </Link>
  );
}

/* ─── Icons ─── */
const IconHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/>
  </svg>
);
const IconIdea = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
  </svg>
);
const IconPlus = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v16m8-8H4"/>
  </svg>
);
const IconBox = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
  </svg>
);
const IconChat = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>
);
const IconUser = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
const IconSettings = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);
const IconLogout = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.71a1 1 0 00-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 001.42 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.42z"/>
  </svg>
);