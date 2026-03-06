import { isToday, format } from 'date-fns';
import { summarizeTodayEvents } from '@/ai/flows/ai-today-summary';
import { events, calendars } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

export default async function AiSummary() {
  const today = new Date();
  const todayEvents = events.filter((event) => isToday(event.startTime));
  const formattedEvents = todayEvents.map(event => {
    const calendar = calendars.find(c => c.id === event.calendarId);
    return {
      id: event.id,
      title: event.title,
      startTime: format(event.startTime, 'HH:mm'),
      endTime: format(event.endTime, 'HH:mm'),
      calendarName: calendar?.name || 'Unknown',
      isPersonal: calendar?.ownerId === 'user-1',
      description: event.description,
      participants: event.participants,
    };
  });

  let summary = "No events today. Enjoy your day!";
  if (formattedEvents.length > 0) {
    const result = await summarizeTodayEvents({
      todayDate: format(today, 'yyyy-MM-dd'),
      events: formattedEvents,
    });
    summary = result.summary;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Today's Summary</CardTitle>
        <Wand2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
