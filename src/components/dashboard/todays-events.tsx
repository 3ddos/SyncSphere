import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Schedule } from '@/actions/schedule';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { tz } from '@date-fns/tz';

const MADRID = tz('Europe/Madrid');
type Props = {
  schedules: Schedule[];
};

export default function TodaysEvents({ schedules }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Schedule {format(new Date(), 'dd/MM/yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.length > 0 ? (
          schedules.map((event, index) => {
            const dotColor = event.color;
            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);

            return (
              <div key={event.id} className="flex items-start gap-4">
                <div className="w-20 text-sm text-muted-foreground text-right">
                  <p>{format(startDate, 'HH:mm', { in: MADRID })}</p>
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
                    {format(startDate, 'HH:mm', { in: MADRID })} – {format(endDate, 'HH:mm', { in: MADRID })}
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
