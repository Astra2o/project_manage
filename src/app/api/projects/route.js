



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

    // Check permissions
    const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });

    // Query params
    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get("projectName");
    const collabParam = searchParams.get("collab");

    let filter = {};

    if (hasPermission.success) {
      if (projectName) filter.projectName = { $regex: projectName, $options: "i" };
    } else {
      // ❌ Permission nahi hai toh by default apne hi assigned projects dekh sakta hai
      filter.$or = [
        { teamManager: user.id },
        { developers: user.id }
      ];

      // ✅ Agar collab param bhi hai toh usme bhi check kare
      if (collabParam === "true") {
        filter.$or.push({ collaborators: user.id });
      }

      // ✅ Agar projectName param bhi diya hai toh uska bhi check lagao
      if (projectName) {
        filter.projectName = { $regex: projectName, $options: "i" };
      }
    
      
    }

    // Fetch projects with required fields and populate
    const projects = await projectModel.find(filter)
      .populate("teamManager", "_id name")
      .populate("developers", "_id name")
      .lean();

    // If no projects found
    if (!projects.length) {
      return new Response(JSON.stringify({ projects: [] }), { status: 200 });
    }

    // Collect all project IDs for aggregation
    const projectIds = projects.map(p => p._id);

    // Aggregate task stats grouped by project and taskStatus
    const taskStats = await taskModel.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: { project: "$project", status: "$taskStatus" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Organize stats for quick lookup
    const statsMap = {};
    taskStats.forEach(stat => {
      const projectId = stat._id.project.toString();
      const status = stat._id.status;

      if (!statsMap[projectId]) {
        statsMap[projectId] = {};
      }
      statsMap[projectId][status] = stat.count;
    });

    // Prepare final response
    const projectData = projects.map(project => {
      const taskCounts = statsMap[project._id.toString()] || {};
      const totalTasks = Object.values(taskCounts).reduce((a, b) => a + b, 0);
      console.log(project.teamManager);
      
      return {
        projectName: project.projectName,
        _id: project._id,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate,
        deadLine: project.deadLine,
        projectDescription: project.projectDescription,
        teamManager : project.teamManager ,
        developers: project.developers,
        tasks: {
          totalTasks,
          pendingTasks: taskCounts["pending"] || 0,
          inProgressTasks: taskCounts["in-progress"] || 0,
          completedTasks: taskCounts["completed"] || 0,
          holdTasks: taskCounts["hold"] || 0
        }
      };
    });

    return new Response(JSON.stringify({ projects: projectData }), { status: 200 });

  } catch (error) {
    console.error("GET PROJECTS API ERROR:", error);
    return new Response(JSON.stringify({ message: "Error fetching projects", error: error.message }), { status: 500 });
  }
}

  


// export async function GET(req) {
//     try {
//         await connectDB();

//         // Verify JWT Token
//         const token = req.headers.get("authorization")?.split(" ")[1];
//         if (!token) {
//             return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
//         }

//         const user = authenticate(token); // Extract user info from token
//         if (!user) {
//             return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
//         }

//         // Check if user has permission to view all projects
//         const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });

//         // Extract query parameters
//         const { searchParams } = new URL(req.url);
//         const projectName = searchParams.get("projectName");

//         let filter = {};

//         if (hasPermission.success) {
//             // ✅ If user has permission, allow filtering by projectName
//             if (projectName) filter.projectName = { $regex: projectName, $options: "i" };
//         } else {
//             // ❌ If user has no permission, restrict to their assigned projects
//             filter.developers = user.id;
//         }

//         // Fetch projects with only projectName and status
//         const projects = await projectModel.find(filter, "projectName status");

//         // // Count tasks for each project
//         // const projectData = await Promise.all(
//         //     projects.map(async (project) => {
//         //         const taskCount = await taskModel.countDocuments({ project: project._id });
//         //         return {
//         //             projectName: project.projectName,
//         //             status: project.status,
//         //             taskCount,
//         //         };
//         //     })
//         // );

//         return new Response(JSON.stringify({ projects: projectData }), { status: 200 });

//     } catch (error) {
//         return new Response(JSON.stringify({ message: "Error fetching projects", error: error.message }), { status: 500 });
//     }
// }
