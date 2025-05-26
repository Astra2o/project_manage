import { authenticate } from "@/backend/middleware/auth";
import connectDB from "@/backend/models/db";
import teamsModel from "@/backend/models/teamsModel";

export async function GET(req) {
  try {
    await connectDB();

    // JWT Token check
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = authenticate(token);
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 403 });
    }

    // Find one team where the user is either team leader or team member
    const team = await teamsModel.findOne({
      $or: [
        { teamLeader: user.id },
        { teamMembers: user.id }
      ]
    })
    .populate({
      path: 'teamLeader',
      select: 'name position _id role'
    })
    .populate({
      path: 'teamMembers',
      select: 'name position _id role'
    });

    if (!team) {
      return new Response(JSON.stringify({ message: "No team found" }), { status: 404 });
    }

    // // Format the response
    // const formattedTeam = {
    //   teamName: team.teamName,
    //   _id: team._id,
    //   tech: team.tech,
    //   teamLeader: {
    //     name: team.teamLeader.name,
    //     position: team.teamLeader.position,
    //     employeeId: team.teamLeader.employeeId,
    //     role: team.teamLeader.role
    //   },
    //   teamMembers: team.teamMembers.map(member => ({
    //     name: member.name,
    //     position: member.position,
    //     employeeId: member.employeeId,
    //     role: member.role
    //   }))
    // };

    return new Response(JSON.stringify({ team }), { status: 200 });

  } catch (error) {
    console.error("Error fetching team:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch team", error: error.message }),
      { status: 500 }
    );
  }
}
