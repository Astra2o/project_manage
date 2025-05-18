"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multiselect"; // Custom multiselect component banana padega
import { api } from "@/lib/api";

export default function AddEmployeeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    position: "",
    skills: []
  });

  const rolePositions = {
    developer: ["Intern", "Jr. Developer", "Sr. Developer", "TL"],
    manager: ["HR Manager", "Project Manager"],
    admin: ["Admin Executive", "Admin Head"],
    uiux: ["UI Designer", "UX Designer"],
    seo: ["SEO Analyst", "SEO Manager"]
  };

//   const allSkills = [
//     "React",
//     "Next.js",
//     "Node.js",
//     "MongoDB",
//     "Figma",
//     "SEO Audit",
//     "Keyword Research",
//     "Team Handling",
//     "Project Planning",
//     "UI Wireframing"
//   ];

const skillOptions = [
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Node.js", label: "Node.js" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Figma", label: "Figma" },
];

  const roleSkills = {
    developer: ["React", "Next.js", "Node.js", "MongoDB"],
    manager: ["Team Handling", "Project Planning"],
    admin: ["Team Handling"],
    uiux: ["Figma", "UI Wireframing"],
    seo: ["SEO Audit", "Keyword Research"]
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getSkillOptions = () => {
    const selectedRoleSkills = roleSkills[formData.role] || [];
    const otherSkills = allSkills.filter(skill => !selectedRoleSkills.includes(skill));
    return [...selectedRoleSkills, ...otherSkills];
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    // axios post yaha karlo
      try {
    const response = await api.post("/addemployee", formData);
    console.log("Employee added successfully:", response.data);
    // success toast / redirect / form reset yaha kar sakte ho
  } catch (error) {
    console.error("Error adding employee:", error.response?.data || error.message);
    // error toast ya alert yaha
  }
  };


  return (
    
  <div className="w-full border mt-10 mx-auto p-6 bg-white rounded-2xl shadow">
    <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Name & Email */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Password & Role/Position */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label>Password</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-1 gap-4 flex-row">
            <div className="w-full">

          <Label>Role</Label>
          <Select onValueChange={(value) => handleChange("role", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(rolePositions)?.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>

            <div className="w-full bg-red-200">
              <Label>Position</Label>
              <Select  onValueChange={(value) => handleChange("position", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue  placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  {rolePositions[formData?.role]?.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          {/* {formData.role && (
          )} */}
        </div>
      </div>

      {/* Skills full width */}
      {formData.role && (
        <div>
          <Label>Skills</Label>
          <MultiSelect
            options={skillOptions}
            defaultValue={formData.skills}
            onValueChange={(newSkills) =>
              setFormData((prev) => ({
                ...prev,
                skills: newSkills,
              }))
            }
            placeholder="Select your skills"
            maxCount={3}
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Add Employee
      </Button>
    </form>
  </div>
);

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
//       <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Name</Label>
//           <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
//         </div>
//         <div>
//           <Label>Email</Label>
//           <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
//         </div>
//         <div>
//           <Label>Password</Label>
//           <Input type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
//         </div>
//         <div>
//           <Label>Role</Label>
//           <Select onValueChange={(value) => handleChange("role", value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Role" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(rolePositions).map((role) => (
//                 <SelectItem key={role} value={role}>{role}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {formData.role && (
//           <div>
//             <Label>Position</Label>
//             <Select onValueChange={(value) => handleChange("position", value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Position" />
//               </SelectTrigger>
//               <SelectContent>
//                 {rolePositions[formData.role].map((pos) => (
//                   <SelectItem key={pos} value={pos}>{pos}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         {formData.role && (
//           <div>
//             <Label>Skills</Label>
//             {/* <MultiSelect
//               options={getSkillOptions()}
//               selectedValues={formData.skills}
//               onChange={(values) => handleChange("skills", values)}
//             /> */}

//               <MultiSelect
//         options={skillOptions}
//         defaultValue={formData.skills}
//         onValueChange={(newSkills) =>  setFormData((prev) => ({
//       ...prev,
//       skills: newSkills,
//     }))}
//         placeholder="Select your skills"
//         maxCount={3}
//       />
//           </div>
//         )}

//         <Button type="submit" className="w-full">Add Employee</Button>
//       </form>
//     </div>
//   );
}
