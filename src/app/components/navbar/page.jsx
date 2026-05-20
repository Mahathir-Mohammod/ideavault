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

  return (
    <>

      <nav className="nav-bar">
        <div className="flex items-center w-full" style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="nav-logo-text nav-logo-hide-xs">
            Idea<span>Vault</span>
          </span>
        </Link>

        {/* Desktop center links */}
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

        {/* Right side */}
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
                        <IconUser size={15} /><span>My Profile</span>
                      </Link>
                      <Link href="/profile/edit" className="drop-item" onClick={() => setDropdownOpen(false)}>
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
