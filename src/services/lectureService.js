// Lecture/timetable service: loading, saving, conflict checks, auto-generation and CSV export.
import { loadSaved, saveItem, initialClasses, courses as seedCourses, initialPeople, initialRooms, initialBatches } from './api';
import { days, fmt } from '../utils/formatDate';

// ---- Data access ----
export const getClasses = () => loadSaved('classes', initialClasses);
export const saveClasses = (list) => saveItem('classes', list);
export const getCourses = () => loadSaved('courses', seedCourses);
export const getPeople = () => loadSaved('people', initialPeople);
export const getRooms = () => loadSaved('rooms', initialRooms);
export const getBatches = () => loadSaved('batches', initialBatches);

// ---- Conflict detection ----
// Two lectures overlap when they are on the same day and their hours intersect.
const overlaps = (a, b) => a.day === b.day && a.start < b.end && a.end > b.start;
// A clash happens when overlapping lectures share a room, a lecturer or a batch.
const sharesResource = (a, b) => a.room === b.room || a.lecturer === b.lecturer || a.batch === b.batch;

// Messages for every existing lecture that clashes with the candidate.
export const findConflicts = (classes, lecture) =>
  classes
    .filter((x) => overlaps(x, lecture) && sharesResource(x, lecture))
    .map((x) => `Conflict with ${x.code} (${days[x.day]}, ${fmt(x.start)}) — same room, lecturer, or batch.`);

// Number of clashing pairs in a whole timetable.
export const countClashes = (classes) =>
  classes.reduce((total, c, i) => total + classes.slice(i + 1).filter((x) => overlaps(x, c) && sharesResource(x, c)).length, 0);

// ---- Creating lectures ----
// Turn the add-lecture form values into a lecture object.
export const buildLecture = (form, fallbackBatch) => ({
  id: Date.now(),
  day: Number(form.day ?? 0),
  start: Number(form.start ?? 8),
  end: Number(form.end ?? 10),
  code: form.code || 'ICT 2299',
  title: form.title || 'New lecture',
  lecturer: form.lecturer || 'Unassigned lecturer',
  room: form.room || 'LT 01',
  batch: form.batch || fallbackBatch,
  color: form.color || 'violet',
});

// ---- Auto-generation ----
// Build a conflict-checked draft timetable from the course list.
export function generateTimetable(courseList, rooms, batches) {
  const next = [];
  const unplaced = [];
  const slots = [];
  for (let day = 0; day < 5; day++) for (let start = 8; start <= 14; start += 2) slots.push({ day, start, end: start + 2 });

  courseList.forEach((course, idx) => {
    const room = course.room || rooms[0]?.code || 'LT 01';
    const lecturer = course.lecturer || 'Unassigned lecturer';
    const batch = course.batch || batches[0]?.name || 'ICT 22';
    const preferred = [...slots.slice(idx % slots.length), ...slots.slice(0, idx % slots.length)];
    const slot = preferred.find((t) => !next.some((c) =>
      c.day === t.day && c.start < t.end && c.end > t.start &&
      (c.room === room || (lecturer !== 'Unassigned lecturer' && c.lecturer === lecturer) || c.batch === batch)));
    if (!slot) { unplaced.push(course.code); return; }
    next.push({ id: Date.now() + idx, ...slot, code: course.code, title: course.title, lecturer, room, batch, color: course.color || 'violet' });
  });
  return { classes: next, unplaced };
}

// ---- Statistics (dashboard + progress page) ----
export function getScheduleStats(classes, rooms) {
  const clashCount = countClashes(classes);
  const roomUtil = rooms.length ? Math.min(100, Math.round(classes.length / Math.max(1, rooms.length * 5) * 100)) : 0;
  const assignedCount = classes.filter((c) => c.lecturer && c.lecturer !== 'Unassigned lecturer').length;
  const health = Math.max(0, 100 - clashCount * 12 - Math.max(0, classes.length - assignedCount) * 3);
  const assignedPct = classes.length ? Math.round((assignedCount / classes.length) * 100) : 0;
  return { clashCount, roomUtil, assignedCount, assignedPct, health };
}

// ---- Export ----
// Download the timetable as a CSV file.
export function downloadTimetableCSV(classes) {
  const header = 'Day,Start,End,Course,Title,Lecturer,Room,Batch';
  const rows = classes.map((c) => `${days[c.day]},${fmt(c.start)},${fmt(c.end)},${c.code},"${c.title}",${c.lecturer},${c.room},${c.batch}`);
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'unischedule-timetable.csv';
  a.click();
  URL.revokeObjectURL(url);
}
