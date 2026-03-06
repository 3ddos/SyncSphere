'use server';
/**
 * @fileOverview This file implements a Genkit flow to provide a concise summary of today's most important events and any immediate upcoming activities across all personal and shared calendars.
 *
 * - summarizeTodayEvents - A function that generates a summary of today's events.
 * - TodaySummaryInput - The input type for the summarizeTodayEvents function.
 * - TodaySummaryOutput - The return type for the summarizeTodayEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TodaySummaryInputSchema = z.object({
  todayDate: z.string().describe("Today's date in 'YYYY-MM-DD' format."),
  events: z.array(
    z.object({
      id: z.string().describe('Unique ID for the event.'),
      title: z.string().describe('Title of the event.'),
      startTime: z
        .string()
        .describe('Start time of the event in HH:MM format (24-hour).'),
      endTime: z
        .string()
        .describe('End time of the event in HH:MM format (24-hour).'),
      calendarName: z.string().describe('Name of the calendar the event belongs to.'),
      isPersonal:
        z.boolean().describe("True if the event is from the user's personal calendar, false otherwise."),
      description:
        z.string().optional().describe('Optional detailed description of the event.'),
      participants:
        z.array(z.string()).optional().describe('List of participants in the event, if applicable.'),
    })
  ),
});
export type TodaySummaryInput = z.infer<typeof TodaySummaryInputSchema>;

const TodaySummaryOutputSchema = z.object({
  summary:
    z.string().describe('A concise summary of today\'s events, highlighting important ones and immediate upcoming activities.'),
});
export type TodaySummaryOutput = z.infer<typeof TodaySummaryOutputSchema>;

export async function summarizeTodayEvents(input: TodaySummaryInput): Promise<TodaySummaryOutput> {
  return todaySummaryFlow(input);
}

const todaySummaryPrompt = ai.definePrompt({
  name: 'todaySummaryPrompt',
  input: {schema: TodaySummaryInputSchema},
  output: {schema: TodaySummaryOutputSchema},
  prompt: `You are an AI assistant tasked with providing a concise summary of a user's daily agenda.
Your goal is to highlight the most important events and any immediate upcoming activities from both personal and shared calendars.

Today's date: {{{todayDate}}}

Here are today's events:
{{#if events}}
{{#each events}}
- {{this.title}} ({{this.startTime}}-{{this.endTime}}) on calendar "{{this.calendarName}}" {{#if this.isPersonal}}(Personal){{else}}(Shared){{/if}}
  {{#if this.description}}  Description: {{this.description}}{{/if}}
  {{#if this.participants}}  Participants: {{#each this.participants}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{/each}}
{{else}}
No events found for today.
{{/if}}

Please provide a concise summary of today's most important events and any immediate upcoming activities across all these calendars. Focus on key details and provide a quick overview for the user. If there are no events, state that clearly. The summary should be easy to read and digest quickly.`,
});

const todaySummaryFlow = ai.defineFlow(
  {
    name: 'todaySummaryFlow',
    inputSchema: TodaySummaryInputSchema,
    outputSchema: TodaySummaryOutputSchema,
  },
  async input => {
    const {output} = await todaySummaryPrompt(input);
    return output!;
  }
);
