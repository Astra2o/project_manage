"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multiselect"
import { api } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerDemo } from "@/components/ui/DatePicker"

export default function AddProjectForm({ onSuccess}) {
  const [projectName, setProjectName] = useState("")
  const [managedBy, setManagedBy] = useState("")
  const [deadLine, setDeadLine] = useState("")
  const [projectdescription, setprojectdescription] = useState("")
  const [employeeList, setEmployeeList] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api("/employees/getemployeeslist?filter=only&roles=manager")
        const employeeOptions = res.data?.employees?.map((emp) => ({
          value: emp._id,
          label: emp.name,
        }))
        setEmployeeList(employeeOptions)
      } catch (error) {
        toast.error("Failed to fetch employees")
      }
    }

    fetchEmployees()
  }, [])



const handleSubmit = async () => {
  console.log("Selected Members:", projectName);

  // Basic form validation
  if (!projectName || !managedBy  ) {
    toast.error("Please fill all fields");    
    return;
  }

  const payload = {
    projectName,
    teamManager : managedBy,        // assuming managedBy is leader id
    statdate: "", // today date
    deadLine,
    priority:"low",
    projectdescription
  };      

  try {
    console.log("Submitting Payload:", payload);

    const token = localStorage.getItem("token"); // or session/local storage depending on your auth flow

    const response = await api.post("/projects/create", payload );

    if (response.status == 201) {


      toast("Project created successfully!");
      setProjectName("");
      setManagedBy("");
      // setSelectedMembers([]);

      onSuccess && onSuccess();
    } else {
      toast(response.data?.message || "Failed to create team");
    }
  } catch (error) {
    console.error("Error creating team:", error);

    // Show error toast based on error type
    if (error.response) {
      toast.error(error.response.data?.message || "Server responded with an error");
    } else if (error.request) {
      toast("No response from server");
    } else {
      toast("Failed to create team. Please try again.");
    }
  }
};


  return (
    <div className="  space-y-6">
      <h2 className="text-2xl font-bold">Create New Project</h2>

      <div>
        <Label>Project Name</Label>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter Project name"
        />
      </div>

      <div>
        <Label>Managed By</Label>
        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {managedBy
                ? employeeList.find((emp) => emp.value === managedBy)?.label
                : <span className="text-[#737373] font-normal">Select Manager</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search manager..." />
              <CommandEmpty>No manager found.</CommandEmpty>
  <CommandList className="max-h-60 overflow-y-auto">
              <CommandGroup>
                {employeeList.map((emp) => (
                  <CommandItem
                    key={emp.value}
                    value={emp.label}
                    onSelect={() => {
                      setManagedBy(emp.value)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        managedBy === emp.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {emp.label}
                  </CommandItem>
                ))}
              </CommandGroup>
  </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>


      <div>
        <Label>End Date</Label>
        <DatePickerDemo
        value={deadLine}
        onChange={(date) => {setDeadLine(date);
          console.log(date);
          
        }}
        />
      </div>

      {/* <div>
        <Label>Add Team Members</Label>
        <MultiSelect
        modalPopover={true}
          options={employeeList}
           defaultValue={selectedMembers}
            onValueChange={(newSkills) =>setSelectedMembers(newSkills)}
        />
      </div> */}
          <div>
        <Label>Project Desription</Label>
        <Textarea col={12}
          value={projectdescription}
          onChange={(e) => setprojectdescription(e.target.value)}
          placeholder="Enter Project Description"
          className="h-32 resize-none"

        />
      </div>

      <Button onClick={handleSubmit}>Create Team</Button>
    </div>
  )
}
