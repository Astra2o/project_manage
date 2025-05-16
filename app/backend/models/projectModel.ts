import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  // projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  clientName: { type: String, required: true, select: false },
  clientEmail: { type: String, required: true, select: false },
  teamManger:  { type: mongoose.Schema.Types.ObjectId, ref: "Employee" } ,
  developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high","critical"], default: "low" },
});

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
