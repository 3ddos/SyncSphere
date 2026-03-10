'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export type Schedule = {
  id: string | number;
  user_id: string | number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
};

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session_id')?.value ?? null;
}

export async function getSchedules(): Promise<Schedule[] | { error: string }> {
  try {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching schedules:', error);
      return { error: 'Failed to fetch schedules' };
    }

    return data as Schedule[];
  } catch (err) {
    console.error('Unexpected error fetching schedules:', err);
    return { error: 'Internal server error' };
  }
}

export async function getTodaysSchedules(): Promise<Schedule[] | { error: string }> {
  try {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching today schedules:', error);
      return { error: 'Failed to fetch today schedules' };
    }

    return data as Schedule[];
  } catch (err) {
    console.error('Unexpected error fetching today schedules:', err);
    return { error: 'Internal server error' };
  }
}

