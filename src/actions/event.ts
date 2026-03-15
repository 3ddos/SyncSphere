'use server'

import { z } from "zod"
import { generateAiAssistedEventDescription } from "@/ai/flows/ai-assisted-event-description"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { tz, TZDate } from "@date-fns/tz"

const MADRID = tz('Europe/Madrid')

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  repeat: z.boolean().optional(),
  color: z.string().optional(),
})

export async function createEvent(values: z.infer<typeof eventSchema>) {
  const validatedFields = eventSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields." }
  }

  // Get current user from session cookie
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    return { success: false, error: "Not authenticated." }
  }

  const { title, description, date, startTime, endTime, repeat, color } = validatedFields.data

  // Build ISO datetime strings by combining the date with each time in Madrid timezone
  const dateStr = format(date, 'yyyy-MM-dd', { in: MADRID })
  const startTimestamp = `${dateStr}T${startTime}:00.000+01:00`
  const endTimestamp = `${dateStr}T${endTime}:00.000+01:00`

  const { error } = await supabase.from('schedule').insert({
    user_id: sessionId,
    title,
    description: description ?? null,
    start_time: startTimestamp,
    end_time: endTimestamp,
    repeat: !!repeat,
    color,
  })

  if (error) {
    console.error("Error inserting schedule:", error)
    return { success: false, error: "Failed to save event. Please try again." }
  }

  revalidatePath('/calendar')

  return { success: true }
}

export async function updateEvent(id: string, values: z.infer<typeof eventSchema>) {
  const validatedFields = eventSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields." }
  }

  const { title, description, date, startTime, endTime, repeat, color } = validatedFields.data

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    return { success: false, error: "Not authenticated." }
  }

  // Verify ownership
  const { data: event, error: fetchError } = await supabase
    .from('schedule')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !event) {
    return { success: false, error: "Event not found." }
  }

  if (String(event.user_id) !== String(sessionId)) {
    return { success: false, error: "Unauthorized. You can only update your own events." }
  }

  // Build ISO datetime strings by combining the date with each time in Madrid timezone
  const dateStr = format(date, 'yyyy-MM-dd', { in: MADRID })
  const startTimestamp = `${dateStr}T${startTime}:00.000+01:00`
  const endTimestamp = `${dateStr}T${endTime}:00.000+01:00`

  const { error } = await supabase
    .from('schedule')
    .update({
      title,
      description: description ?? null,
      start_time: startTimestamp,
      end_time: endTimestamp,
      repeat: !!repeat,
      color,
    })
    .eq('id', id)

  if (error) {
    console.error("Error updating schedule:", error)
    return { success: false, error: "Failed to update event." }
  }

  revalidatePath('/calendar')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    return { success: false, error: "Not authenticated." }
  }

  // Verify ownership
  const { data: event, error: fetchError } = await supabase
    .from('schedule')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !event) {
    return { success: false, error: "Event not found." }
  }

  if (String(event.user_id) !== String(sessionId)) {
    return { success: false, error: "Unauthorized. You can only delete your own events." }
  }

  const { error } = await supabase
    .from('schedule')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting schedule:", error)
    return { success: false, error: "Failed to delete event." }
  }

  revalidatePath('/calendar')
  return { success: true }
}



const descriptionSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  notes: z.string().optional(),
})

export async function generateDescription(input: z.infer<typeof descriptionSchema>) {
  const validatedInput = descriptionSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const result = await generateAiAssistedEventDescription(validatedInput.data);
    return { success: true, description: result.description };
  } catch (error) {
    console.error("AI description generation failed:", error);
    return { success: false, error: "Failed to generate description from AI." };
  }
}
