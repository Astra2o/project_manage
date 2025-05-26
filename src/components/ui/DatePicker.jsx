"use client"

import * as React from "react"
import { format, isBefore, isAfter } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo({ value, onChange }) {
  const [open, setOpen] = React.useState(false)

  // Set min and max date
  const fromDate = new Date(2024, 4, 1) // May 1, 2024
  const toDate = new Date(2025, 11, 31) // Dec 31, 2025

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date)
              console.log("Selected date: ", format(date, "PPP"))
              setOpen(false) // close after select
            }
          }}
          initialFocus
          fromDate={fromDate}
          toDate={toDate}
          disabled={(date) =>
            isBefore(date, fromDate) || isAfter(date, toDate)
          }
        />
      </PopoverContent>
    </Popover>
  )
}
