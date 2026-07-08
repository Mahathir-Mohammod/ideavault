import { getAdminUser } from "@/lib/admin-guard";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const admin = await getAdminUser(request);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { role } = await request.json();
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin update role error:", error);
    return Response.json({ error: "Failed to update role" }, { status: 500 });
  }
}
