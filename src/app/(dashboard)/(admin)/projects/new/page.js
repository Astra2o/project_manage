import ProtectedRoute from '@/app/_components/ProcectedRoute'
import React from 'react'
import AddProjectForm from '../_components/AddProjectForm'

const page = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>

        <div> <AddProjectForm/></div>
    </ProtectedRoute>
  )
}

export default page