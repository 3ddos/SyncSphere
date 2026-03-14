'use client';

import { Loader2 } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { activeSharedUser, getSharedUsersFromCookies } from '@/actions/schedule';
import { useState, useEffect } from 'react';
import { SharedUser } from '@/lib/types';

export function CalendarNav() {
    const [loading, setLoading] = useState(false);
    const [sharedUsers, setSharedUsers] = useState<SharedUser>({});

    const fetchSchedules = async () => {
        setLoading(true);
        const result = await getSharedUsersFromCookies();
        setSharedUsers(result as SharedUser);
        setLoading(false);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleCheckboxChange = async (checked: boolean | string, key: string) => {
        const updatedSharedUsers = await activeSharedUser(key, checked);
        setSharedUsers(updatedSharedUsers);
        window.dispatchEvent(new Event('shared-users-updated'));
    }

    return (
        <div className="px-4 py-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Calendars</h3>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="space-y-2">
                    {Object.entries(sharedUsers).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center space-x-2 rounded-lg px-3 py-2">
                            <Checkbox id={key} checked={value.active} className="border-primary-foreground/50 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground" onCheckedChange={(checked) => { handleCheckboxChange(checked, key) }} />
                            <Label htmlFor={key} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{value.name}</Label>
                        </div>
                    ))}
                </div>)}
        </div>
    );
}
