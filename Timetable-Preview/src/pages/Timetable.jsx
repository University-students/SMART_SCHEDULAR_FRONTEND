
import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  Search,
  Trash2,
  UserRound,
  AlertTriangle,
  Printer
} from 'lucide-react';

import { days, fmt } from '../data';
import '../calendar.css';
import '../print.css';

const START_HOUR = 8;
const END_HOUR = 18;
const SLOT_HEIGHT = 20;
const SLOTS_PER_HOUR = 4;
const GRID_HEIGHT = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR * SLOT_HEIGHT;

const colors = {
  violet: 'violet',
  blue: 'blue',
  mint: 'mint',
  orange: 'orange',
  pink: 'pink'
};

export function Timetable({
  classes = [],
  onRemove = () => {},
  canManage = false,
  batches = [],
  batchFilter = 'All batches',
  setBatchFilter = () => {},
  periods = [],
  onDeletePeriod = () => {},
  openAdd = () => {},
  conflicts = [],
  setConflicts = () => {}
}) {
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState('All days');

  const filteredClasses = useMemo(() => {
    return classes.filter(item => {
      const matchesBatch =
        batchFilter === 'All batches' ||
        item.batch === batchFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        `${item.code} ${item.subject} ${item.room} ${item.batch}`
          .toLowerCase()
          .includes(searchText);

      const matchesDay =
        selectedDay === 'All days' ||
        item.day === selectedDay;

      return matchesBatch && matchesSearch && matchesDay;
    });
  }, [classes, batchFilter, search, selectedDay]);

  const getPosition = (item) => {
    const top =
      (item.start - START_HOUR) *
      SLOTS_PER_HOUR *
      SLOT_HEIGHT;

    const height =
      (item.end - item.start) *
      SLOTS_PER_HOUR *
      SLOT_HEIGHT;

    return { top, height };
  };

  const totalClasses = filteredClasses.length;

  const totalHours = filteredClasses.reduce(
    (total, item) => total + (item.end - item.start),
    0
  );

  return (
    <div className="timetable-page">

      <header className="page-header">
        <div className="header-title">
          <div className="header-icon">
            <GraduationCap size={28} />
          </div>

          <div>
            <h1>Academic Timetable</h1>
            <p>Manage and view your weekly class schedule</p>
          </div>
        </div>

        <button
          className="print-button"
          onClick={() => window.print()}
        >
          <Printer size={17} />
          Print Timetable
        </button>
      </header>

      <section className="summary-grid">

        <div className="summary-card">
          <div className="summary-icon purple">
            <CalendarDays />
          </div>
          <div>
            <p>Total Classes</p>
            <h2>{totalClasses}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue">
            <Clock3 />
          </div>
          <div>
            <p>Total Hours</p>
            <h2>{totalHours} hrs</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <UserRound />
          </div>
          <div>
            <p>Active Batches</p>
            <h2>{batches.length}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <MapPin />
          </div>
          <div>
            <p>Working Days</p>
            <h2>{days.length}</h2>
          </div>
        </div>

      </section>

      <section className="filter-section">

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search subject, code or room..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </div>

        <select
          value={batchFilter}
          onChange={event => setBatchFilter(event.target.value)}
        >
          <option value="All batches">All batches</option>

          {batches.map((batch, index) => (
            <option key={index} value={batch.name}>
              {batch.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDay}
          onChange={event => setSelectedDay(event.target.value)}
        >
          <option value="All days">All days</option>

          {days.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        {canManage && (
          <button className="add-button" onClick={openAdd}>
            + Add Class
          </button>
        )}

      </section>

      {conflicts.length > 0 && (
        <div className="conflict-warning">
          <AlertTriangle size={20} />
          <span>
            Timetable conflict detected. Please check overlapping classes.
          </span>
          <button onClick={() => setConflicts([])}>
            Dismiss
          </button>
        </div>
      )}

      <section className="timetable-container">

        <div className="timetable-heading">
          <div>
            <h2>Weekly Schedule</h2>
            <p>Monday – Friday · 08:00 – 18:00</p>
          </div>

          <span className="class-count">
            {totalClasses} classes
          </span>
        </div>

        <div className="timetable-scroll">

          <div
            className="timetable-grid"
            style={{ minWidth: '850px' }}
          >

            <div className="time-column">

              <div className="day-heading time-heading">
                Time
              </div>

              <div className="time-slots">
                {Array.from(
                  { length: END_HOUR - START_HOUR + 1 },
                  (_, index) => (
                    <div
                      className="time-label"
                      key={index}
                      style={{
                        top: index * 4 * SLOT_HEIGHT - 9
                      }}
                    >
                      {fmt(START_HOUR + index)}
                    </div>
                  )
                )}
              </div>

            </div>

            {days.map(day => (

              <div className="day-column" key={day}>

                <div className="day-heading">
                  {day}
                </div>

                <div
                  className="day-content"
                  style={{ height: GRID_HEIGHT }}
                >

                  {Array.from(
                    { length: (END_HOUR - START_HOUR) * 4 },
                    (_, index) => (
                      <div
                        key={index}
                        className={
                          index % 4 === 0
                            ? 'grid-line hour-line'
                            : 'grid-line'
                        }
                        style={{
                          top: index * SLOT_HEIGHT
                        }}
                      />
                    )
                  )}

                  {filteredClasses
                    .filter(item => item.day === day)
                    .map(item => {
                      const position = getPosition(item);

                      return (
                        <div
                          key={item.id}
                          className={`class-card ${colors[item.color] || 'blue'}`}
                          style={{
                            top: position.top,
                            height: position.height
                          }}
                        >

                          <div className="class-card-content">
                            <strong>{item.code}</strong>

                            <span className="class-subject">
                              {item.subject}
                            </span>

                            <span>
                              <Clock3 size={12} />
                              {fmt(item.start)} – {fmt(item.end)}
                            </span>

                            <span>
                              <MapPin size={12} />
                              {item.room}
                            </span>

                            <span>
                              <UserRound size={12} />
                              {item.batch}
                            </span>
                          </div>

                          {canManage && (
                            <button
                              className="delete-class"
                              title="Remove class"
                              onClick={() => onRemove(item.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                        </div>
                      );
                    })}

                </div>
              </div>

            ))}

          </div>
        </div>

        <div className="timetable-legend">
          <span><i className="legend-dot violet" /> Web Development</span>
          <span><i className="legend-dot blue" /> Data Structures</span>
          <span><i className="legend-dot mint" /> Networks / HCI</span>
          <span><i className="legend-dot orange" /> Database</span>
          <span><i className="legend-dot pink" /> Software Engineering</span>
        </div>

      </section>

      {periods.length > 0 && (
        <section className="period-section">
          <h2>Academic Periods</h2>

          {periods.map((period, index) => (
            <div className="period-item" key={period.id || index}>
              <div>
                <strong>{period.name}</strong>
                <p>
                  {period.startDate} – {period.endDate}
                </p>
              </div>

              {canManage && (
                <button
                  onClick={() => onDeletePeriod(period.id)}
                  title="Delete period"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </section>
      )}

    </div>
  );
}
