import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import taskModel from "@/backend/models/taskModel";
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, JwtPayload } from '@/types/api';
import { ITask } from '@/types/models';

interface TaskResponse {
  tasks: ITask[];
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<TaskResponse>>> {
    try {
        await connectDB();

        // Verify JWT Token
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized", error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = authenticate(token) as JwtPayload | undefined;
        if (!user || !user.id || !user.email || !user.role) {
            return NextResponse.json(
                { success: false, message: "Invalid token", error: "Invalid token" },
                { status: 403 }
            );
        }

        // Check if user has permission (Only Team Leaders or Sr. Developers can view all tasks)
        const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const assignedBy = searchParams.get("assignedBy");
        const assignedTo = searchParams.get("assignedTo");
        const projectId = searchParams.get("projectId");
        const taskStatus = searchParams.get("taskStatus") as ITask['taskStatus'] | null;

        let filter: Record<string, any> = {};

        if (hasPermission.success) {
            // If user has permission, allow all filters
            if (assignedBy) filter.taskAssignedBy = assignedBy;
            if (assignedTo) filter.taskAssignedTo = assignedTo;
            if (projectId) filter.project = projectId;
            if (taskStatus) filter.taskStatus = taskStatus;
        } else {
            // If user doesn't have permission, restrict to their assigned tasks
            filter.taskAssignedTo = user.id;
            if (projectId) filter.project = projectId;
        }

        // Fetch tasks based on the filters
        const tasks = await taskModel.find(filter);

        return NextResponse.json(
            { success: true, message: "Tasks fetched successfully", data: { tasks } },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong while fetching tasks", error: (error as Error).message },
            { status: 500 }
        );
    }
}