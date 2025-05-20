import React from 'react'
import AddTeamForm from '../_components/AddNewTeam'
import ProtectedRoute from '@/app/_components/ProcectedRoute'

const page = () => {
  return (
      <ProtectedRoute allowedRoles={['admin']}>

    <div className='max-w-xl mx-auto'><AddTeamForm/></div>
      </ProtectedRoute>
  )
}

export default page