



import connectDB from "@/app/lib/db";
import { authenticate } from "@/app/lib/middleware/auth";
import { havingPermission } from "@/app/lib/middleware/havingPermission";
import projectModel from "@/app/lib/models/projectModel";
import taskModel from "@/app/lib/models/taskModel";

export async function GET(req) {
    try {
        await connectDB();

        // Verify JWT Token
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const user = authenticate(token); // Extract user info from token
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        }

        // Check if user has permission to view all projects
        const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const projectName = searchParams.get("projectName");

        let filter = {};

        if (hasPermission.success) {
            // ✅ If user has permission, allow filtering by projectName
            if (projectName) filter.projectName = { $regex: projectName, $options: "i" };
        } else {
            // ❌ If user has no permission, restrict to their assigned projects
            filter.developers = user.id;
        }

        // Fetch projects with only projectName and status
        const projects = await projectModel.find(filter, "projectName status");

        // Count tasks for each project
        const projectData = await Promise.all(
            projects.map(async (project) => {
                const taskCount = await taskModel.countDocuments({ project: project._id });
                return {
                    projectName: project.projectName,
                    status: project.status,
                    taskCount,
                };
            })
        );

        return new Response(JSON.stringify({ projects: projectData }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Error fetching projects", error: error.message }), { status: 500 });
    }
}
