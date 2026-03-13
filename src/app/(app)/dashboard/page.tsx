import AiSummary from '@/components/dashboard/ai-summary';
import TodaysEvents from '@/components/dashboard/todays-events';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTodaysSchedules } from '@/actions/schedule';

export default async function DashboardPage() {
  const result = await getTodaysSchedules();
  const todaySchedules = Array.isArray(result) ? result : [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <div className="col-span-4 lg:col-span-7">
           <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <AiSummary />
           </Suspense>
        </div> */}
        <div className="col-span-4 lg:col-span-7">
          <TodaysEvents schedules={todaySchedules} />
        </div>
      </div>
    </div>
  );
}
