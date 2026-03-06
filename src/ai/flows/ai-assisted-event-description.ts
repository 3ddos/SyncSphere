'use server';
/**
 * @fileOverview An AI assistant flow for generating detailed event descriptions.
 *
 * - generateAiAssistedEventDescription - A function that generates a detailed event description.
 * - AiAssistedEventDescriptionInput - The input type for the generateAiAssistedEventDescription function.
 * - AiAssistedEventDescriptionOutput - The return type for the generateAiAssistedEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedEventDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  notes: z
    .string()
    .optional()
    .describe('Any brief notes or context for the event.'),
});
export type AiAssistedEventDescriptionInput = z.infer<
  typeof AiAssistedEventDescriptionInputSchema
>;

const AiAssistedEventDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and comprehensive event description.'),
});
export type AiAssistedEventDescriptionOutput = z.infer<
  typeof AiAssistedEventDescriptionOutputSchema
>;

export async function generateAiAssistedEventDescription(
  input: AiAssistedEventDescriptionInput
): Promise<AiAssistedEventDescriptionOutput> {
  return aiAssistedEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedEventDescriptionPrompt',
  input: {schema: AiAssistedEventDescriptionInputSchema},
  output: {schema: AiAssistedEventDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in generating detailed and engaging event descriptions.
Your goal is to elaborate on the provided event title and any notes to create a comprehensive, informative, and appealing description.
If no notes are provided, generate a description based solely on the title.

Event Title: {{{title}}}
{{#if notes}}
Notes: {{{notes}}}
{{/if}}

Generate a detailed description for this event:`,
});

const aiAssistedEventDescriptionFlow = ai.defineFlow(
  {
    name: 'aiAssistedEventDescriptionFlow',
    inputSchema: AiAssistedEventDescriptionInputSchema,
    outputSchema: AiAssistedEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
