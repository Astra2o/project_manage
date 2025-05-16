import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import taskModel from "@/backend/models/taskModel";
import projectModel from "@/backend/models/projectModel";
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, JwtPayload } from '@/types/api';
import { IProject } from '@/types/models';

interface ProjectData {
  projectName: string;
  status: IProject['status'];
  taskCount: number;
}

interface ProjectResponse {
  projects: ProjectData[];
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<ProjectResponse>>> {
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

        // Check if user has permission to view all projects
        const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const projectName = searchParams.get("projectName");

        let filter: Record<string, any> = {};

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

        return NextResponse.json(
            { success: true, message: "Projects fetched successfully", data: { projects: projectData } },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error fetching projects", error: (error as Error).message },
            { status: 500 }
        );
    }
}
