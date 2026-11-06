export const initialClasses = [
  { id: 1, day: 1, start: 8.5, end: 10.5, code: 'UCT 22022', title: 'Practical for Microcontroller System Programming', lecturer: 'Mr. SL Abdul Haleem', room: 'CIS', batch: 'ICT 22', color: 'violet' },
  { id: 2, day: 2, start: 8.5, end: 10.5, code: 'CIS 22022', title: 'Information Assurance and Forensics', lecturer: 'Mr. MJ Ahamed Sabani', room: 'LH10', batch: 'ICT 22', color: 'blue' },
  { id: 3, day: 3, start: 8.5, end: 9.5, code: 'UCT 22011', title: 'Microcontroller System Programming', lecturer: 'Mr. SL Abdul Haleem', room: 'LH5', batch: 'ICT 22', color: 'orange' },
  { id: 4, day: 4, start: 8.5, end: 10.5, code: 'UCT 22022', title: 'Practical for Microcontroller System Programming', lecturer: 'Mr. SL Abdul Haleem', room: 'CIS', batch: 'ICT 22', color: 'violet' },
  { id: 5, day: 3, start: 9.5, end: 11.5, code: 'SWT 22012', title: 'Internet Application Development', lecturer: 'Mr. J Ahamed Adhil', room: 'LH5', batch: 'ICT 22', color: 'mint' },
  { id: 6, day: 0, start: 10.5, end: 12.5, code: 'CIS 22032', title: 'E-commerce Strategies and Architecture', lecturer: 'Ms. AF Masroofa', room: 'SWT', batch: 'ICT 22', color: 'pink' },
  { id: 7, day: 1, start: 10.5, end: 12.5, code: 'CMS 22012', title: 'Leadership & Communication Skills', lecturer: 'Ms. ARF Shafana', room: 'LH5', batch: 'ICT 22', color: 'orange' },
  { id: 9, day: 4, start: 10.5, end: 12.5, code: 'CIS 22042', title: 'Practical for Distributed and Cloud Computing', lecturer: 'Mr. Janotheepan (VL)', room: 'CIS', batch: 'ICT 22', color: 'blue' },
  { id: 10, day: 0, start: 13.5, end: 16.5, code: 'SWT 22022', title: 'Practical for Internet Application Development', lecturer: 'Mr. J Ahamed Adhil', room: 'CIS', batch: 'ICT 22', color: 'violet' },
  { id: 11, day: 2, start: 13.5, end: 16.5, code: 'CIS 22042', title: 'Practical for Distributed and Cloud Computing', lecturer: 'Mr. Janotheepan (VL)', room: 'MAC', batch: 'ICT 22', color: 'blue' },
  { id: 12, day: 1, start: 14.5, end: 16.5, code: 'CIS 22012', title: 'Distributed and Cloud Computing', lecturer: 'Mr. Janotheepan (VL)', room: 'LH10', batch: 'ICT 22', color: 'mint' },
  { id: 13, day: 4, start: 14.5, end: 17.5, code: 'SWT 22022', title: 'Practical for Internet Application Development', lecturer: 'Mr. J Ahamed Adhil', room: 'CIS', batch: 'ICT 22', color: 'violet' },
];
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const times = Array.from({ length: 20 }, (_, index) => 8 + index * 0.5);
export const courses = [
  { code: 'SWT 22012', title: 'Internet Application Development', lecturer: 'Mr. J Ahamed Adhil', room: 'LH5', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'mint' },
  { code: 'CIS 22012', title: 'Distributed and Cloud Computing', lecturer: 'Mr. Janotheepan (VL)', room: 'LH10', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'blue' },
  { code: 'CIS 22022', title: 'Information Assurance and Forensics', lecturer: 'Mr. MJ Ahamed Sabani', room: 'LH10', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'orange' },
  { code: 'CIS 22032', title: 'E-commerce Strategies and Architecture', lecturer: 'Ms. AF Masroofa', room: 'SWT', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'pink' },
  { code: 'UCT 22011', title: 'Microcontroller System Programming', lecturer: 'Mr. SL Abdul Haleem', room: 'LH5', batch: 'ICT 22', students: 42, hours: '1 hr', color: 'orange' },
  { code: 'CMS 22012', title: 'Leadership & Communication Skills', lecturer: 'Ms. ARF Shafana', room: 'LH5', batch: 'ICT 22', students: 42, hours: '2 hrs', color: 'orange' },
  { code: 'SWT 22022', title: 'Practical for Internet Application Development', lecturer: 'Mr. J Ahamed Adhil', room: 'CIS', batch: 'ICT 22', students: 42, hours: '6 hrs', color: 'violet' },
  { code: 'CIS 22042', title: 'Practical for Distributed and Cloud Computing', lecturer: 'Mr. Janotheepan (VL)', room: 'MAC', batch: 'ICT 22', students: 42, hours: '5 hrs', color: 'blue' },
  { code: 'UCT 22022', title: 'Practical for Microcontroller System Programming', lecturer: 'Mr. SL Abdul Haleem', room: 'CIS', batch: 'ICT 22', students: 42, hours: '4 hrs', color: 'violet' },
];
export const initialPeople = [
  { name: 'Mr. J Ahamed Adhil', role: 'Lecturer', area: 'Internet Application Development', hours: 8, status: 'Available', initials: 'JA' },
  { name: 'Mr. Janotheepan (VL)', role: 'Lecturer', area: 'Distributed and Cloud Computing', hours: 7, status: 'Available', initials: 'JV' },
  { name: 'Mr. MJ Ahamed Sabani', role: 'Lecturer', area: 'Information Assurance and Forensics', hours: 2, status: 'Available', initials: 'MS' },
  { name: 'Ms. AF Masroofa', role: 'Lecturer', area: 'E-commerce Strategies and Architecture', hours: 2, status: 'Available', initials: 'AM' },
  { name: 'Mr. SL Abdul Haleem', role: 'Lecturer', area: 'Microcontroller System Programming', hours: 5, status: 'Available', initials: 'SH' },
  { name: 'Ms. ARF Shafana', role: 'Lecturer', area: 'Leadership & Communication Skills', hours: 2, status: 'Available', initials: 'AS' },
];
export const initialRooms = [
  { name: 'Lecture Hall 10', code: 'LH10', type: 'Lecture hall', capacity: 120, building: 'Technology Block', status: 'Available' },
  { name: 'Lecture Hall 5', code: 'LH5', type: 'Lecture hall', capacity: 90, building: 'Technology Block', status: 'Available' },
  { name: 'Computing Information System Laboratory', code: 'CIS', type: 'Computer lab', capacity: 45, building: 'ICT Block', status: 'Available' },
  { name: 'Software Technologies Laboratory', code: 'SWT', type: 'Computer lab', capacity: 45, building: 'ICT Block', status: 'Available' },
  { name: 'Mobile Application Laboratory', code: 'MAC', type: 'Computer lab', capacity: 45, building: 'ICT Block', status: 'Available' },
];
export const initialBatches = [
  { name: 'ICT 22', year: 'Year 2', students: 42, semester: 'Semester 2', courses: 9 },
  { name: 'ICT 23', year: 'Year 1', students: 48, semester: 'Semester 2', courses: 5 },
  { name: 'ICT 21', year: 'Year 3', students: 36, semester: 'Semester 2', courses: 7 },
];
export const fmt = h => {
  const hour = Math.floor(h);
  const minute = Math.round((h - hour) * 60);
  return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
};
export const loadSaved = (key, fallback) => { try { const value = localStorage.getItem(`unischedule:${key}`); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
export const migrateLegacyDemoData = () => {
  const savedClasses = loadSaved('classes', null);
  const legacySlots = [
    [0, 8, 'ICT 2201', 'Dr. N. Perera', 'Lab 02', 'violet'],
    [0, 10, 'ICT 2203', 'Ms. F. Ahamed', 'LT 01', 'blue'],
    [0, 13, 'ICT 2104', 'Mr. M. Rizwan', 'LT 02', 'mint'],
    [1, 9, 'ICT 2202', 'Dr. S. Nazeer', 'Lab 01', 'orange'],
    [1, 11, 'ICT 2201', 'Dr. N. Perera', 'Lab 02', 'violet'],
    [1, 14, 'ICT 2205', 'Ms. R. Fathima', 'LT 01', 'pink'],
    [2, 8, 'ICT 2203', 'Ms. F. Ahamed', 'LT 01', 'blue'],
    [2, 10, 'ICT 2202', 'Dr. S. Nazeer', 'Lab 01', 'orange'],
    [2, 13, 'ICT 2206', 'Mr. A. Imthiyas', 'LT 03', 'mint'],
    [3, 9, 'ICT 2104', 'Mr. M. Rizwan', 'LT 02', 'mint'],
    [3, 11, 'ICT 2205', 'Ms. R. Fathima', 'LT 01', 'pink'],
    [3, 14, 'ICT 2201', 'Dr. N. Perera', 'Lab 02', 'violet'],
    [4, 8, 'ICT 2206', 'Mr. A. Imthiyas', 'LT 03', 'mint'],
    [4, 10, 'ICT 2203', 'Ms. F. Ahamed', 'LT 01', 'blue'],
  ];
  const legacyTitles = {
    'ICT 2201': 'Web Application Development',
    'ICT 2202': 'Database Management Systems',
    'ICT 2203': 'Data Structures & Algorithms',
    'ICT 2104': 'Computer Networks',
    'ICT 2205': 'Software Engineering',
    'ICT 2206': 'Human Computer Interaction',
  };
  const isLegacyDemo = Array.isArray(savedClasses) &&
    savedClasses.length === legacySlots.length &&
    legacySlots.every(([day, start, code, lecturer, room, color], index) =>
      savedClasses[index]?.id === index + 1 &&
      savedClasses[index]?.day === day &&
      savedClasses[index]?.start === start &&
      savedClasses[index]?.end === start + 2 &&
      savedClasses[index]?.code === code &&
      savedClasses[index]?.title === legacyTitles[code] &&
      savedClasses[index]?.lecturer === lecturer &&
      savedClasses[index]?.room === room &&
      savedClasses[index]?.batch === 'ICT 22' &&
      savedClasses[index]?.color === color
    );
  if (!isLegacyDemo) return;

  localStorage.setItem('unischedule:classes', JSON.stringify(initialClasses));
  const legacyCourseCodes = ['ICT 2201', 'ICT 2202', 'ICT 2203', 'ICT 2104', 'ICT 2205', 'ICT 2206'];
  const savedCourses = loadSaved('courses', []);
  if (Array.isArray(savedCourses) && savedCourses.length === legacyCourseCodes.length && legacyCourseCodes.every((code, index) => savedCourses[index]?.code === code)) {
    localStorage.setItem('unischedule:courses', JSON.stringify(courses));
  }
  const legacyLecturers = ['Dr. N. Perera', 'Ms. F. Ahamed', 'Dr. S. Nazeer', 'Mr. M. Rizwan'];
  const savedPeople = loadSaved('people', []);
  if (Array.isArray(savedPeople) && savedPeople.length === legacyLecturers.length && legacyLecturers.every((name, index) => savedPeople[index]?.name === name)) {
    localStorage.setItem('unischedule:people', JSON.stringify(initialPeople));
  }
  const legacyRooms = ['LT 01', 'LT 02', 'Lab 01', 'Lab 02', 'LT 03'];
  const savedRooms = loadSaved('rooms', []);
  if (Array.isArray(savedRooms) && savedRooms.length === legacyRooms.length && legacyRooms.every((code, index) => savedRooms[index]?.code === code)) {
    localStorage.setItem('unischedule:rooms', JSON.stringify(initialRooms));
  }
  const savedBatches = loadSaved('batches', []);
  if (Array.isArray(savedBatches) && savedBatches.length === 3 && savedBatches[0]?.name === 'ICT 22' && savedBatches[0]?.courses === 6) {
    localStorage.setItem('unischedule:batches', JSON.stringify(initialBatches));
  }
};
