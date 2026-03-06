import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { events, calendars } from '@/lib/data';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const calendarColorClasses: { [key: string]: string } = {
  blue: 'border-transparent bg-blue-500 text-white',
  green: 'border-transparent bg-green-500 text-white',
  purple: 'border-transparent bg-purple-500 text-white',
  red: 'border-transparent bg-red-500 text-white',
};

export default function TodaysEvents() {
  const todayEvents = events
    .filter((event) => isToday(event.startTime))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => {
            const calendar = calendars.find((c) => c.id === event.calendarId);
            return (
              <div key={event.id} className="flex items-start gap-4">
                <div className="w-20 text-sm text-muted-foreground text-right">
                  <p>{format(event.startTime, 'h:mm a')}</p>
                </div>
                <div className="relative flex-1 border-l pl-8 pb-8">
                   <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary"></div>
                   <p className="font-semibold">{event.title}</p>
                   <p className="text-sm text-muted-foreground">{event.description}</p>
                   {calendar && (
                     <Badge variant="outline" className={cn("mt-2", calendarColorClasses[calendar.color])}>
                       {calendar.name}
                     </Badge>
                   )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground">No events scheduled for today.</p>
        )}
      </CardContent>
    </Card>
  );
}
