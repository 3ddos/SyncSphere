'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { tz } from '@date-fns/tz';

import { Card, CardContent } from '@/components/ui/card';
import type { Schedule } from '@/actions/schedule';

const MADRID = tz('Europe/Madrid');

type Props = {
  schedules: Schedule[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onEventClick?: (schedule: Schedule) => void;
};

export default function MonthlyCalendar({ schedules, selectedDate, setSelectedDate, onEventClick }: Props) {
  const formattedEvents = React.useMemo(() => {
    return schedules.map((schedule, index) => {
      const color = schedule.color;
      const startDate = new Date(schedule.start_time);
      const endDate = new Date(schedule.end_time);

      if (schedule.repeat) {
        return {
          id: String(schedule.id),
          title: schedule.title,
          daysOfWeek: [startDate.getDay()],
          startTime: format(startDate, 'HH:mm:ss'),
          endTime: format(endDate, 'HH:mm:ss'),
          startRecur: schedule.start_time,
          backgroundColor: color,
          borderColor: color,
          textColor: '#ffffff',
          extendedProps: {
            description: schedule.description,
          },
          allDay: false
        };
      }

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
        allDay: false
      };
    });
  }, [schedules]);

  const eventContent = (arg: any) => {
    const { event, isStart, timeText } = arg

    if (!isStart) {
      return { html: '' }          // empty on continuation days
      // or simply: return null  // also works
    }

    // Always show the SAME format for ALL events
    // Example 1: Only start time (e.g. "09:00")
    const startTime = event.start ? format(event.start, 'HH:mm', { in: MADRID }) : ''
    const endTime = event.end ? format(event.end, 'HH:mm', { in: MADRID }) : ''
    const timeStr = endTime ? `${startTime} - ${endTime}` : startTime

    return (
      <div style={{ padding: '2px 4px', fontSize: '13px', overflow: 'hidden' }}>
        <b>{event.title}</b>
        <br />
        <span style={{ opacity: 0.8 }}>{timeStr}</span>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
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
        .fc .fc-day-today {
          background: hsl(var(--accent) / 0.3) !important;
        }
        .fc .fc-selected-day {
          background: hsl(var(--primary) / 0.1) !important;
          border: 2px solid hsl(var(--primary)) !important;
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
        .fc-event:not(.fc-event-start) {
          background: transparent !important;
          border: none !important;
          height: 0 !important;
          min-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .fc .fc-daygrid-event-harness-abs {
          visibility: visible !important; 
          position: relative !important; 
        }
        .fc-daygrid-day-events .fc-daygrid-event-harness {
          margin-top: 0 !important;
        }
        .fc-daygrid-event {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }
      `}} />
      <CardContent className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          events={formattedEvents}
          height="auto"
          contentHeight="auto"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          nowIndicator={true}
          navLinks={false}
          dayMaxEvents={true}
          dayCellClassNames={(arg) => {
            if (selectedDate && arg.date.toDateString() === selectedDate.toDateString()) {
              return 'fc-selected-day';
            }
            return '';
          }}
          buttonText={{
            today: 'Today',
            month: 'Month'
          }}
          dateClick={(info) => {
            setSelectedDate(info.date);
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,     // 24h format (or true for 12h with AM/PM)
            meridiem: false,
          }}
          eventClick={(info) => {
            const schedule = schedules.find(s => String(s.id) === info.event.id);
            if (schedule && onEventClick) {
              onEventClick(schedule);
            }
          }}
          eventContent={eventContent}
          eventDisplay="block"
          displayEventTime={false}
          displayEventEnd={false}
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
