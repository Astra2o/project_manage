import { authenticate } from '@/backend/middleware/auth';
import { havingPermission } from '@/backend/middleware/havingPermission';
import connectDB from '@/backend/models/db';
import Employee from '@/backend/models/Employee';
import bcrypt from 'bcrypt';
// import connectDB from "@/app/lib/db";
// import EmployeesModel from "@/app/lib/models/EmployeesModel";
// import { authenticate } from '@/app/lib/middleware/auth';
// import { havingPermission } from '@/app/lib/middleware/havingPermission';
// // import { verifyToken } from "@/app/lib/auth"; // Function to verify JWT

export async function POST(req) {
  try {
    await connectDB();

    // Verify JWT Token
    
    const token = req.headers.get("authorization")?.split(" ")[1];
    // console.log(token);
    
    
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  //  console.log(token);


   
    const user = authenticate(token); // Extract user info from token
    if (!user) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    

    const havingPermit = await havingPermission(user.id,{requiredRoles:["add_employees"]})
    console.log(havingPermit.success);
    if (!havingPermit.success) {
              return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });

    }


    // // Check if user has permission to add an employee
    // const allowedRoles = ["manager", "hr", "admin"];
    // if (!user.permissions.includes("employee_manage") && !allowedRoles.includes(user.role)) {
    //   return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    // }

    // Extract request data
    const { name, email, password, skills, role, position,permissions } = await req.json();

    // Check if the employee already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) return new Response(JSON.stringify({ message: "Employee already exists" }), { status: 400 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Employee ID based on role
    const count = await Employee.countDocuments({ role });
    const employeeId = `EK${role.toUpperCase().substring(0, 3)}${String(count + 1).padStart(2, "0")}`;

    // Create and save the new employee
    const newEmployee = new Employee({ name, email, password: hashedPassword, skills, role, position, employeeId,permissions });
    await newEmployee.save();

    return new Response(JSON.stringify({ message: "Employee registered successfully" }), { status: 201 });
  
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error registering employee", error: error.message }), { status: 500 });
  }
}
