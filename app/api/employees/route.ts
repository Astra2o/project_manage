import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, JwtPayload } from '@/types/api';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
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
    if ( !user.id || !user.role) {
      return NextResponse.json(
        { success: false, message: "Invalid token", error: "Invalid token" },
        { status: 403 }
      );
    }

    // Check if user has permission to view all employees
    const hasPermission = await havingPermission(user.id, { requiredRoles: ["admin", "manager"] });
    if (!hasPermission.success) {
      return NextResponse.json(
        { success: false, message: "Forbidden", error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Fetch all employees
    const employees = await Employee.find();

    return NextResponse.json(
      { success: true, message: "Employees fetched successfully", data: { employees } },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching employees", error: (error as Error).message },
      { status: 500 }
    );
  }
}
