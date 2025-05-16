import connectDB from "@/app/lib/db";
import { authenticate } from "@/app/lib/middleware/auth";
import { havingPermission } from "@/app/lib/middleware/havingPermission";
import taskModel from "@/app/lib/models/taskModel";





export async function GET(req:any,{params}){


    try {
        await connectDB();

        // Verify JWT Token
        
        const token = req.headers.get("authorization")?.split(" ")[1];
        // console.log(token);
        
        
        if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      //  console.log(token);
     const user = authenticate(token); // Extract user info from token
     if (!user) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        

        //  const havingPermit = await havingPermission(user.id,{requiredRoles:["team_leader","sr_developer"]})
        //     console.log(havingPermit.success);
        //     if (!havingPermit.success) {
        //               return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
        
        //     }



            const {task_id} = params;

            const task = await taskModel.findOne({_id:task_id,taskAssignedTo:user.id})
            
            if(task){
                return new Response(JSON.stringify({ task}), { status: 200 });

            }

    } catch (error) {

        return new Response(JSON.stringify({ message: "something went wrong WHILE getting task" }));

        
    }


}













export async function DELETE(req:any,{params}){


    try {
        await connectDB();

        // Verify JWT Token
        
        const token = req.headers.get("authorization")?.split(" ")[1];
        // console.log(token);
        
        
        if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      //  console.log(token);
     const user = authenticate(token); // Extract user info from token
     if (!user) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        

         const havingPermit = await havingPermission(user.id,{requiredRoles:["team_leader","sr_developer"]})
            console.log(havingPermit.success);
            if (!havingPermit.success) {
                      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
        
            }



            const {task_id} = params;

            const task = await taskModel.findOneAndDelete({_id:task_id})
            
            if(task){
                return new Response(JSON.stringify({ task}), { status: 200 });

            }

    } catch (error) {

        return new Response(JSON.stringify({ message: "something went wrong WHILE getting task" }));

        
    }


}


// UPDATE STATUS BY USER --- PUT REQ SEND NEW STATUS IN BODY AND UPDATE ONLY OWN TASK STATUS
export async function PUT(req, { params }) {
    try {
        await connectDB();

        // Verify JWT Token
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const user = authenticate(token); // Extract user info from token
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
        }

        // Extract Task ID from params
        const { task_id } = params;

        // Parse request body
        const { status } = await req.json();
        if (!status) {
            return new Response(JSON.stringify({ message: "Status is required" }), { status: 400 });
        }

        // Find and update task status (only if assigned to user)
        const updatedTask = await taskModel.findOneAndUpdate(
            { _id: task_id, taskAssignedTo: user.id },
            { $set: { taskStatus: status } },
            { new: true }
        );

        if (!updatedTask) {
            return new Response(JSON.stringify({ message: "Task not found or access denied" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Task status updated successfully", task: updatedTask }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong while updating task status", error: error.message }), { status: 500 });
    }