// Mock API layer. Everything is stored in this browser's localStorage under the "unischedule:" prefix.
// When a real backend is ready, replace the bodies of loadSaved/saveItem with fetch/axios calls
// (the services that import them do not need to change).

const PREFIX = 'unischedule:';

// Read a saved value; fall back to the given default when nothing is stored or storage is blocked.
export const loadSaved = (key, fallback) => {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// Save a value as JSON.
export const saveItem = (key, value) => {
  try { localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value)); } catch { /* storage unavailable */ }
};

// Remove a saved value.
export const removeItem = (key) => {
  try { localStorage.removeItem(`${PREFIX}${key}`); } catch { /* storage unavailable */ }
};

// ---- Demo seed data (used the first time the app opens) ----
export const initialClasses = [
  { id: 1, day: 0, start: 8, end: 10, code: 'ICT 2201', title: 'Web Application Development', lecturer: 'Dr. N. Perera', room: 'Lab 02', batch: 'ICT 22', color: 'violet' },
  { id: 2, day: 0, start: 10, end: 12, code: 'ICT 2203', title: 'Data Structures & Algorithms', lecturer: 'Ms. F. Ahamed', room: 'LT 01', batch: 'ICT 22', color: 'blue' },
  { id: 3, day: 0, start: 13, end: 15, code: 'ICT 2104', title: 'Computer Networks', lecturer: 'Mr. M. Rizwan', room: 'LT 02', batch: 'ICT 22', color: 'mint' },
  { id: 4, day: 1, start: 9, end: 11, code: 'ICT 2202', title: 'Database Management Systems', lecturer: 'Dr. S. Nazeer', room: 'Lab 01', batch: 'ICT 22', color: 'orange' },
  { id: 5, day: 1, start: 11, end: 13, code: 'ICT 2201', title: 'Web Application Development', lecturer: 'Dr. N. Perera', room: 'Lab 02', batch: 'ICT 22', color: 'violet' },
  { id: 6, day: 1, start: 14, end: 16, code: 'ICT 2205', title: 'Software Engineering', lecturer: 'Ms. R. Fathima', room: 'LT 01', batch: 'ICT 22', color: 'pink' },
  { id: 7, day: 2, start: 8, end: 10, code: 'ICT 2203', title: 'Data Structures & Algorithms', lecturer: 'Ms. F. Ahamed', room: 'LT 01', batch: 'ICT 22', color: 'blue' },
  { id: 8, day: 2, start: 10, end: 12, code: 'ICT 2202', title: 'Database Management Systems', lecturer: 'Dr. S. Nazeer', room: 'Lab 01', batch: 'ICT 22', color: 'orange' },
  { id: 9, day: 2, start: 13, end: 15, code: 'ICT 2206', title: 'Human Computer Interaction', lecturer: 'Mr. A. Imthiyas', room: 'LT 03', batch: 'ICT 22', color: 'mint' },
  { id: 10, day: 3, start: 9, end: 11, code: 'ICT 2104', title: 'Computer Networks', lecturer: 'Mr. M. Rizwan', room: 'LT 02', batch: 'ICT 22', color: 'mint' },
  { id: 11, day: 3, start: 11, end: 13, code: 'ICT 2205', title: 'Software Engineering', lecturer: 'Ms. R. Fathima', room: 'LT 01', batch: 'ICT 22', color: 'pink' },
  { id: 12, day: 3, start: 14, end: 16, code: 'ICT 2201', title: 'Web Application Development', lecturer: 'Dr. N. Perera', room: 'Lab 02', batch: 'ICT 22', color: 'violet' },
  { id: 13, day: 4, start: 8, end: 10, code: 'ICT 2206', title: 'Human Computer Interaction', lecturer: 'Mr. A. Imthiyas', room: 'LT 03', batch: 'ICT 22', color: 'mint' },
  { id: 14, day: 4, start: 10, end: 12, code: 'ICT 2203', title: 'Data Structures & Algorithms', lecturer: 'Ms. F. Ahamed', room: 'LT 01', batch: 'ICT 22', color: 'blue' },
];
export const courses = [
  { code: 'ICT 2201', title: 'Web Application Development', lecturer: 'Dr. N. Perera', room: 'Lab 02', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'violet' },
  { code: 'ICT 2202', title: 'Database Management Systems', lecturer: 'Dr. S. Nazeer', room: 'Lab 01', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'orange' },
  { code: 'ICT 2203', title: 'Data Structures & Algorithms', lecturer: 'Ms. F. Ahamed', room: 'LT 01', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'blue' },
  { code: 'ICT 2104', title: 'Computer Networks', lecturer: 'Mr. M. Rizwan', room: 'LT 02', batch: 'ICT 22', students: 38, hours: '2 hrs', color: 'mint' },
  { code: 'ICT 2205', title: 'Software Engineering', lecturer: 'Ms. R. Fathima', room: 'LT 01', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'pink' },
  { code: 'ICT 2206', title: 'Human Computer Interaction', lecturer: 'Mr. A. Imthiyas', room: 'LT 03', batch: 'ICT 22', students: 38, hours: '2 hrs', color: 'mint' },
];
export const initialPeople = [
  { name: 'Dr. N. Perera', role: 'Senior Lecturer', area: 'Web Development', hours: 12, status: 'Available', initials: 'NP' },
  { name: 'Ms. F. Ahamed', role: 'Lecturer', area: 'Data Structures', hours: 14, status: 'Available', initials: 'FA' },
  { name: 'Dr. S. Nazeer', role: 'Senior Lecturer', area: 'Databases', hours: 10, status: 'Unavailable Tue PM', initials: 'SN' },
  { name: 'Mr. M. Rizwan', role: 'Lecturer', area: 'Networking', hours: 16, status: 'Available', initials: 'MR' },
];
export const initialRooms = [
  { name: 'Lecture Theatre 01', code: 'LT 01', type: 'Lecture theatre', capacity: 120, building: 'Technology Block', status: 'Available' },
  { name: 'Lecture Theatre 02', code: 'LT 02', type: 'Lecture theatre', capacity: 90, building: 'Technology Block', status: 'Available' },
  { name: 'Computer Lab 01', code: 'Lab 01', type: 'Computer lab', capacity: 45, building: 'ICT Block', status: 'In use' },
  { name: 'Computer Lab 02', code: 'Lab 02', type: 'Computer lab', capacity: 45, building: 'ICT Block', status: 'Available' },
  { name: 'Lecture Theatre 03', code: 'LT 03', type: 'Lecture theatre', capacity: 75, building: 'Technology Block', status: 'Available' },
];
export const initialBatches = [
  { name: 'ICT 22', year: 'Year 2', students: 42, semester: 'Semester 2', courses: 6 },
  { name: 'ICT 23', year: 'Year 1', students: 48, semester: 'Semester 2', courses: 5 },
  { name: 'ICT 21', year: 'Year 3', students: 36, semester: 'Semester 2', courses: 7 },
];
