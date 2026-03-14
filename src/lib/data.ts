import type { User, Calendar, Event } from './types';
import { PlaceHolderImages } from './placeholder-images';

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar')?.imageUrl || 'https://picsum.photos/seed/1/100/100';

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', email: 'alex@example.com', avatarUrl: userAvatar, shared_users: {} },
  { id: 'user-2', name: 'Jordan Smith', email: 'jordan@example.com', avatarUrl: 'https://picsum.photos/seed/2/100/100', shared_users: {} },
  { id: 'user-3', name: 'Taylor Brown', email: 'taylor@example.com', avatarUrl: 'https://picsum.photos/seed/3/100/100', shared_users: {} },
];

export const calendars: Calendar[] = [
  { id: 'cal-1', name: 'Personal', ownerId: 'user-1', color: 'blue' },
  { id: 'cal-2', name: 'Work', ownerId: 'user-1', color: 'green' },
  { id: 'cal-3', name: "Jordan's Calendar", ownerId: 'user-2', color: 'purple' },
  { id: 'cal-4', name: 'Team Sync', ownerId: 'user-3', color: 'red' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(today.getDate() - 14);


export const events: Event[] = [
  {
    id: 'evt-1',
    calendarId: 'cal-1',
    title: 'Morning Jog',
    description: 'A refreshing jog around the park to start the day.',
    startTime: new Date(new Date(today).setHours(7, 0, 0, 0)),
    endTime: new Date(new Date(today).setHours(8, 0, 0, 0)),
    participants: ['user-1'],
  },
  {
    id: 'evt-2',
    calendarId: 'cal-2',
    title: 'Team Standup',
    description: 'Daily standup meeting to sync on project progress.',
    startTime: new Date(new Date(today).setHours(9, 30, 0, 0)),
    endTime: new Date(new Date(today).setHours(10, 0, 0, 0)),
    participants: ['user-1', 'user-2', 'user-3'],
  },
  {
    id: 'evt-3',
    calendarId: 'cal-3',
    title: "Jordan's Dentist Appt.",
    description: 'Routine check-up.',
    startTime: new Date(new Date(today).setHours(11, 0, 0, 0)),
    endTime: new Date(new Date(today).setHours(12, 0, 0, 0)),
    participants: ['user-2'],
  },
  {
    id: 'evt-4',
    calendarId: 'cal-2',
    title: 'Project Phoenix - Brainstorm',
    description: 'Brainstorming session for the new Project Phoenix.',
    startTime: new Date(new Date(today).setHours(14, 0, 0, 0)),
    endTime: new Date(new Date(today).setHours(15, 30, 0, 0)),
    participants: ['user-1', 'user-3'],
  },
  {
    id: 'evt-5',
    calendarId: 'cal-1',
    title: 'Gym Session',
    description: 'Leg day.',
    startTime: new Date(new Date(today).setHours(18, 0, 0, 0)),
    endTime: new Date(new Date(today).setHours(19, 0, 0, 0)),
    participants: ['user-1'],
  },
  {
    id: 'evt-6',
    calendarId: 'cal-4',
    title: 'Weekly Sync',
    description: 'Team-wide weekly synchronization meeting.',
    startTime: new Date(new Date(yesterday).setHours(16, 0, 0, 0)),
    endTime: new Date(new Date(yesterday).setHours(17, 0, 0, 0)),
    participants: ['user-1', 'user-2', 'user-3'],
  },
  {
    id: 'evt-7',
    calendarId: 'cal-2',
    title: 'Client Call',
    description: 'Follow-up call with the client about the new proposal.',
    startTime: new Date(new Date(tomorrow).setHours(10, 0, 0, 0)),
    endTime: new Date(new Date(tomorrow).setHours(11, 0, 0, 0)),
    participants: ['user-1', 'user-2'],
  },
  {
    id: 'evt-8',
    calendarId: 'cal-1',
    title: 'Dinner with friends',
    description: 'Catch up with old friends over dinner.',
    startTime: new Date(new Date(nextWeek).setHours(19, 30, 0, 0)),
    endTime: new Date(new Date(nextWeek).setHours(21, 0, 0, 0)),
    participants: ['user-1'],
  },
  {
    id: 'evt-9',
    calendarId: 'cal-3',
    title: 'Design Review',
    description: 'Review of the new UI mockups.',
    startTime: new Date(new Date(twoWeeksAgo).setHours(13, 0, 0, 0)),
    endTime: new Date(new Date(twoWeeksAgo).setHours(14, 0, 0, 0)),
    participants: ['user-2', 'user-3'],
  },
];
