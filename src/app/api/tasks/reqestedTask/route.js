import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import projectModel from "@/backend/models/projectModel";
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

    const user = await authenticate(token);
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }

    // Check if user has permission (Only Team Leaders or Sr. Developers can view all tasks)
    const hasPermission = await havingPermission(user.id, { requiredRoles: ["manager"] });
    if (!hasPermission.success) {
      return new Response(JSON.stringify({ message: "You have no permission" }), { status: 403 });
    }

    // Get team members for teams where user is teamLeader
    const teams = await teamsModel.find({ teamLeader: user.id }).select("teamMembers");
    const teamMemberIds = teams.flatMap((team) =>
      team.teamMembers.map((member) => member.toString())
    );

    // Find tasks assigned to team members with collaboration requested & collaborative true
    const tasks = await taskModel.find({
      iscollaborator: true,
      collabrationstatus: "requested",
      taskAssignedTo: { $in: teamMemberIds }
    })
    .select('taskName description taskAssignedTo taskAssignedBy projectName createdAt _id')
    .populate({
      path: 'taskAssignedTo',
      select: 'name email'
    })
    .populate({
      path: 'taskAssignedBy',
      select: 'name email'
    })
    .populate({
      path: 'project',
      select: 'projectName'
    })
    .sort({ createdAt: -1 });

    // Return tasks in response
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Something went wrong while fetching tasks", error: error.message }),
      { status: 500 }
    );
  }
}



export async function PUT(req) {
    try {
      await connectDB();
  
      // Verify JWT Token
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      }
  
      const user = await authenticate(token);
      if (!user) {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
      }
  
      // Parse JSON body from frontend
      const { taskId, status } = await req.json();
  
      if (!taskId || !status) {
        return new Response(JSON.stringify({ message: "taskId and status are required" }), { status: 400 });
      }
  
      // Update task's collabrationstatus
      const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        { collabrationstatus: status },
        { new: true }
      );
  
      if (!updatedTask) {
        return new Response(JSON.stringify({ message: "Task not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({success:true, message: "Task updated successfully", task: updatedTask }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({message: "Something went wrong", error: error.message }), { status: 500 });
    }
  }