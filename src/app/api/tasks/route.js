import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import taskModel from "@/backend/models/taskModel";

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

        // Check if user has permission (Only Team Leaders or Sr. Developers can view all tasks)
        const hasPermission = await havingPermission(user.id, { requiredRoles: ["developer", "seo","uiux","cto","manager"] });

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const assignedBy = searchParams.get("assignedBy");
        const assignedTo = searchParams.get("assignedTo");
        const projectId = searchParams.get("projectId");
        const taskStatus = searchParams.get("taskStatus");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // let filter = {};
        let filter = { taskAssignedTo: user.id };  // 👈 ye fix kardo


        if (hasPermission.success) {
            // If user has permission, allow all filters
            if (assignedBy) filter.taskAssignedBy = assignedBy;
            if (assignedTo) filter.taskAssignedTo = assignedTo;
            if (projectId) {
                // Handle multiple project IDs
                const projectIds = projectId.split(',');
                filter.project = projectIds.length > 1 ? { $in: projectIds } : projectIds[0];
            }
            if (taskStatus) {
                // Handle multiple task statuses
                const statuses = taskStatus.split(',');
                filter.taskStatus = statuses.length > 1 ? { $in: statuses } : statuses[0];
            }
        } else {
            // If user doesn't have permission, restrict to their assigned tasks
            filter.taskAssignedTo = user.id;
            if (projectId) {
                // Handle multiple project IDs
                const projectIds = projectId.split(',');
                filter.project = projectIds.length > 1 ? { $in: projectIds } : projectIds[0];
            }
        }

        // Create a complex filter for tasks
        const taskFilter = {
            $or: [
                // Non-collaborative projects
                { iscollaborator: false },
                // Collaborative projects with accepted status
                {
                    iscollaborator: true,
                    collabrationstatus: "accept"
                }
            ],
            ...filter
        };

        // Get total tasks count with the new filter
        const totalTasks = await taskModel.countDocuments(taskFilter);

        // Get total accepted collaborative projects count
        const acceptedCollaborativeProjects = await taskModel.distinct('project', {
            ...filter,
            iscollaborator: true,
            collabrationstatus: "accept"
        });

        // Fetch tasks based on the filters with pagination
        const tasks = await taskModel.find(taskFilter)
            .skip(skip)
            .limit(limit)
            .sort({ taskCreatedAt: -1 })
            .populate('project', 'projectName')
            .populate('taskAssignedTo', 'name email')
            .populate('taskAssignedBy', 'name email');

        return new Response(JSON.stringify({
            tasks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalTasks / limit),
                totalTasks,
                totalAcceptedCollaborativeProjects: acceptedCollaborativeProjects.length
            }
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong while fetching tasks", error: error.message }), { status: 500 });
    }
}