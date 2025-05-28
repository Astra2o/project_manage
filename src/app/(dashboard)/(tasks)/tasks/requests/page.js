import React from 'react'
import RequestedTask from './RequestedTask'
import ProtectedRoute from '@/app/_components/ProcectedRoute'

const page = () => {
  return (

    <ProtectedRoute allowedRoles={[ 'manager']}>
             <RequestedTask/>
    </ProtectedRoute>
  )
}

export default page