import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import teamsModel from "@/backend/models/teamsModel";
import Employee from "@/backend/models/Employee";

export async function GET(req) {
  try {
    await connectDB();

    // JWT Token check
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = authenticate(token);
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }

    // Permission check (if needed — yaa everyone can access, remove this)
    const permissionCheck = await havingPermission(user.id, { requiredRoles: ["admin", "manager", "team_leader"] });
    if (!permissionCheck.success) {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    // Fetch all teams with populated teamLeader & teamMembers
    const teams = await teamsModel.find()
      .populate({
        path: "teamLeader",
        select: "name _id role position"
      })
      .populate({
        path: "teamMembers",
        select: "name _id role position"
      });

    return new Response(JSON.stringify({ teams }), { status: 200 });

  } catch (error) {
    console.error("Error fetching teams:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch teams", error: error.message }),
      { status: 500 }
    );
  }
}
