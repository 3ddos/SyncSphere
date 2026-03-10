import type React from 'react';
import { SidebarNav } from '@/components/shared/sidebar-nav';
import { MobileNav } from '@/components/shared/mobile-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <SidebarNav />
      <MobileNav />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
