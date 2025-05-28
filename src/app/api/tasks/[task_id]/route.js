import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import taskModel from "@/backend/models/taskModel";
import teamsModel from "@/backend/models/teamsModel";
import projectModel from "@/backend/models/projectModel";
import connectDB from "@/backend/models/db";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = authenticate(token);
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    const { task_id } = params;

    let task;
    console.log(user);

    if (user.role === "manager") {
      // apni team ke members lelo (maan ke chalte hain ki managerId field hai user me)
      const teams = await teamsModel
        .find({ teamLeader: user.id })
        .select("teamMembers");
      const teamMemberIds = teams.flatMap((team) =>
        team.teamMembers.map((member) => member.toString())
      );

      console.log("teammembers:", teamMemberIds);

      // ab task find kro jo manager ke access me hai
      task = await taskModel
        .findOne({
          _id: task_id,
          $or: [
            { taskAssignedTo: user.id }, // manager ko assigned
            { taskAssignedBy: user.id }, // manager ne assign kiya
            {
              iscollaborator: true,
              collabrationstatus: "accept",
              taskAssignedTo: { $in: teamMemberIds }, // team members ko collaboration wale accepted task
            },
          ],
        })
        .populate("taskAssignedTo", "_id name role")
        .populate("taskAssignedBy", "_id name role")
        .populate("project", "_id projectName")
        .populate({
          path: "taskComments.commentBy", // nested populate path
          select: "_id name role", // only these fields
          model: "Employee", // your ref model name
        });
    } else {
      // agar normal user hai to sirf apna task dekh sakta
      task = await taskModel
        .findOne({ _id: task_id, taskAssignedTo: user.id })
        .populate("taskAssignedTo", "_id name role")
        .populate("taskAssignedBy", "_id name role")
        .populate("project", "_id projectName")
        .populate({
          path: "taskComments.commentBy", // nested populate path
          select: "_id name role", // only these fields
          model: "Employee", // your ref model name
        });
    }

    if (!task) {
      return new Response(
        JSON.stringify({ message: "Task not found or you don't have access" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ task }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong while getting task",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = authenticate(token);
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    const { task_id } = params;
    const { taskStatus } = await req.json();

    if (!taskStatus)
      return new Response(JSON.stringify({ message: "Status is required" }), {
        status: 400,
      });

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: task_id, taskAssignedTo: user.id },
      { $set: { taskStatus } },
      { new: true }
    );

    if (!updatedTask) {
      return new Response(
        JSON.stringify({ message: "Task not found or not assigned to you" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Task status updated successfully",
        // task: updatedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong while updating task status",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = authenticate(token);
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    // Normal user ka access deny
    if (user.role !== "manager") {
      return new Response(
        JSON.stringify({
          message: "Access denied. Only managers can update tasks.",
        }),
        { status: 403 }
      );
    }

    const { task_id } = params;
    const updateData = await req.json();

    if (updateData.taskStatus) {
      return new Response(
        JSON.stringify({ message: "Use PUT API for status update only" }),
        { status: 400 }
      );
    }

    // Manager apne diye hue task update kar sake
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: task_id, taskAssignedBy: user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedTask) {
      return new Response(
        JSON.stringify({ message: "Task not found or not assigned by you" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Task updated successfully",
        task: updatedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong while updating task",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// // UPDATE STATUS BY USER --- PUT REQ SEND NEW STATUS IN BODY AND UPDATE ONLY OWN TASK STATUS
// export async function PUT(req, { params }) {
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

//         // Extract Task ID from params
//         const { task_id } = params;

//         // Parse request body
//         const { status } = await req.json();
//         if (!status) {
//             return new Response(JSON.stringify({ message: "Status is required" }), { status: 400 });
//         }

//         // Find and update task status (only if assigned to user)
//         const updatedTask = await taskModel.findOneAndUpdate(
//             { _id: task_id, taskAssignedTo: user.id },
//             { $set: { taskStatus: status } },
//             { new: true }
//         );

//         if (!updatedTask) {
//             return new Response(JSON.stringify({ message: "Task not found or access denied" }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ message: "Task status updated successfully", task: updatedTask }), { status: 200 });

//     } catch (error) {
//         return new Response(JSON.stringify({ message: "Something went wrong while updating task status", error: error.message }), { status: 500 });
//     }}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // Verify JWT Token

    const token = req.headers.get("authorization")?.split(" ")[1];
    // console.log(token);

    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    //  console.log(token);
    const user = authenticate(token); // Extract user info from token
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    const havingPermit = await havingPermission(user.id, {
      requiredRoles: ["team_leader", "sr_developer"],
    });
    console.log(havingPermit.success);
    if (!havingPermit.success) {
      return new Response(JSON.stringify({ message: "Access denied" }), {
        status: 403,
      });
    }

    const { task_id } = params;

    const task = await taskModel.findOneAndDelete({ _id: task_id });

    if (task) {
      return new Response(JSON.stringify({ task }), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "something went wrong WHILE getting task" })
    );
  }
}
