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
      filter.title = { $regex: search, $options: "i" };
    }

    const [ideas, total] = await Promise.all([
      db
        .collection("idea")
        .find(filter)
        .project({
          title: 1,
          shortDesc: 1,
          category: 1,
          authorName: 1,
          userId: 1,
          createdAt: 1,
          commentCount: 1,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("idea").countDocuments(filter),
    ]);

    return Response.json({ ideas, total });
  } catch (error) {
    console.error("Admin ideas error:", error);
    return Response.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}
