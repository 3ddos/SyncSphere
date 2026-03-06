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
  return (
    <Sheet>
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
            Fill in the details for your new event. Click 'Generate with AI' for an enhanced description.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
            <EventForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
