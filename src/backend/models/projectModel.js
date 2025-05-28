import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    teamManager : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    collaborators: {
      type: [
        {
          empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
          status: {
            type: String,
            enum: ["requested", "reject", "accept"],
            default: "requested",
          },
        },
      ],
      select: false,
    },

    // 👇 tasks ko by default query me na laaye
    tasks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Task", select: false },
    ],

    status: {
      type: String,
      enum: ["onhold", "active", "completed"],
      default: "active",
    },
    completionDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    // 👇 date fields
    startDate: { type: Date, default: Date.now },
    deadLine: { type: Date },

    projectDescription: { type: String },
  },
  {
    timestamps: true, // 👈 isse createdAt & updatedAt dono aa jayenge
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
