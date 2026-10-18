// Date/time helpers shared by the timetable, dashboard and services.

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const times = [8, 9, 10, 11, 12, 13, 14, 15, 16];

// 8 -> "08:00"
export const fmt = (hour) => `${String(hour).padStart(2, '0')}:00`;

// "Monday" -> "MON"
export const shortDay = (day) => day.slice(0, 3).toUpperCase();

// Format a time range, e.g. "08:00 – 10:00"
export const fmtRange = (start, end) => `${fmt(start)} – ${fmt(end)}`;
