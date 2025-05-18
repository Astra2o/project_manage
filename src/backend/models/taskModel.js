import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String},
  taskStatus: { type: String, enum: ["pending","hold", "in-progress", "completed"], default: "pending" },
  taskAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  taskAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
