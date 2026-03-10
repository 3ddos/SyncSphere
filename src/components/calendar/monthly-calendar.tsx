'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Card, CardContent } from '@/components/ui/card';
import type { Schedule } from '@/actions/schedule';

const defaultEventColors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#ef4444', // red
  '#f97316', // orange
  '#06b6d4', // cyan
];

type Props = {
  schedules: Schedule[];
};

export default function MonthlyCalendar({ schedules }: Props) {
  const formattedEvents = React.useMemo(() => {
    return schedules.map((schedule, index) => {
      const color = schedule.color ?? defaultEventColors[index % defaultEventColors.length];

      return {
        id: String(schedule.id),
        title: schedule.title,
        start: schedule.start_time,
        end: schedule.end_time,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: {
          description: schedule.description,
        },
      };
    });
  }, [schedules]);

  return (
    <Card className="w-full">
      <style dangerouslySetInnerHTML={{__html: `
        .fc {
          --fc-border-color: hsl(var(--border) / 0.5);
          --fc-button-text-color: hsl(var(--primary-foreground));
          --fc-button-bg-color: hsl(var(--primary));
          --fc-button-border-color: hsl(var(--primary));
          --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
          --fc-button-hover-border-color: hsl(var(--primary) / 0.9);
          --fc-button-active-bg-color: hsl(var(--primary) / 0.8);
          --fc-button-active-border-color: hsl(var(--primary) / 0.8);
          --fc-event-bg-color: transparent;
          --fc-event-border-color: transparent;
          --fc-today-bg-color: hsl(var(--accent) / 0.3);
          --fc-page-bg-color: transparent;
          font-family: inherit;
        }
        .fc .fc-button {
          font-weight: 500;
          text-transform: capitalize;
          border-radius: var(--radius);
          padding: 0.5rem 1rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .fc .fc-col-header-cell-cushion {
          padding: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .fc .fc-daygrid-day-number {
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        .fc .fc-button:not(:disabled) {
           background-color: var(--fc-button-bg-color);
           border-color: var(--fc-button-border-color);
           color: var(--fc-button-text-color);
        }
        .fc .fc-button:not(:disabled):hover {
           background-color: var(--fc-button-hover-bg-color);
           border-color: var(--fc-button-hover-border-color);
           color: var(--fc-button-text-color);
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
           background-color: var(--fc-button-active-bg-color);
           border-color: var(--fc-button-active-border-color);
           color: var(--fc-button-text-color);
        }
      `}} />
      <CardContent className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={formattedEvents}
          height="auto"
          contentHeight="auto"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          nowIndicator={true}
          navLinks={true}
          dayMaxEvents={true}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
        />
        {schedules.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-4">
            No schedules found. Add some events to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
