// Weekly calendar grid (days across, hours down) that places a LectureCard in each slot.
import React, { useState } from 'react';
import { days, times, fmt } from '../../utils/formatDate';
import LectureCard from './LectureCard';

export default function CalendarView({ lectures, selectedDay, onRemove }) {
  const [selectedId, setSelectedId] = useState(null);
  const shownDays = days.filter((d) => selectedDay === 'All days' || d === selectedDay);

  return (
    <div className="calendar-scroll">
      <div className="calendar-grid">
        <div className="time-head">GMT+5:30</div>
        {shownDays.map((d, i) => (
          <div className={`day-head ${d === 'Monday' ? 'current-day' : ''}`} key={d}>
            <span>{d.slice(0, 3).toUpperCase()}</span><b>{13 + i}</b>{d === 'Monday' && <small>Today</small>}
          </div>
        ))}
        {times.slice(0, 8).map((t) => (
          <React.Fragment key={t}>
            <div className="time-label">{fmt(t)}</div>
            {shownDays.map((d) => {
              const lecture = lectures.find((x) => x.day === days.indexOf(d) && x.start === t);
              return (
                <div className={`calendar-cell ${d === 'Monday' ? 'today-cell' : ''}`} key={`${t}-${d}`}>
                  {lecture && (
                    <LectureCard lecture={lecture} selected={selectedId === lecture.id} onSelect={setSelectedId} onRemove={onRemove} />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
