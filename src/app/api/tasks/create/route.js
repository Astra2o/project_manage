import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import projectModel from "@/backend/models/projectModel";
import taskModel from "@/backend/models/taskModel";

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
        

         const havingPermit = await havingPermission(user.id,{requiredRoles:["team_leader","sr_developer","manager"]})
            console.log(havingPermit.success);
            if (!havingPermit.success) {
                      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
        
            }

            const body = await req.json(); // Convert the request body to JSON

      const {project,taskName,taskDescription,taskAssignedTo,deadline,iscollaborator,startDate} =body;
      console.log(project);
      
             const existingProject = await projectModel.findOne({ _id:project });
             console.log(existingProject);
                 
                if (!existingProject) return new Response(JSON.stringify({ message: "Project not found" }), { status: 400 });
            
                  // Create and save the new employee
                    const newtask = new taskModel({project,taskName,taskDescription,taskAssignedBy:user.id,taskAssignedTo,deadline,iscollaborator,startDate });
                    await newtask.save();
                
                    return new Response(JSON.stringify({ message: "task created sucessfully" }), { status: 201 });
                  


    } catch (error) {
      return new Response(JSON.stringify({ message: "error"+error }));

    }
}