import React, { useState } from 'react';
import { Timetable } from './pages/Timetable';

const sampleClasses = [
  { id: 1, day: 'Monday', start: 8, end: 10, code: 'ICT 2201', subject: 'Web Application Development', room: 'Lab 01', batch: 'ICT 22', color: 'violet' },
  { id: 2, day: 'Monday', start: 10, end: 12, code: 'ICT 2203', subject: 'Data Structures & Algorithms', room: 'Room 02', batch: 'ICT 22', color: 'blue' },
  { id: 3, day: 'Monday', start: 13, end: 15, code: 'ICT 2104', subject: 'Computer Networks', room: 'Lab 02', batch: 'ICT 23', color: 'mint' },

  { id: 4, day: 'Tuesday', start: 9, end: 11, code: 'ICT 2202', subject: 'Database Management Systems', room: 'Room 03', batch: 'ICT 22', color: 'orange' },
  { id: 5, day: 'Tuesday', start: 11, end: 13, code: 'ICT 2201', subject: 'Web Application Development', room: 'Lab 01', batch: 'ICT 22', color: 'violet' },
  { id: 6, day: 'Tuesday', start: 14, end: 16, code: 'ICT 2205', subject: 'Software Engineering', room: 'Room 04', batch: 'ICT 23', color: 'pink' },

  { id: 7, day: 'Wednesday', start: 8, end: 10, code: 'ICT 2203', subject: 'Data Structures & Algorithms', room: 'Room 02', batch: 'ICT 22', color: 'blue' },
  { id: 8, day: 'Wednesday', start: 10, end: 12, code: 'ICT 2202', subject: 'Database Management Systems', room: 'Room 03', batch: 'ICT 22', color: 'orange' },
  { id: 9, day: 'Wednesday', start: 13, end: 15, code: 'ICT 2206', subject: 'Human Computer Interaction', room: 'Room 05', batch: 'ICT 23', color: 'mint' },

  { id: 10, day: 'Thursday', start: 9, end: 11, code: 'ICT 2104', subject: 'Computer Networks', room: 'Lab 02', batch: 'ICT 23', color: 'mint' },
  { id: 11, day: 'Thursday', start: 11, end: 13, code: 'ICT 2205', subject: 'Software Engineering', room: 'Room 04', batch: 'ICT 23', color: 'pink' },
  { id: 12, day: 'Thursday', start: 14, end: 16, code: 'ICT 2201', subject: 'Web Application Development', room: 'Lab 01', batch: 'ICT 22', color: 'violet' },

  { id: 13, day: 'Friday', start: 8, end: 10, code: 'ICT 2206', subject: 'Human Computer Interaction', room: 'Room 05', batch: 'ICT 23', color: 'mint' },
  { id: 14, day: 'Friday', start: 10, end: 12, code: 'ICT 2203', subject: 'Data Structures & Algorithms', room: 'Room 02', batch: 'ICT 22', color: 'blue' }
];

export default function App() {
  const [classes, setClasses] = useState(sampleClasses);
  const [batchFilter, setBatchFilter] = useState('All batches');

  return (
    <Timetable
      classes={classes}
      onRemove={(id) =>
        setClasses(previous => previous.filter(item => item.id !== id))
      }
      canManage={true}
      batches={[
        { name: 'ICT 22' },
        { name: 'ICT 23' }
      ]}
      batchFilter={batchFilter}
      setBatchFilter={setBatchFilter}
      periods={[]}
      onDeletePeriod={() => {}}
      openAdd={() => alert('This is only a preview.')}
      conflicts={[]}
      setConflicts={() => {}}
    />
  );
}