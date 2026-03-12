'use server'

import { z } from "zod"
import { generateAiAssistedEventDescription } from "@/ai/flows/ai-assisted-event-description"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  repeat: z.boolean().optional(),
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

  const { title, description, date, startTime, endTime, repeat } = validatedFields.data

  // Build ISO datetime strings by combining the date with each time
  const dateStr = format(date, 'yyyy-MM-dd')
  const startTimestamp = new Date(`${dateStr}T${startTime}:00`).toISOString()
  const endTimestamp = new Date(`${dateStr}T${endTime}:00`).toISOString()

  const { error } = await supabase.from('schedule').insert({
    user_id: sessionId,
    title,
    description: description ?? null,
    start_time: startTimestamp,
    end_time: endTimestamp,
    repeat: !!repeat,
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

  const { title, description, date, startTime, endTime, repeat } = validatedFields.data

  const dateStr = format(date, 'yyyy-MM-dd')
  const startTimestamp = new Date(`${dateStr}T${startTime}:00`).toISOString()
  const endTimestamp = new Date(`${dateStr}T${endTime}:00`).toISOString()

  const { error } = await supabase
    .from('schedule')
    .update({
      title,
      description: description ?? null,
      start_time: startTimestamp,
      end_time: endTimestamp,
      repeat: !!repeat,
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
