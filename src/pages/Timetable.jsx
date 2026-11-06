// Timetable page: weekly calendar, filtering, and lecture conflict checks.
import React, { useState } from 'react';
import {
  AlertTriangle, ArrowUpRight, ChevronLeft, ChevronRight, Download,
  Filter, Search, Sparkles, X
} from 'lucide-react';
import { days, fmt } from '../data';
import { PdfLecturerImport } from '../components/timetable/PdfLecturerImport';
import './timetablePdfTable.css';

const timetablePeriods = [
  { start: 8.5, end: 9.5 },
  { start: 9.5, end: 10.5 },
  { start: 10.5, end: 11.5 },
  { start: 11.5, end: 12.5 },
  { start: 12.5, end: 13.5, lunch: true },
  { start: 13.5, end: 14.5 },
  { start: 14.5, end: 15.5 },
  { start: 15.5, end: 16.5 },
  { start: 16.5, end: 17.5 },
];

export function Timetable({
  classes, setClasses, batches = [], batchFilter, setBatchFilter,
  selectedDay, setSelectedDay, openAdd, exportCSV, conflicts, setConflicts,
  notify, importTimetable,
}) {
  const [view, setView] = useState('Week');
  const [week, setWeek] = useState(6);
  const [search, setSearch] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('All lecturers');
  const visibleDays = days.filter(day => selectedDay === 'All days' || day === selectedDay);
  const visible = classes.filter(classItem =>
    (batchFilter === 'All batches' || classItem.batch === batchFilter) &&
    (selectedDay === 'All days' || days[classItem.day] === selectedDay) &&
    (lecturerFilter === 'All lecturers' || classItem.lecturer === lecturerFilter) &&
    (`${classItem.title} ${classItem.code} ${classItem.lecturer}`.toLowerCase().includes(search.toLowerCase()))
  );
  const lecturers = [...new Set(classes.map(classItem => classItem.lecturer).filter(Boolean))].sort();
  const handleRemove = id => {
    setClasses(classes.filter(classItem => classItem.id !== id));
    notify('Lecture removed from this demo timetable');
  };
  const [selected, setSelected] = useState(null);

  return <>
    <div className="panel timetable-toolbar">
      <div className="toolbar-left">
        <div className="view-switch">{['Week', 'Day'].map(value =>
          <button className={view === value ? 'selected' : ''} key={value} onClick={() => setView(value)}>{value}</button>
        )}</div>
        <button className="today-btn" onClick={() => { setWeek(6); setSelectedDay('All days'); }}>Today</button>
        <div className="week-switch">
          <button className="icon-btn" onClick={() => setWeek(Math.max(1, week - 1))}><ChevronLeft size={17}/></button>
          <b>Week {String(week).padStart(2, '0')}, 2026</b>
          <button className="icon-btn" onClick={() => setWeek(week + 1)}><ChevronRight size={17}/></button>
        </div>
      </div>
      <div className="toolbar-right">
        <div className="searchbox compact"><Search size={15}/><input placeholder="Search lectures..." value={search} onChange={event => setSearch(event.target.value)}/></div>
        <select className="select-control" value={batchFilter} onChange={event => setBatchFilter(event.target.value)}>
          <option>All batches</option>
          {[...new Set([...batches.map(batch => batch.name), ...classes.map(classItem => classItem.batch).filter(Boolean)])].map(name =>
            <option key={name} value={name}>{name}</option>
          )}
        </select>
        <select className="select-control" aria-label="Filter by lecturer" value={lecturerFilter} onChange={event => setLecturerFilter(event.target.value)}>
          <option>All lecturers</option>
          {lecturers.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <button className="icon-btn filter-icon" onClick={() => setSelectedDay(selectedDay === 'All days' ? 'Monday' : 'All days')} title="Toggle day filter"><Filter size={17}/></button>
      </div>
    </div>

    <PdfLecturerImport onImport={importTimetable}/>

    {conflicts.length > 0 && <div className="inline-alert"><AlertTriangle size={17}/><div><b>Conflict check</b><p>{conflicts.join(' ')}</p></div><button className="icon-btn" onClick={() => setConflicts([])}><X size={17}/></button></div>}
    <div className="timetable-summary">
      <div><span className="summary-dot purple-dot"></span><b>{visible.length}</b> lectures this week</div>
      <div><span className="summary-dot green-dot"></span> Conflict checks enabled</div>
      <div className="summary-spacer"></div>
      <button className="text-action" onClick={exportCSV}><Download size={15}/> Export timetable</button>
    </div>
    <div className="panel calendar-panel">
      <div className="calendar-scroll pdf-table-scroll">
        <table className="pdf-schedule-table">
          <thead><tr><th scope="col">TIME</th>{visibleDays.map(day => <th scope="col" key={day}>{day.toUpperCase()}</th>)}</tr></thead>
          <tbody>{timetablePeriods.map(period => period.lunch
            ? <tr className="pdf-lunch-row" key="lunch">
                <th scope="row">{fmt(period.start)} – {fmt(period.end)}</th>
                <td colSpan={visibleDays.length}>LUNCH BREAK</td>
              </tr>
            : <tr key={period.start}>
                <th scope="row">{fmt(period.start)} – {fmt(period.end)}</th>
                {visibleDays.map(day => {
                  const dayIndex = days.indexOf(day);
                  const classItem = visible.find(item => item.day === dayIndex && item.start === period.start);
                  const coveredByPreviousRow = visible.some(item =>
                    item.day === dayIndex && item.start < period.start && item.end > period.start
                  );
                  if (coveredByPreviousRow) return null;
                  if (!classItem) return <td className="pdf-empty-cell" key={day}></td>;
                  return <td className="pdf-course-cell" rowSpan={Math.max(1, Math.round(classItem.end - classItem.start))} key={day}>
                    <div className="pdf-course-cell-inner">
                      <button className={`pdf-course-card ${classItem.color}`} onClick={() => setSelected(selected?.id === classItem.id ? null : classItem.id)}>
                        <b>{classItem.code}</b><span>{classItem.title}</span><small>{classItem.lecturer}</small><small>{classItem.room}</small>
                      </button>
                      {selected?.id === classItem.id && <button className="pdf-course-remove" onClick={() => handleRemove(classItem.id)}><X size={12}/> Remove</button>}
                    </div>
                  </td>;
                })}
              </tr>
          )}</tbody>
        </table>
      </div>
      <div className="pdf-table-caption">Year 2 · Semester II · Times and class lengths follow the supplied PDF. Select a class for actions.</div>
    </div>
    <div className="panel schedule-note"><div className="note-icon"><Sparkles size={18}/></div>
      <div><b>Scheduling tip</b><p>Always check lecturer availability and room capacity before publishing. Conflict checks run when you add or move a lecture in this demo.</p></div>
      <button className="text-action" onClick={() => notify('Publishing is a demo feature')}>Review before publishing <ArrowUpRight size={14}/></button>
    </div>
  </>;
}
