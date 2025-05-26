"use client";

import { ArrowUpDown, Check, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"; // adjust path if needed
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Custom date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
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
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
        id:"name",
    cell: ({ row }) => (
      <div className="font-semibold">{row.original.projectName}</div>
    ),
  },
  {
    accessorKey: "status",
    enableHiding: true,
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">{row.original.status}</Badge>
    ),
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },    cell: ({ row }) => (
      <div>{row.original.priority}</div>
    ),
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    },
  },
 
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div>{formatDate(row.original.startDate)}</div>
    ),
    filterFn: (row, id, value) => {
      if (!value) return true;
      const rowDate = new Date(row.getValue(id));
      return rowDate >= value;
    },
  },
  {
    accessorKey: "deadLine",
    header: "Deadline",
    cell: ({ row }) => (
      <div>{formatDate(row.original.deadLine)}</div>
    ),
    filterFn: (row, id, value) => {
      if (!value) return true;
      const rowDate = new Date(row.getValue(id));
      return rowDate <= value;
    },
  },
  {
    accessorKey: "teamManger .name",
    header: "Team Manager",
    cell: ({ row }) => (
      <div>{row.original.teamManager.name}</div>
    ),
  },
  // {
  //   id: "tasks",
  //   header: "Tasks ",
  //   cell: ({ row }) => {
  //     const tasks = row.original.tasks;
  //     return (
  //       <div className="space-x-2 flex flex-wrap items-center">
  //         <Badge className="bg-gray-300 text-black">Total: {tasks.totalTasks}</Badge>
  //         <Badge className="bg-yellow-400/50 text-black">Pending: {tasks.pendingTasks}</Badge>
  //         <Badge className="bg-blue-400/50 text-black">In Progress: {tasks.inProgressTasks}</Badge>
  //         <Badge className="bg-green-500/50 text-black">Completed: {tasks.completedTasks}</Badge>
  //         <Badge className="bg-red-500/50 text-black">On Hold: {tasks.holdTasks}</Badge>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "tasks",
    header: "Tasks",
    cell: ({ row }) => {
      const tasks = row.original.tasks;
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="secondary" className="rounded-full cursor-pointer select-none">
              {tasks.totalTasks}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="center" className="bg-white text-gray-900 shadow-lg w-48 p-4">
            <div className="flex flex-col space-y-2 text-sm">
              {[
                { name: "Total Tasks", value: tasks.totalTasks },
                { name: "Pending", value: tasks.pendingTasks },
                { name: "In Progress", value: tasks.inProgressTasks },
                { name: "Completed", value: tasks.completedTasks },
                { name: "On Hold", value: tasks.holdTasks },
              ].map(({ name, value }) => (
                <div key={name} className="flex justify-between">
                  <span>{name}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.projectName)}>Copy Project Name</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Project</DropdownMenuItem>
            <DropdownMenuItem>Update </DropdownMenuItem>
            <DropdownMenuItem>Add Task </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
