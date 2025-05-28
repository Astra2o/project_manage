"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import MultiSelectPopover from "@/components/ui/MultiSelectPopover";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function DataTable({ columns = [] }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    taskStatus: [],
    project: [],
  });
  const [projects, setProjects] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        ...(filters.taskStatus.length > 0 && { taskStatus: filters.taskStatus.join(',') }),
        ...(filters.project.length > 0 && { projectId: filters.project.join(',') }),
      });

      const [tasksResponse, projectsResponse] = await Promise.all([
        api.get(`/tasks/myteamtasks?${queryParams}`),
        api.get('/projects/get/getmyprojectlist')
      ]);

      setData(Array.isArray(tasksResponse.data.tasks) ? tasksResponse.data.tasks : []);
      setTotalPages(tasksResponse.data.pagination.totalPages);
      
      // Set projects for filter
      if (Array.isArray(projectsResponse.data.projects)) {
        setProjects(projectsResponse.data.projects.map(project => ({
          value: project._id,
          name: project.projectName
        })));
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, filters]);

  const updateData = (newData) => {
    setData(newData);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData,
    },
  });

  const statusOptions = [
    { value: "pending", title: "Pending" },
    { value: "in_progress", title: "In Progress" },
    { value: "completed", title: "Completed" },
  ];



  if (!Array.isArray(columns) || columns.length === 0) {
    return <div>No columns defined</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter tasks..."
          value={table.getColumn("taskName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("taskName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

<div className=" hidden md:flex  flex-wrap gap-2">

        <MultiSelectPopover
          placeholder="Status"
          value={filters.taskStatus}
          
          options={statusOptions}
          onChange={(values) => setFilters(prev => ({ ...prev, taskStatus: values }))}
        />
      

        <MultiSelectPopover
          placeholder="Project"
          value={filters.project}
            title="name"
        returnKey="value"
          options={projects}
          onChange={(values) => setFilters(prev => ({ ...prev, project: values }))}
        />

      
</div>
<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
<div className="flex  flex-row gap-2 md:hidden">
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm">
        Filters
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-64 m-3   p-3">

      <div>
       
      </div>

      <div className="flex flex-wrap flex-row">
      <MultiSelectPopover
          placeholder="Status"
          value={filters.taskStatus}
          options={statusOptions}
          onChange={(values) => setFilters((prev) => ({ ...prev, taskStatus: values }))}
        />
        <MultiSelectPopover
          placeholder="Project"
          value={filters.project}
          title="name"
          returnKey="value"
          options={projects}
          onChange={(values) => setFilters((prev) => ({ ...prev, project: values }))}
        />
      </div>

      <Separator />

      <div>
       
      </div>
    </PopoverContent>
  </Popover>
</div>

      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 