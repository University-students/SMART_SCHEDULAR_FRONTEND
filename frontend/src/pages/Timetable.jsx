import React, { useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Search, Trash2 } from 'lucide-react';
import { days, fmt } from '../data';
import '../calendar.css';
import '../print.css';

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(year, month - 1, day, 12));
}

export function Timetable({
  classes,
  onRemove,
  canManage = true,
  batches = [],
  batchFilter,
  setBatchFilter,
  periods = [],
  onDeletePeriod,
  openAdd,
  conflicts = [],
  setConflicts,
}) {
  const [search, setSearch] = useState('');
  const visible = useMemo(() => classes
    .filter(lecture => batchFilter === 'All batches' || lecture.batch === batchFilter)
    .filter(lecture => `${lecture.title} ${lecture.code} ${lecture.lecturer} ${lecture.room}`.toLowerCase().includes(search.toLowerCase()))
    .sort((left, right) => left.day - right.day || left.start - right.start || left.code.localeCompare(right.code)),
  [batchFilter, classes, search]);
  const visiblePeriods = [...periods].sort((left, right) => left.startDate.localeCompare(right.startDate));

  return <div className="timetable-printable">
    <h1 className="print-title">UniSchedule weekly timetable</h1>
    <div className="panel agenda-toolbar">
      <label className="searchbox compact">
        <Search size={15} />
        <input aria-label="Search lectures" placeholder="Search subject, code, lecturer or room..." value={search} onChange={event => setSearch(event.target.value)} />
      </label>
      <select className="select-control" aria-label="Filter by batch" value={batchFilter} onChange={event => setBatchFilter(event.target.value)}>
        <option>All batches</option>
        {[...new Set([...batches.map(batch => batch.name), ...classes.map(lecture => lecture.batch).filter(Boolean)])]
          .map(name => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>

    {conflicts.length > 0 && (
      <div className="inline-alert">
        <AlertTriangle size={17} />
        <div><b>Conflict check</b><p>{conflicts.join(' ')}</p></div>
        <button className="icon-btn" onClick={() => setConflicts([])}>×</button>
      </div>
    )}

    <section className="agenda-section">
      <div className="agenda-section-heading">
        <div><h2>Weekly timetable</h2><p>{visible.length} recurring {visible.length === 1 ? 'lecture' : 'lectures'} · times repeat every week</p></div>
      </div>
      {!visible.length
        ? <div className="panel agenda-empty"><CalendarDays size={20} /><span>No lectures match this search and batch filter.</span></div>
        : <div className="panel timetable-table-wrap">
          <table className="timetable-table">
            <thead><tr><th>Day</th><th>Time</th><th>Course code</th><th>Subject</th><th>Lecturer</th><th>Room</th><th>Batch</th>{canManage && <th>Action</th>}</tr></thead>
            <tbody>{visible.map(lecture => (
              <tr key={lecture.id}>
                <td><span className="timetable-day">{days[lecture.day]}</span></td>
                <td className="timetable-time">{fmt(lecture.start)} – {fmt(lecture.end)}</td>
                <td><span className={`timetable-course-code ${lecture.color}`}>{lecture.code}</span></td>
                <td className="timetable-subject">{lecture.title}</td>
                <td>{lecture.lecturer}</td>
                <td>{lecture.room}</td>
                <td>{lecture.batch}</td>
                {canManage && <td><button className="icon-btn agenda-delete" aria-label={`Remove recurring ${lecture.code} from timetable`} title="Remove this recurring lecture from the timetable" onClick={() => onRemove(lecture.id)}><Trash2 size={15} /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>}
    </section>

    <section className="agenda-section leave-section">
      <div className="agenda-section-heading">
        <div><h2>Vacations &amp; study leave</h2><p>Shared date ranges; scheduled lectures are not removed.</p></div>
        {canManage && <button className="btn btn-secondary" onClick={() => openAdd('period')}>Add leave period</button>}
      </div>
      {!visiblePeriods.length
        ? <div className="panel agenda-empty"><CalendarDays size={20} /><span>No vacation or study-leave periods have been added.</span></div>
        : <div className="leave-list">{visiblePeriods.map(period => (
          <article className={`panel leave-card ${period.type === 'Vacation' ? 'vacation' : 'study-leave'}`} key={period.id}>
            <div><span className="leave-type">{period.type}</span><h3>{period.title}</h3><p>{formatDate(period.startDate)} – {formatDate(period.endDate)}</p>{period.description && <p>{period.description}</p>}</div>
            {canManage && <button className="icon-btn" aria-label={`Delete ${period.title}`} onClick={() => onDeletePeriod(period.id)}><Trash2 size={16} /></button>}
          </article>
        ))}</div>}
    </section>
  </div>;
}
