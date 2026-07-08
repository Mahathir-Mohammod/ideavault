/**
 * Verifies the incoming request has a valid admin session.
 * Returns the admin user object, or null if not authenticated / not admin.
 */
export async function getAdminUser(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  if (!cookieHeader) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      // Use a shorter timeout to avoid hanging
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.user;
    if (!user || user.role !== "admin") return null;

    return user;
  } catch {
    return null;
  }
}
