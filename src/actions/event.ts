'use server'

import { z } from "zod"
import { generateAiAssistedEventDescription } from "@/ai/flows/ai-assisted-event-description"
import { revalidatePath } from "next/cache"

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  calendarId: z.string().min(1),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
})

export async function createEvent(values: z.infer<typeof eventSchema>) {
  const validatedFields = eventSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields." }
  }

  console.log("Creating event:", validatedFields.data)
  // Here you would typically save the event to a database.
  // We'll just log it for now.

  revalidatePath('/dashboard')
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
