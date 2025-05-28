"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { toast } from "sonner";

const NewtaskForm = ({ isProject, selectedProject }) => {
  const [myTeam, setMyTeam] = useState(null);
  const [otherEmployees, setOtherEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    taskName: "",
    project: "",
    assignTo: "",
    isCollaboration: false,
    collaborator: "",
    startDate: null,
    endDate: null,
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myTeamRes, otherEmpRes] = await Promise.all([
          api.get("/teams/get/getmyteam"),
          api.get("/employees/getemployeeslist"),
        ]);

        const team = myTeamRes.data.team;
        const allEmps = otherEmpRes.data.employees;

        const availableEmployees = allEmps?.filter(
          (emp) =>
            !team.teamMembers.some((member) => member._id === emp._id) &&
            emp._id !== team.teamLeader._id
        );

        setMyTeam(team);
        setOtherEmployees(availableEmployees);

        if (!isProject) {
          const projectRes = await api.get("/projects/get/getmyprojectlist");
          setProjects(projectRes.data.projects);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isProject]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskName.trim()) newErrors.taskName = "Task Name is required";
    if (!isProject && !formData.project)
      newErrors.project = "Project is required";
    if (!formData.isCollaboration && !formData.assignTo)
      newErrors.assignTo = "Assign To is required";
    if (formData.isCollaboration && !formData.collaborator)
      newErrors.collaborator = "Collaborator is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          taskName: formData.taskName,
          project: isProject ? selectedProject : formData.project,
          taskAssignedTo: formData.isCollaboration
            ? formData.collaborator
            : formData.assignTo,
          iscollaborator: formData.isCollaboration,
          startDate: formData.startDate,
          deadline: formData.endDate,
          taskDescription: formData.description,
        };

        const response = await api.post("/tasks/create", payload);
        if (response.status === 201) {
          toast.success("Task created successfully!");
          // Reset form
          setFormData({
            taskName: "",
            project: "",
            assignTo: "",
            isCollaboration: false,
            collaborator: "",
            startDate: null,
            endDate: null,
            description: "",
          });
        }
      } catch (error) {
        console.error("Error creating task:", error);
        if (error.response) {
          toast.error(error.response.data?.message || "Failed to create task");
        } else if (error.request) {
          toast.error("No response from server");
        } else {
          toast.error("Failed to create task. Please try again.");
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name */}

        <div className="flex flex-col gap-4 md:flex-row">

        <div className="w-full">
          <Label>Task Name</Label>
          <Input
            value={formData.taskName}
            onChange={(e) => handleChange("taskName", e.target.value)}
            className={clsx(errors.taskName && "border-red-500")}
            placeholder="Enter Task Name"
          />
        </div>

        {/* Project, Collaboration, Collaborator */}
        <div className="flex flex-col  w-full ">
          <Label>Project</Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={clsx(
                  "w-full justify-between",
                  errors.project && "border-red-500"
                )}
                disabled={isProject}
              >
                {formData.project
                  ? isProject
                    ? "Selected Project"
                    : projects.find((p) => p._id === formData.project)
                        ?.projectName
                  : "Select Project"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search project..." />
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandGroup>
                    {(isProject
                      ? [
                          {
                            _id: selectedProject,
                            projectName: "Selected Project",
                          },
                        ]
                      : projects
                    ).map((p) => (
                      <CommandItem
                        key={p._id}
                        value={p.projectName}
                        onSelect={() => handleChange("project", p._id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.project === p._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {p.projectName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 w-full">
            <div className="flex items-center flex-col space-x-2">
              <Label htmlFor="isCollaboration">Collaboration</Label>
              <Switch
                id="isCollaboration"
                checked={formData.isCollaboration}
                onCheckedChange={(val) => handleChange("isCollaboration", val)}
              />
            </div>

            {formData.isCollaboration ? (
              <div className="flex flex-col flex-1">
                <Label>Assign to Other Team</Label>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={clsx(
                        "w-full justify-between",
                        errors.collaborator && "border-red-500"
                      )}
                    >
                      {formData.collaborator
                        ? otherEmployees.find(
                            (emp) => emp._id === formData.collaborator
                          )?.name
                        : "Select Collaborator"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search collaborator..." />
                      <CommandEmpty>No collaborator found.</CommandEmpty>
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                          {otherEmployees.map((emp) => (
                            <CommandItem
                              key={emp._id}
                              value={emp.name}
                              onSelect={() =>
                                handleChange("collaborator", emp._id)
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.collaborator === emp._id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {emp.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <Label>Assign To</Label>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={clsx(
                        "w-full justify-between",
                        errors.assignTo && "border-red-500"
                      )}
                    >
                      {formData.assignTo
                        ? myTeam?.teamMembers.find(
                            (m) => m._id === formData.assignTo
                          )?.name
                        : "Select Team Member"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput placeholder="Search team member..." />
                      <CommandEmpty>No team member found.</CommandEmpty>
                      <CommandList className="max-h-60  overflow-y-auto">
                        <CommandGroup>
                          {myTeam?.teamMembers.map((m) => (
                            <CommandItem
                              key={m._id}
                              value={m.name}
                              onSelect={() => handleChange("assignTo", m._id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.assignTo === m._id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {m.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="flex flex-1 w-full gap-4">
            <div className="flex flex-col flex-1">
              <Label>Start Date</Label>
              <DatePickerDemo
                value={formData.startDate}
                onChange={(val) => handleChange("startDate", val)}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Label>End Date</Label>
              <DatePickerDemo
                value={formData.endDate}
                onChange={(val) => handleChange("endDate", val)}
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={clsx(errors.description && "border-red-500")}
            style={{ height: "120px", resize: "none" }}
            placeholder="Task description..."
          />
        </div>

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </div>
  );
};

export default NewtaskForm;
