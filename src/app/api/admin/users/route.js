import { getAdminUser } from "@/lib/admin-guard";
import { connectToDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = await getAdminUser(request);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const filter = {};
    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      db
        .collection("user")
        .find(filter)
        .project({ name: 1, email: 1, role: 1, emailVerified: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("user").countDocuments(filter),
    ]);

    return Response.json({ users, total });
  } catch (error) {
    console.error("Admin users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
