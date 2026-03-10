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

export default function EventSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Event</SheetTitle>
          <SheetDescription>
            Fill in the details for your new event. Click &apos;Generate with AI&apos; for an enhanced description.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
            <EventForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
