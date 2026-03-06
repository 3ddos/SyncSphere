import MonthlyCalendar from '@/components/calendar/monthly-calendar';
import EventSheet from '@/components/shared/event-sheet';

export default function CalendarPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <EventSheet />
        </div>
        <MonthlyCalendar />
      </div>
    </>
  );
}
