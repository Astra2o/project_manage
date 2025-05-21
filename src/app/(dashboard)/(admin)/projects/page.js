// import { Payment, columns } from "./columns"
// import { DataTable } from "./data-table"
"use client"
import ProtectedRoute from "@/app/_components/ProcectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { columns } from "./_components/EmployeeTabel/columns";
import { DataTable } from "./_components/EmployeeTabel/data-tabel";

const fetchEmployeeStats = async () => {
  try {
    const res = await api.get("/employees");  // no need to pass headers, token auto-added via interceptor

    if (res.data) {
      // console.log("Employee Stats:", res.data.employees);
      // You can set this in state too, if needed
      // setEmployees(res.data.employees);
      return res.data.employees
    }
  } catch (error) {
    console.error("Error fetching employees:", error.response?.data?.message || error.message);
    // Optionally show toast/error message to user
  }
};



export default  function DemoPage() {
  const [data, setdata] = useState([])

  const fetchEmployeeStats = async () => {
  try {
    const res = await api.get("/projects");  // no need to pass headers, token auto-added via interceptor

    if (res.data) {
      console.log("Employee Stats:", res.data.projects);
      // You can set this in state too, if needed
      // setEmployees(res.data.employees);
      return res.data.projects
    }
  } catch (error) {
    console.error("Error fetching employees:", error.response?.data?.message || error.message);
    // Optionally show toast/error message to user
  }
};
  useEffect(() => {
   

     const getData = async () => {
      console.log("Fetching employee stats...");
      const result = await fetchEmployeeStats();
      // console.log("Employee Data:", result);
      setdata(result || []);  // fallback to empty array if undefined
    };

    getData();
   
  
   
  }, [])
  

  return (
     <ProtectedRoute allowedRoles={['admin', 'manager']}>
    <div className="container  py-10">
      <DataTable columns={columns} data={data} />
    </div>
      </ProtectedRoute>
  )
}
