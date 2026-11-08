import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(12).max(128).refine(value => Buffer.byteLength(value, 'utf8') <= 72, {
    message: 'Password must be no more than 72 UTF-8 bytes.',
  }),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128).refine(value => Buffer.byteLength(value, 'utf8') <= 72, {
    message: 'Password must be no more than 72 UTF-8 bytes.',
  }),
}).strict();

export const emailSettingsSchema = z.object({
  emailReminders: z.boolean(),
  batch: z.string().trim().max(80).optional(),
}).strict();

const text = max => z.string().trim().min(1).max(max);
const nonNegative = max => z.number().int().min(0).max(max);
const resource = shape => z.object(shape).strict();
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, { message: 'Enter a valid calendar date.' });

export const resourceSchemas = {
  classes: resource({
    day: z.number().int().min(0).max(4),
    start: z.number().min(8).max(17.75).multipleOf(0.25),
    end: z.number().min(8.25).max(18).multipleOf(0.25),
    code: text(30),
    title: text(160),
    lecturer: text(120),
    room: text(80),
    batch: text(80),
    color: z.enum(['violet', 'blue', 'mint', 'orange', 'pink']).default('violet'),
  }).refine(value => value.end > value.start, { path: ['end'], message: 'End time must be after start time.' }),
  courses: resource({
    code: text(30),
    title: text(160),
    lecturer: text(120),
    room: text(80),
    batch: text(80),
    students: nonNegative(10000),
    hours: text(30),
    color: z.enum(['violet', 'blue', 'mint', 'orange', 'pink']).default('violet'),
  }),
  lecturers: resource({
    name: text(120),
    role: text(80),
    area: text(120),
    hours: z.number().min(0).max(100),
    status: text(80),
    initials: text(4),
  }),
  rooms: resource({
    name: text(120),
    code: text(40),
    type: text(80),
    capacity: z.number().int().min(1).max(10000),
    building: text(120),
    status: text(80),
  }),
  batches: resource({
    name: text(80),
    year: text(40),
    students: nonNegative(10000),
    semester: text(40),
    courses: nonNegative(1000),
  }),
  availability: resource({
    lecturer: text(120),
    days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])).max(5),
  }),
  calendarPeriod: resource({
    title: text(120),
    type: z.enum(['Vacation', 'Study leave']),
    startDate: calendarDate,
    endDate: calendarDate,
    description: z.string().trim().max(500).default(''),
  }).refine(value => value.endDate >= value.startDate, {
    path: ['endDate'],
    message: 'End date must be on or after the start date.',
  }),
  announcement: resource({
    title: text(120),
    message: text(2000),
  }),
};
