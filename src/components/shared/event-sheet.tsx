'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { EventForm } from "./event-form"
import { PlusCircle } from "lucide-react"
import { Schedule } from "@/actions/schedule"

interface EventSheetProps {
  selectedDate?: Date
  initialData?: Schedule
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export default function EventSheet({ 
  selectedDate, 
  initialData, 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  onSuccess 
}: EventSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = (val: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(val)
    } else {
      setInternalOpen(val)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!isControlled && (
        <SheetTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-full max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{initialData ? "Edit Event" : "Create New Event"}</SheetTitle>
          <SheetDescription>
            {initialData 
              ? "Update the details for your event." 
              : "Fill in the details for your new event. Click 'Generate with AI' for an enhanced description."
            }
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <EventForm 
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }} 
            selectedDate={selectedDate} 
            initialData={initialData} 
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
