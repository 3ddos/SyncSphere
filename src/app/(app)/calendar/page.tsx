'use client'

import MonthlyCalendar from '@/components/calendar/monthly-calendar';
import EventSheet from '@/components/shared/event-sheet';
import { getSchedules } from '@/actions/schedule';
import { useState, useEffect } from 'react';
import { Schedule } from '@/actions/schedule';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    const result = await getSchedules();
    setSchedules(result as Schedule[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <div className="flex items-center gap-2">
            <Button onClick={() => { setSelectedEvent(undefined); setIsSheetOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
            <EventSheet
              selectedDate={selectedDate}
              initialData={selectedEvent}
              open={isSheetOpen}
              onOpenChange={(open) => {
                setIsSheetOpen(open);
                if (!open) setSelectedEvent(undefined);
              }}
              onSuccess={fetchSchedules}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <MonthlyCalendar
            schedules={schedules}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onEventClick={(schedule) => {
              setSelectedEvent(schedule);
              setIsSheetOpen(true);
            }}
          />
        )}
      </div>
    </>
  );
}
