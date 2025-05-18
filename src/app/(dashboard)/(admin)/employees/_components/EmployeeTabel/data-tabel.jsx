"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelection,
  //   VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
//   const [pageSize, setPageSize] = useState(10);




  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //for pagination
    onSortingChange: setSorting, //for sorting
    getSortedRowModel: getSortedRowModel(), //for sorting
    onColumnFiltersChange: setColumnFilters, //for filters
    getFilteredRowModel: getFilteredRowModel(), //for filters
    onColumnVisibilityChange: setColumnVisibility, //for colomn visiblity selection
    onRowSelectionChange: setRowSelection, // for row selection

    state: {
      sorting, //for sorting
      columnFilters, // for filters
      columnVisibility,
      rowSelection,
    //   pagination: {
    //     pageSize: pageSize,
    //     pageIndex: 0, // optional if you want to control page number too
    //   },
    },
  });


   useEffect(() => {
//    console.log(table.getFilteredSelectedRowModel());
      console.log(rowSelection);
      
 
   
 }, [rowSelection])
     

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination buttons */}

    {/* <div className="flex items-center gap-3">
  <span className="text-sm text-muted-foreground">Rows per page:</span>
  <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
    <SelectTrigger className="w-[80px]">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent>
      {[10, 20, 50, 100].map((size) => (
        <SelectItem key={size} value={String(size)}>
          {size}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div> */}
<div className="flex items-center justify-between gap-4 py-4 flex-wrap">
  {/* Rows per page */}
  {/* <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">Rows per page:</span>
    <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {[10, 20, 50, 100].map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div> */}

  {/* Pagination */}
  {/* <div className="flex items-center gap-2 flex-wrap">
    <Button
      variant="outline"
      size="icon"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      &lt;
    </Button>

    {table.getPageCount() > 0 && (
      <>
        {table.getState().pagination.pageIndex > 2 && (
          <>
            <Button
              variant={table.getState().pagination.pageIndex === 0 ? "default" : "outline"}
              size="icon"
              onClick={() => table.setPageIndex(0)}
            >
              1
            </Button>
            {table.getState().pagination.pageIndextable.getState().pagination.pageIndex > 3 && <span className="px-1 text-sm">...</span>}
          </>
        )}

        {Array.from({ length: table.getPageCount() })
          .map((_, index) => index)
          .filter(
            (page) =>
              page === table.getState().pagination.pageIndex - 1 ||
              page === table.getState().pagination.pageIndex ||
              page === table.getState().pagination.pageIndex + 1
          )
          .map((page) => (
            <Button
              key={page}
              variant={table.getState().pagination.pageIndex === page ? "default" : "outline"}
              size="icon"
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}

        {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
          <>
            {table.getState().pagination.pageIndex < table.getPageCount() - 4 && (
              <span className="px-1 text-sm">...</span>
            )}
            <Button
              variant={table.getState().pagination.pageIndex === table.getPageCount() - 1 ? "default" : "outline"}
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              {table.getPageCount()}
            </Button>
          </>
        )}
      </>
    )}

    <Button
      variant="outline"
      size="icon"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      &gt;
    </Button>
  </div> */}
</div>


      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </>
  );
}
