import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Schedule } from '@/actions/schedule';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const defaultColors = [
  '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#f97316', '#06b6d4',
];

type Props = {
  schedules: Schedule[];
};

export default function TodaysEvents({ schedules }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.length > 0 ? (
          schedules.map((event, index) => {
            const dotColor = event.color ?? defaultColors[index % defaultColors.length];
            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);

            return (
              <div key={event.id} className="flex items-start gap-4">
                <div className="w-20 text-sm text-muted-foreground text-right">
                  <p>{format(startDate, 'h:mm a')}</p>
                </div>
                <div className="relative flex-1 border-l pl-8 pb-8">
                  <div
                    className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <p className="font-semibold">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <Badge variant="outline" className="mt-2 text-xs">
                    {format(startDate, 'h:mm a')} – {format(endDate, 'h:mm a')}
                  </Badge>
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
