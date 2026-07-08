import { getAdminUser } from "@/lib/admin-guard";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const admin = await getAdminUser(request);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid idea ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);

    // Delete the idea and its comments
    await Promise.all([
      db.collection("idea").deleteOne({ _id: objectId }),
      db.collection("comment").deleteMany({ ideaId: id }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin delete idea error:", error);
    return Response.json({ error: "Failed to delete idea" }, { status: 500 });
  }
}
