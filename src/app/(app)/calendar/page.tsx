'use client'

import MonthlyCalendar from '@/components/calendar/monthly-calendar';
import EventSheet from '@/components/shared/event-sheet';
import { getSchedules } from '@/actions/schedule';
import { useState, useEffect } from 'react';
import { Schedule } from '@/actions/schedule';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSchedules().then((schedules) => {
      setSchedules(schedules as Schedule[]);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <EventSheet selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <MonthlyCalendar schedules={schedules} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        )}
      </div>
    </>
  );
}
