'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { tz } from "@date-fns/tz"
import { CalendarIcon, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createEvent, updateEvent, deleteEvent, generateDescription } from "@/actions/event"
import { Schedule } from "@/actions/schedule"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Checkbox } from "../ui/checkbox"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { calendars } from "@/lib/data"


const MADRID = tz('Europe/Madrid');

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  repeat: z.boolean().optional(),
})

type EventFormProps = {
  onSuccess?: () => void
  selectedDate?: Date
  initialData?: Schedule
}

export function EventForm({ onSuccess, selectedDate, initialData }: EventFormProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData ? new Date(initialData.start_time) : (selectedDate || new Date()),
      startTime: format(initialData ? new Date(initialData.start_time) : (selectedDate || new Date()), "HH:mm", { in: MADRID }),
      endTime: format(initialData ? new Date(initialData.end_time) : (selectedDate || new Date(new Date().getTime() + 60 * 60 * 1000)), "HH:mm", { in: MADRID }),
      repeat: initialData?.repeat || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = initialData
      ? await updateEvent(String(initialData.id), values)
      : await createEvent(values)

    if (result.success) {
      toast({
        title: initialData ? "Event Updated" : "Event Created",
        description: `Your event "${values.title}" has been successfully ${initialData ? "updated" : "created"}.`,
      })
      if (!initialData) form.reset()
      onSuccess?.()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    }
  }

  async function handleDelete() {
    if (!initialData) return
    const result = await deleteEvent(String(initialData.id))
    if (result.success) {
      toast({
        title: "Event Deleted",
        description: `Your event "${initialData.title}" has been successfully deleted.`,
      })
      onSuccess?.()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    }
  }

  async function handleGenerateDescription() {
    setIsGenerating(true)
    const title = form.getValues("title");
    if (!title) {
      toast({
        variant: "destructive",
        title: "Title is required",
        description: "Please enter an event title to generate a description.",
      });
      setIsGenerating(false);
      return;
    }
    const result = await generateDescription({ title });
    if (result.success && result.description) {
      form.setValue("description", result.description);
      toast({
        title: "Description Generated",
        description: "AI has successfully generated a description for your event.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      });
    }
    setIsGenerating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Team Meeting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
            control={form.control}
            name="calendarId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Calendar</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a calendar" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {calendars.filter(c => c.ownerId === 'user-1').map(cal => (
                        <SelectItem key={cal.id} value={cal.id}>{cal.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        /> */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button variant="ghost" size="sm" type="button" onClick={handleGenerateDescription} disabled={isGenerating}>
                  <Wand2 className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the event"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild disabled={true}>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { in: MADRID })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Repeat weekly
                </FormLabel>
                <FormDescription>
                  This event will repeat every same day of the week for the future months.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          {initialData && (
            <Button type="button" variant="destructive" onClick={handleDelete} className="flex-1">
              Delete Event
            </Button>
          )}
          <Button type="submit" className="flex-1">
            {initialData ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
