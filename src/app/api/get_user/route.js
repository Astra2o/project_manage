import { authenticate } from '@/backend/middleware/auth';
import { havingPermission } from '@/backend/middleware/havingPermission';
import connectDB from '@/backend/models/db';
import Employee from '@/backend/models/Employee';
import bcrypt from 'bcrypt';


export async function GET(req) {
  try {
    await connectDB();

    // Verify JWT Token
    
    const token = req.headers.get("authorization")?.split(" ")[1];
    // console.log(token);
    
    
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  //  console.log(token);


   
    const user = authenticate(token); // Extract user info from token
    if (!user) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    

   
    const userdata= await Employee.findById(user.id)

    if (userdata) {
        
        return new Response(JSON.stringify({ success:true,user }), { status: 201 });
    }else{
         return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    
    }
  
  
 
  
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error get  employee", error: error.message }), { status: 500 });
  }
}
