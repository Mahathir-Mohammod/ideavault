import { getAdminUser } from "@/lib/admin-guard";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const admin = await getAdminUser(request);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prevent deleting yourself
  const { id } = await params;
  if (id === admin.id) {
    return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);

    // Delete user's ideas and comments first
    await Promise.all([
      db.collection("idea").deleteMany({ userId: id }),
      db.collection("idea").updateMany(
        {},
        { $pull: { comments: { userId: id } } }
      ),
      db.collection("comment").deleteMany({ userId: id }),
      db.collection("session").deleteMany({ userId: id }),
      db.collection("user").deleteOne({ _id: objectId }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
