"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import AddTeam from "./AddNewTeam"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export default function AddTeamDialog() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Team
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg sm:w-full">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <AddTeam ispopup={true} onSuccess={handleSuccess} />

        <DialogClose asChild>
          <Button className="mt-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
