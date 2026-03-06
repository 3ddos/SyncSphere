'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '../ui/card';
import { events, calendars } from '@/lib/data';

const calendarColorClasses: { [key: string]: string } = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
};

export default function MonthlyCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, typeof events>();
    events.forEach(event => {
      const day = format(event.startTime, 'yyyy-MM-dd');
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)?.push(event);
    });
    return map;
  }, []);

  return (
    <Card>
        <CardContent className="p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                components={{
                    DayContent: ({ date }) => {
                        const dayEvents = eventsByDate.get(format(date, 'yyyy-MM-dd'));
                        return (
                            <>
                                <p>{date.getDate()}</p>
                                {dayEvents && dayEvents.length > 0 && (
                                    <div className="mt-1 flex -space-x-1 justify-center">
                                        {dayEvents.slice(0, 3).map(event => {
                                            const calendar = calendars.find(c => c.id === event.calendarId);
                                            return (
                                                <div key={event.id} className={cn("h-2 w-2 rounded-full border border-card", calendar ? calendarColorClasses[calendar.color] : 'bg-gray-400')}></div>
                                            )
                                        })}
                                        {dayEvents.length > 3 && (
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground/50 border border-card text-[8px] flex items-center justify-center text-white">
                                                +{dayEvents.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )
                    }
                }}
            />
        </CardContent>
    </Card>
  );
}
