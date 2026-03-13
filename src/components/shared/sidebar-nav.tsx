'use client';

import Link from 'next/link';
import { NavItems } from './nav-items';
import { UserNav } from '@/components/shared/user-nav';
import { Logo } from '../logo';
import { CalendarNav } from './calendar-nav';

export function SidebarNav() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-primary text-primary-foreground md:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo className="text-primary-foreground" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <NavItems className="flex-1 px-4 py-4" />

        <CalendarNav />
      </div>
      <div className="mt-auto border-t p-4">
        <UserNav />
      </div>
    </aside >
  );
}
