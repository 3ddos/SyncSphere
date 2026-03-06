import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CalendarDays className="h-6 w-6" />
      <h1 className="text-xl font-bold tracking-tight">SyncSphere</h1>
    </div>
  );
}
