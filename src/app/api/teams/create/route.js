import { authenticate } from "@/backend/middleware/auth";
import { havingPermission } from "@/backend/middleware/havingPermission";
import connectDB from "@/backend/models/db";
import Employee from "@/backend/models/Employee";
import teamsModel from "@/backend/models/teamsModel";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = authenticate(token);
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    const permissionCheck = await havingPermission(user.id, {
      requiredRoles: ["admin"],
    });

    if (!permissionCheck.success) {
      return new Response(
        JSON.stringify({ message: "Access denied. Permission denied." }),
        { status: 403 }
      );
    }

    const body = await req.json();

    const { teamName, tech, teamLeader, teamMembers } = body;

    // Basic validation
    if (!teamName || !teamLeader || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }

    // Check duplicate team name
    const existingTeam = await teamsModel.findOne({ teamLeader});
    if (existingTeam) {
      return new Response(
        JSON.stringify({ message: "Team leader is  already manage a team" }),
        { status: 409 }
      );
    }

    // Validate that teamLeader exists
    const leader = await Employee.findById(teamLeader);
    if (!leader) {
      return new Response(
        JSON.stringify({ message: "Invalid team leader ID." }),
        { status: 404 }
      );
    }

    // Validate that teamMembers exist
    const members = await Employee.find({ _id: { $in: teamMembers } });
    if (members.length !== teamMembers.length) {
      return new Response(
        JSON.stringify({ message: "Some team members not found." }),
        { status: 404 }
      );
    }





    // Create new team
    const newTeam = new teamsModel({
      teamName: teamName.trim(),
      tech: tech || [],
      teamLeader,
      teamMembers,
    });

    await newTeam.save();

        // 👇 Update leader role to "manager"
    leader.role = "manager";
    await leader.save();

   // Remove all members and teamLeader from other teams (except this new team)
const removeFromTeams = [...teamMembers, teamLeader];
await teamsModel.updateMany(
  { _id: { $ne: newTeam._id }, teamMembers: { $in: removeFromTeams } },
  { $pull: { teamMembers: { $in: removeFromTeams } } }
);

    return new Response(
      JSON.stringify({
        message: "Team created successfully",
        team: newTeam,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to create team",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}






export async function PATCH(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    const user = authenticate(token);
    if (!user)
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });

    const permissionCheck = await havingPermission(user.id, {
      requiredRoles: ["admin"],
    });

    if (!permissionCheck.success) {
      return new Response(
        JSON.stringify({ message: "Access denied. Permission denied." }),
        { status: 403 }
      );
    }

    const body = await req.json();
    const { teamId, teamMembers } = body;

    if (!teamId || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      return new Response(
        JSON.stringify({ message: "Missing teamId or teamMembers." }),
        { status: 400 }
      );
    }

    // Check team exists
    const existingTeam = await teamsModel.findById(teamId);
    if (!existingTeam) {
      return new Response(
        JSON.stringify({ message: "Team not found." }),
        { status: 404 }
      );
    }

    // Validate that teamMembers exist
    const members = await Employee.find({ _id: { $in: teamMembers } });
    if (members.length !== teamMembers.length) {
      return new Response(
        JSON.stringify({ message: "Some team members not found." }),
        { status: 404 }
      );
    }

    // Update team members
    existingTeam.teamMembers = teamMembers;
    await existingTeam.save();

    return new Response(
      JSON.stringify({
        message: "Team members updated successfully.",
        updatedTeam: existingTeam,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team members:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update team members",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
