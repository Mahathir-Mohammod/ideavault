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

    const [totalUsers, totalIdeas, totalComments] = await Promise.all([
      db.collection("user").countDocuments(),
      db.collection("idea").countDocuments(),
      db.collection("comment").countDocuments(),
    ]);

    return Response.json({
      stats: {
        totalUsers,
        totalIdeas,
        totalComments,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
