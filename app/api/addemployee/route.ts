import { authenticate } from '@/backend/middleware/auth';
import { havingPermission } from '@/backend/middleware/havingPermission';
import connectDB from '@/backend/models/db';
import Employee from '@/backend/models/Employee';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, JwtPayload } from '@/types/api';
import { CreateEmployeeInput } from '@/types/models';

interface AddEmployeeRequest extends CreateEmployeeInput {
  password: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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
    console.log(user);
    
    // if ( !user.id ||  !user.role) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid token", error: "Invalid token" },
    //     { status: 403 }
    //   );
    // }

    const havingPermit = await havingPermission(user.id, { requiredRoles: ["add_employees"] });
    if (!havingPermit.success) {
      return NextResponse.json(
        { success: false, message: "Access denied", error: "Access denied" },
        { status: 403 }
      );
    }

    // Extract request data
    const { name, email, password, skills, role, position, permissions } = await req.json() as AddEmployeeRequest;

    // Check if the employee already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Employee already exists", error: "Employee already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Employee ID based on role
    const count = await Employee.countDocuments({ role });
    const employeeId = `EK${role.toUpperCase().substring(0, 3)}${String(count + 1).padStart(2, "0")}`;

    // Create and save the new employee
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      skills,
      role,
      position,
      employeeId,
      permissions
    });
    await newEmployee.save();

    return NextResponse.json(
      { success: true, message: "Employee registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { success: false, message: "Error registering employee", error: errorMessage },
      { status: 500 }
    );
  }
}
