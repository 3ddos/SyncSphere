'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { NavItems } from './nav-items';
import { Logo } from '../logo';
import { useState } from 'react';
import { logoutUser } from '@/actions/auth';
import { LogOut } from 'lucide-react';
import { CalendarNav } from './calendar-nav';

export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <header className="flex h-16 items-center border-b px-4 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-primary p-0 text-primary-foreground">
                    <SheetHeader className="border-b h-16 px-6 flex flex-row items-center border-primary-foreground/10">
                        <SheetTitle className="text-primary-foreground text-left">
                            <Logo className="text-primary-foreground" />
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
                        <NavItems
                            className="flex px-4 py-6"
                            onItemClick={() => setOpen(false)}
                        />
                        <CalendarNav />
                        <hr className='border-primary-foreground/10' />
                        <div className='px-4 py-4'>
                            <Button
                                onClick={logoutUser}
                                className={'flex items-center gap-3 rounded-lg px-3 py-2 transition-all bg-primary-foreground/10 w-full'}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="ml-4">
                <Logo />
            </div>
        </header>
    );
}
