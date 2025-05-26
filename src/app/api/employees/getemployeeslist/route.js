import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import projectModel from "@/backend/models/projectModel";
import taskModel from "@/backend/models/taskModel";


export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = authenticate(token);
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }

    const hasPermission = await havingPermission(user.id, {
      requiredRoles: ["team_leader", "sr_developer","manager"],
    });

    if (!hasPermission) {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");   // only / exclude
    const rolesParam = searchParams.get("roles"); // comma separated string

    let query = {};

    if (rolesParam) {
      const rolesArray = rolesParam.split(",").map(r => r.trim());

      if (filter === "exclude") {
        query.role = { $nin: rolesArray };
      } else if (filter === "only") {
        query.role = { $in: rolesArray };
      }
    }

    const employees = await Employee.find(query, "name _id role position");

    return new Response(JSON.stringify({ employees }), { status: 200 });

  } catch (error) {
    console.error("Error fetching employee stats:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching employee stats", error: error.message }),
      { status: 500 }
    );
  }
}














// export async function GET(req) {
//   try {
//     await connectDB();

//     // JWT Token check
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
//     }

//     const user = authenticate(token);
//     if (!user) {
//       return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
//     }

//     // Permission check
//     const hasPermission = await havingPermission(user.id, { requiredRoles: ["team_leader", "sr_developer"] });
//     if (!hasPermission) {
//       return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
//     }

//     // Fetch all employees
// const employees = await Employee.find({}, "name _id role position");

//     // Loop and build each employee's stats
  
    

//     return new Response(JSON.stringify({ employees }), { status: 200 });

//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: "Error fetching employee stats", error: error.message }),
//       { status: 500 }
//     );
//   }
// }
