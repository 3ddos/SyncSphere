'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemsProps {
    className?: string;
    onItemClick?: () => void;
}

export function NavItems({ className, onItemClick }: NavItemsProps) {
    const pathname = usePathname();

    return (
        <nav className={cn('flex flex-col space-y-2', className)}>
            <Link
                href="/dashboard"
                onClick={onItemClick}
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
                onClick={onItemClick}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10',
                    pathname === '/calendar' ? 'bg-primary-foreground/20' : ''
                )}
            >
                <Calendar className="h-4 w-4" />
                Calendar
            </Link>
        </nav>
    );
}
