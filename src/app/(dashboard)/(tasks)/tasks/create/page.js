import React from 'react'
import NewtaskForm from '../../_components/Newtask'
import ProtectedRoute from '@/app/_components/ProcectedRoute'

const page = () => {
  return (
    <ProtectedRoute allowedRoles={[ 'manager']}>

      <NewtaskForm/>
    </ProtectedRoute>
  )
}

export default page