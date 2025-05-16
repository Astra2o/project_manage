"use client";

// import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    // <ProtectedRoute allowedRoles={['admin']}>
    //   <div className="p-6">
    //     <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    //     <div className="bg-white rounded-lg shadow p-6">
    //       <h2 className="text-xl font-semibold mb-4">User Details</h2>
    //       <div className="space-y-2">
    //         <p><span className="font-medium">Name:</span> {user?.name}</p>
    //         <p><span className="font-medium">Email:</span> {user?.email}</p>
    //         <p><span className="font-medium">Role:</span> {user?.role}</p>
    //         <p><span className="font-medium">Position:</span> {user?.position}</p>
    //         <p><span className="font-medium">Employee ID:</span> {user?.employeeId}</p>
    //       </div>
    //     </div>
    //   </div>
    // </ProtectedRoute>
    <>admin</>
  );
};

export default AdminDashboard; 