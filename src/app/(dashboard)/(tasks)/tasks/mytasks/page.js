"use client";

// import axiosInstance from '@/utils/axiosInstance'

import { api } from "@/lib/api"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import ProtectedRoute from "@/app/_components/ProcectedRoute";

export default function MyTasksPage() {
 

  
//   console.log('Other Employees:', otherEmpRes.data)

  return (
    <ProtectedRoute allowedRoles={['developer', 'manager',"uiux","seo"]}>

    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
      <DataTable columns={columns} />
    </div>
    </ProtectedRoute>
  )
}
