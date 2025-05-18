import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import projectModel from "@/backend/models/projectModel";




export async function POST(req) {

    try {
        await connectDB();

        // verify jwt
        const token = req.headers.get("authorization")?.split(" ")[1];
       
        if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

      const user = authenticate(token); // Extract user info from token
         if (!user) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
         
    // check having permission perform this action

     const havingPermit = await havingPermission(user.id,{requiredPermissions:['add_project'],requiredRoles:['team_leader',"sr. developer"]})
        console.log(havingPermit.success);
        if (!havingPermit.success) {
                  return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    
        }
       


        console.log(" -----------------------");
        const body = await req.json(); // Convert the request body to JSON
        const { projectName, clientName, clientEmail, developers } = body;

        const existingProject = await projectModel.findOne({ projectName });
            if (existingProject) return new Response(JSON.stringify({ message: "Project already exists" }), { status: 400 });
        
              // Create and save the new employee
                const newproject = new projectModel({ projectName,clientName,clientEmail,developers });
                await newproject.save();
            
                return new Response(JSON.stringify({ message: "project created successfully",newproject }), { status: 201 });
              

    } catch (error) {
        return new Response(JSON.stringify({ message: "Error creating project", error: error.message }), { status: 500 });

    }
    
}