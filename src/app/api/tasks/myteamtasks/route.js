import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import taskModel from "@/backend/models/taskModel";
import teamsModel from "@/backend/models/teamsModel";

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
  
      // Check manager permission
      const hasPermission = await havingPermission(user.id, { requiredRoles: ["manager"] });
      if (!hasPermission.success) {
        return new Response(JSON.stringify({ message: "Forbidden — Only managers can access this" }), { status: 403 });
      }
  
      // Get team members for this manager
      const teams = await teamsModel.find({ teamLeader: user.id }).select("teamMembers");
      const teamMemberIds = teams.flatMap((team) => team.teamMembers.map((member) => member.toString()));
  
      // Extract query parameters
      const { searchParams } = new URL(req.url);
      const assignedBy = searchParams.get("assignedBy");
      const assignedTo = searchParams.get("assignedTo");
      const projectId = searchParams.get("projectId");
      const taskStatus = searchParams.get("taskStatus");
      const iscollaborator = searchParams.get("iscollaborator");
      const page = parseInt(searchParams.get("page")) || 1;
      const limit = parseInt(searchParams.get("limit")) || 10;
      const skip = (page - 1) * limit;
  
      // Base filter: tasks assigned to team members
      let filter = {
        taskAssignedTo: { $in: teamMemberIds }
      };
  
      // Apply optional query params
      if (assignedBy) filter.taskAssignedBy = assignedBy;
      if (assignedTo) filter.taskAssignedTo = assignedTo;
      if (projectId) {
        const projectIds = projectId.split(",");
        filter.project = projectIds.length > 1 ? { $in: projectIds } : projectIds[0];
      }
      if (taskStatus) {
        const statuses = taskStatus.split(",");
        filter.taskStatus = statuses.length > 1 ? { $in: statuses } : statuses[0];
      }
  
      // Handle iscollaborator param logic
      let taskFilter = { ...filter };
  
      if (iscollaborator === "true") {
        taskFilter.iscollaborator = true;
        taskFilter.collabrationstatus = "accept";
      } else if (iscollaborator === "false") {
        taskFilter.iscollaborator = false;
      } else {
        taskFilter = {
          $or: [
            { iscollaborator: false },
            { iscollaborator: true, collabrationstatus: "accept" }
          ],
          ...filter
        };
      }
  
      // Get total tasks count with the new filter
      const totalTasks = await taskModel.countDocuments(taskFilter);
  
      // Get total accepted collaborative projects count
      const acceptedCollaborativeProjects = await taskModel.distinct("project", {
        ...filter,
        iscollaborator: true,
        collabrationstatus: "accept"
      });
  
      // Fetch paginated tasks
      const tasks = await taskModel
        .find(taskFilter)
        .skip(skip)
        .limit(limit)
        .sort({ taskCreatedAt: -1 })
        .populate("project", "projectName")
        .populate("taskAssignedTo", "name email")
        .populate("taskAssignedBy", "name email");
  
      // Return response
      return new Response(
        JSON.stringify({
          tasks,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks,
            totalAcceptedCollaborativeProjects: acceptedCollaborativeProjects.length
          }
        }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: "Something went wrong while fetching tasks",
          error: error.message
        }),
        { status: 500 }
      );
    }
  }
  