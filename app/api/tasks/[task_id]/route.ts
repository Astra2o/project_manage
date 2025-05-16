import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import taskModel from "@/backend/models/taskModel";
import { JwtPayload } from "jsonwebtoken";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    const user = authenticate(token) as JwtPayload | undefined;
    if (!user || !user.id || !user.email || !user.role) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    const { task_id } = context.params;
    const task = await taskModel.findOne({ _id: task_id, taskAssignedTo: user.id });
    if (task) {
      return new Response(JSON.stringify({ task }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: "Task not found or access denied" }), { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "something went wrong WHILE getting task" }));
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    const user = authenticate(token) as JwtPayload | undefined;
    if (!user || !user.id || !user.email || !user.role) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    const havingPermit = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });
    if (!havingPermit.success) {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }
    const { task_id } = context.params;
    const task = await taskModel.findOneAndDelete({ _id: task_id });
    if (task) {
      return new Response(JSON.stringify({ task }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: "Task not found or access denied" }), { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "something went wrong WHILE deleting task" }));
  }
}

export async function PUT(req: Request, context: any) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const user = authenticate(token) as JwtPayload | undefined;
    if (!user || !user.id || !user.email || !user.role) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }
    const { task_id } = context.params;
    const { status } = await req.json();
    if (!status) {
      return new Response(JSON.stringify({ message: "Status is required" }), { status: 400 });
    }
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: task_id, taskAssignedTo: user.id },
      { $set: { taskStatus: status } },
      { new: true }
    );
    if (!updatedTask) {
      return new Response(JSON.stringify({ message: "Task not found or access denied" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Task status updated successfully", task: updatedTask }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(JSON.stringify({ message: "Something went wrong while updating task status", error: errorMessage }), { status: 500 });
  }
}