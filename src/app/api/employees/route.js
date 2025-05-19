import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import projectModel from "@/backend/models/projectModel";
import taskModel from "@/backend/models/taskModel";

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

    // Permission check
    const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });
    if (!hasPermission) {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    // Fetch all employees
    const employees = await Employee.find();

    // Loop and build each employee's stats
    const employeeStats = await Promise.all(
      employees.map(async (emp) => {
        // Project Count (projects where employee is assigned)
        const projectCount = await projectModel.countDocuments({ developers: emp._id });

        // Task Count by status
        const totalTasks = await taskModel.countDocuments({ taskAssignedTo: emp._id });
        const pendingTasks = await taskModel.countDocuments({ taskAssignedTo: emp._id, taskStatus: "pending" });
        const onHoldTasks = await taskModel.countDocuments({ taskAssignedTo: emp._id, taskStatus: "onhold" });
        const completedTasks = await taskModel.countDocuments({ taskAssignedTo: emp._id, taskStatus: "completed" });

        
        
        return {
          emp,
          projects: projectCount,
          tasks: {
            total: totalTasks,
            pending: pendingTasks,
            onHold: onHoldTasks,
            completed: completedTasks
          }
        };
      })
    );
    console.log(employeeStats);
    

    return new Response(JSON.stringify({ employees:employeeStats }), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching employee stats", error: error.message }),
      { status: 500 }
    );
  }
}
