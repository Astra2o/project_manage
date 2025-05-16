// import connectDB from "@/lib/db";
// import Employee from "@/models/Employee";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse, ApiResponse, JwtPayload } from '@/types/api';
import { IEmployee } from '@/types/models';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    await connectDB();
    const { email, password }: LoginRequest = await req.json();
    
    const employee = await Employee.findOne({ email }).select("+password") as IEmployee | null;
    console.log("--------------------------------");
    console.log(employee);
    console.log("--------------------------------");
    
    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials", error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, employee.password!);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials", error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role } as JwtPayload,
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Extract only the necessary user data
    const userData = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      position: employee.position,
      employeeId: employee.employeeId,
      permissions: employee.permissions,
      skills: employee.skills
    };

    return NextResponse.json(
      { success: true, message: "Login successful", data: { token, user: userData } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error logging in", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
