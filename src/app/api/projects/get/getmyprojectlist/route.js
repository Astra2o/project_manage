



// import connectDB from "@/app/lib/db";
// import { authenticate } from "@/app/lib/middleware/auth";
// import { havingPermission } from "@/app/lib/middleware/havingPermission";
// import projectModel from "@/app/lib/models/projectModel";
// import taskModel from "@/app/lib/models/taskModel";

import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import projectModel from "@/backend/models/projectModel";
import taskModel from "@/backend/models/taskModel";




export async function GET(req) {
  try {
    await connectDB();

    // Verify JWT Token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = authenticate(token);
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get("projectName");

    // Base filter: projects where teamManager = user._id
    let filter = { teamManager: user.id };

    // If projectName is provided, add case-insensitive regex filter
    if (projectName) {
      filter.projectName = { $regex: projectName, $options: "i" };
    }

    // Fetch max 50 projects matching filter, select only _id and projectName
    const projects = await projectModel.find(filter)
      .select("_id projectName")
      .limit(50)
      .lean();

    return new Response(JSON.stringify({ projects }), { status: 200 });

  } catch (error) {
    console.error("GET PROJECTS API ERROR:", error);
    return new Response(JSON.stringify({ message: "Error fetching projects", error: error.message }), { status: 500 });
  }
}


  


