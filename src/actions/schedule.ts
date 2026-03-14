'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { SharedUser } from '@/lib/types';

export type Schedule = {
  id: string | number;
  user_id: string | number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
  repeat?: boolean;
  user_name?: string;
};

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session_id')?.value ?? null;
}

export async function getSharedUsersFromCookies(): Promise<SharedUser> {
  const cookieStore = await cookies();
  const sharedUsers = JSON.parse(cookieStore.get('session_shared_users')?.value || '{}');
  if (!sharedUsers) return {};
  return sharedUsers;
}

export async function getActiveSharedUsersFromCookies(): Promise<SharedUser> {
  const sharedUsers = await getSharedUsersFromCookies();
  const activeSharedKeys = Object.keys(sharedUsers).filter(key => sharedUsers[key].active);
  const activeSharedUsers = activeSharedKeys.reduce((acc, key) => {
    acc[key] = sharedUsers[key];
    return acc;
  }, {} as SharedUser);
  return activeSharedUsers;
}

export async function activeSharedUser(userId: string, active: boolean | string): Promise<SharedUser> {
  const cookieStore = await cookies();
  const sharedUsers = await getSharedUsersFromCookies();
  sharedUsers[userId].active = (active === 'true' || active === true);
  cookieStore.set('session_shared_users', JSON.stringify(sharedUsers), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  return sharedUsers;
}

// async function getSharedUsersFromDB(userId: string): Promise<SharedUser> {
//   const { data, error } = await supabase
//     .from('users')
//     .select('shared_users, name')
//     .eq('id', userId)
//     .single();

//   if (error) return {};
//   const shared = data.shared_users || {};
//   return { ...shared, [userId]: data.name };
// }

export async function getSchedules(): Promise<Schedule[] | { error: string }> {
  try {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const sharedUsers = await getActiveSharedUsersFromCookies();
    const userIds = Object.keys(sharedUsers);

    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching schedules:', error);
      return { error: 'Failed to fetch schedules' };
    }

    const schedulesWithNames = (data as Schedule[]).map(s => ({
      ...s,
      user_name: sharedUsers[String(s.user_id)].name || 'Unknown User'
    }));

    return schedulesWithNames;
  } catch (err) {
    console.error('Unexpected error fetching schedules:', err);
    return { error: 'Internal server error' };
  }
}

export async function getTodaysSchedules(): Promise<Schedule[] | { error: string }> {
  try {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const sharedUsers = await getActiveSharedUsersFromCookies();
    const userIds = Object.keys(sharedUsers);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const todayWeekday = now.getDay();

    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .in('user_id', userIds)
      .or(`and(repeat.eq.false,start_time.gte.${startOfDay.toISOString()},start_time.lte.${endOfDay.toISOString()}),and(repeat.eq.true,start_time.lte.${endOfDay.toISOString()})`);

    if (error) {
      console.error('Error fetching today schedules:', error);
      return { error: 'Failed to fetch today schedules' };
    }

    const filteredData = (data as Schedule[]).map(s => ({
      ...s,
      user_name: sharedUsers[String(s.user_id)].name || 'Unknown User'
    })).filter(event => {
      if (!event.repeat) return true;
      const eventDate = new Date(event.start_time);
      return eventDate.getDay() === todayWeekday;
    });

    // Sort by the time part of start_time
    filteredData.sort((a, b) => {
      const timeA = new Date(a.start_time).getHours() * 60 + new Date(a.start_time).getMinutes();
      const timeB = new Date(b.start_time).getHours() * 60 + new Date(b.start_time).getMinutes();
      return timeA - timeB;
    });

    return filteredData;
  } catch (err) {
    console.error('Unexpected error fetching today schedules:', err);
    return { error: 'Internal server error' };
  }
}

