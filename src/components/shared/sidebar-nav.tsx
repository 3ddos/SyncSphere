'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutGrid } from 'lucide-react';

import { cn } from '@/lib/utils';
import { UserNav } from '@/components/shared/user-nav';
import { Logo } from '../logo';
import { calendars } from '@/lib/data';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const calendarColorClasses: { [key: string]: string } = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
};


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-primary text-primary-foreground md:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo className="text-primary-foreground" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-2 px-4 py-4">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10',
              pathname === '/dashboard' ? 'bg-primary-foreground/20' : ''
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/calendar"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10',
              pathname === '/calendar' ? 'bg-primary-foreground/20' : ''
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Link>
        </nav>
        <div className="flex-1 px-4 py-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Calendars</h3>
            <div className="space-y-2">
                {calendars.map(calendar => (
                    <div key={calendar.id} className="flex items-center space-x-2 rounded-lg px-3 py-2">
                        <Checkbox id={calendar.id} defaultChecked className="border-primary-foreground/50 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"/>
                        <div className={cn("h-3 w-3 rounded-full", calendarColorClasses[calendar.color])}></div>
                        <Label htmlFor={calendar.id} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{calendar.name}</Label>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <div className="mt-auto border-t p-4">
        <UserNav />
      </div>
    </aside>
  );
}
