


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../../backend/models/Employee";
import connectDB from "../../backend/models/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const employee = await Employee.findOne({ email }).select("+password");
  //  console.log(employee);
  console.log();
   
   
    if (!employee) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("tokan");
    
 
    return new Response(JSON.stringify({ token,user:employee }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error logging in", error }), { status: 500 });
  }
}
