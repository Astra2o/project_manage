import React from 'react'
import AddEmployeeForm from '../_components/AddEmployeeForm'
import ProtectedRoute from '@/app/_components/ProcectedRoute'

const NewEmployee = () => {
  return (
    <div className=' '>
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AddEmployeeForm/>
      </ProtectedRoute>
    </div>
  )
}

export default NewEmployee