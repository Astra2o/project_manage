import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String},
  taskStatus: { type: String, enum: ["pending","hold", "in-progress", "completed"], default: "pending" },
  taskAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  taskAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  startDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  taskCompletedAt: { type: Date },
  taskComments: [{
    comment: { type: String },
    commentBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    commentByName:{ type: String },
    commentAt: { type: Date, default: Date.now },
  }], 
  iscollaborator: { type: Boolean, default: false },
  collabrationstatus: { type: String, enum: ["accept","reject", "requested"], default: "requested" },
  
  
}, {
  timestamps: true, // 👈 isse createdAt & updatedAt dono aa jayenge
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
