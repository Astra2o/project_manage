"use client";

// import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";


export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "teamName",
    id: "name",
    header: "Team Name",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold">{row.original?.teamName}</div>
        <div className="text-[.7rem]">{row.original?.emp?.position}</div>
      </div>
    ),
  },
  {
    id: "Team Leader",
    accessorKey: "teamLeader.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column?.toggleSorting(column?.getIsSorted() === "asc")
        }
      >
        Manage By
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.teamLeader?.name}</div>,
  },
  {
    accessorKey: "teamMembers.length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column?.toggleSorting(column?.getIsSorted() === "asc")
        }
      >
        Team Members
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="ml-6">{row.original?.teamMembers.length}</div>
    ),
  },

  // 📌 New Column: View Team
{
  id: "view-team",
  header: "View Team",
  cell: ({ row }) => (
    <Button
      size="sm"
      className="bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
    >
      View Team
    </Button>
  ),
},
{
  id: "view-projects",
  header: "View Projects",
  cell: ({ row }) => (
    <Button
      size="sm"
      className="bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
    >
      View Projects
    </Button>
  ),
},
{
  id: "view-tasks",
  header: "View Tasks",
  cell: ({ row }) => (
    <Button
      size="sm"
      className="bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
    >
      View Tasks
    </Button>
  ),
},


  // 📌 Updated Actions Dropdown
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;

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
            <DropdownMenuItem>Add Member</DropdownMenuItem>
            <DropdownMenuItem>Update Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(team.id)}
            >
              Copy Team ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];



// export const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false, // sorting work nhi krti
//     enableHiding: false, //colom hiding btn se hide nhi hoti
//   },
//   {
  
//    accessorKey: "teamName",
//   id: "name",
//   header: "Team Name",
//     cell: ({ row }) => {
//       console.log(row?.original);

//       return (
//         <div>
//           {" "}
//           <div className=" font-semibold">{row.original?.teamName}</div>
//           <div className="text-[.7rem]">{row.original?.emp?.position}</div>
//         </div>
//       );
//     },
//   },
//   {
//     id:"Team Leader",
//     accessorKey: "teamLeader.name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
//         >
//           Manage By
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return (
//         <div>
//           {" "}
//           <div className=" ">{row.original?.teamLeader?.name}</div>
//         </div>
//       );
//     },
//     // header:"Email"
//   },
//   {
//     accessorKey: "teamMembers.length",
//     header: ({ column }) => {
//       return (
//         <Button className=""
//           variant="ghost"
//           onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
//         >
//           Team Members
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return (
//         <div>
//           {" "}
//           <div className="ml-6 ">{row.original?.teamMembers.length}</div>
//         </div>
//       );
//     },
//     // header:"Email"
//   },
//   {
//     accessorKey: "tasks",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
//         >
//           Tasks
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//    cell: ({ row }) => {
//   const tasks = row.original?.tasks;

//   return (
//     <div className="ml-6 space-x-2 flex items-center">
//       <div className="font-medium"> {tasks?.total}</div>

//       {tasks?.pending==0 && (
//         <Badge className="bg-yellow-400/50 text-black hover:bg-yellow-500">Pending: {tasks.pending}</Badge>
//       )}

//       {tasks?.onHold == 0 && (
//         <Badge className="bg-red-500/50 text-black hover:bg-red-600">On Hold: {tasks.onHold}</Badge>
//       )}

//       {tasks?.completed == 0 && (
//         <Badge className="bg-green-500/50 text-black hover:bg-green-600">Completed: {tasks.completed}</Badge>
//       )}
//     </div>
//   );
// }
//     // header:"Email"
//   },

//   // {
//   //   accessorKey: "amount",
//   //   header: () => <div className="text-right">Amount</div>,
//   //   cell: ({ row }) => {
//   //     const amount = parseFloat(row.getValue("amount"))
//   //     const formatted = new Intl.NumberFormat("en-US", {
//   //       style: "currency",
//   //       currency: "USD",
//   //     }).format(amount)

//   //     return <div className="text-right font-medium">{formatted}</div>
//   //   },

//   //  },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy Emp ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];
