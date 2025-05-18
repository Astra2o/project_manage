import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true ,select:false},
  skills: { type: [String], required: true },
  role: { type: String, required: true, enum: ["admin","digital marketing", "developer", "uiux", "seo", "cto","manager"] },
  position: { type: String, required: true }, // Example: Sr. Developer, Intern
  employeeId: { type: String, unique: true },
  permissions: { type: [String], default: [] },
});

export default mongoose.models.Employee || mongoose.model("Employee", employeeSchema);