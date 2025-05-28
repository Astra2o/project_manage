"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const RequestedTask = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/reqestedTask', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setTasks(data.tasks)
      } else {
        toast.error(data.message || 'Failed to fetch tasks')
      }
    } catch (error) {
      toast.error('Error fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAction = async (taskId, status) => {
    try {
      const response = await fetch('/api/tasks/reqestedTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ taskId, status })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        fetchTasks() // Refresh the tasks list
      } else {
        toast.error(data.message || 'Failed to update task')
      }
    } catch (error) {
      toast.error('Error updating task')
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Requested Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No requested tasks found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.taskName}</TableCell>
                    <TableCell>{task.taskAssignedBy?.name || 'N/A'}</TableCell>
                    <TableCell>{task.taskAssignedTo?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">    
                        <Button
                          variant="default"
                          onClick={() => handleTaskAction(task._id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleTaskAction(task._id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestedTask