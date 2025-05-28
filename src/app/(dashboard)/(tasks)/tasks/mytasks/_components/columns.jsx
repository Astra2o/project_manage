"use client";

import { ArrowUpDown, GitMerge, MoreHorizontal, EllipsisVertical, Copy, Eye, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Custom date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const updateTaskStatus = async (taskId, newStatus, onSuccess) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ taskStatus: newStatus })
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(data.message);
      onSuccess(newStatus);
      return true;
    } else {
      toast.error(data.message || 'Failed to update status');
      return false;
    }
  } catch (error) {
    toast.error('Error updating task status');
    return false;
  }
};

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Task Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div 
          className="font-semibold flex items-center gap-2 cursor-pointer hover:text-primary"
          onClick={() => router.push(`/tasks/${row.original._id}`)}
        >
          {row.original.iscollaborator && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-400/50 border border-yellow-300">
              <GitMerge className="w-3 h-3" />
            </span>
          )}
          {row.original.taskName}
        </div>
      );
    },
  },
  {
    accessorKey: "project.projectName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.original.project?.projectName}</div>
    ),
  },
  {
    accessorKey: "taskStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.taskStatus;
      return (
        <Badge 
          variant={
            status === "completed" ? "success" :
            status === "in_progress" ? "warning" :
            "secondary"
          }
          className="capitalize"
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Start Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Deadline
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.original.deadline),
  },
  {
    accessorKey: "taskAssignedBy.name",
    header: "Assigned By",
    cell: ({ row }) => (
      <div>{row.original.taskAssignedBy?.name}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const task = row.original;
      const router = useRouter();

      const copyTaskId = () => {
        navigator.clipboard.writeText(task._id);
        toast.success("Task ID copied to clipboard");
      };

      const handleStatusChange = async (newStatus) => {
        const success = await updateTaskStatus(task._id, newStatus, (updatedStatus) => {
          const updatedData = table.options.data.map((item) => {
            if (item._id === task._id) {
              return { ...item, taskStatus: updatedStatus };
            }
            return item;
          });
          table.options.meta?.updateData(updatedData);
        });
      };

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={copyTaskId}
              >
                <Copy className="h-4 w-4" />
                Copy Task ID
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => router.push(`/tasks/${task._id}`)}
              >
                <Eye className="h-4 w-4" />
                View Task
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Update Status
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" side="right" align="start">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      disabled={task.taskStatus === "pending"}
                      onClick={() => handleStatusChange("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      disabled={task.taskStatus === "in_progress"}
                      onClick={() => handleStatusChange("in_progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      disabled={task.taskStatus === "completed"}
                      onClick={() => handleStatusChange("completed")}
                    >
                      Completed
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                className="justify-start gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
]; 