import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authPages = ["/login", "/register"];
const protectedPagePrefixes = [
  "/add-idea",
  "/my-ideas",
  "/my-interactions",
  "/profile",
  "/settings",
  "/ideas",
];

export function proxy(request) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (sessionCookie && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !sessionCookie &&
    protectedPagePrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/add-idea",
    "/my-ideas",
    "/my-interactions",
    "/profile",
    "/settings",
    "/ideas/:path*",
  ],
};
