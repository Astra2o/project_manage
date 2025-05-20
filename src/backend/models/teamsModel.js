import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  tech: [{ type: String}],
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }],
});

export default mongoose.models.Team || mongoose.model("Team", teamSchema);