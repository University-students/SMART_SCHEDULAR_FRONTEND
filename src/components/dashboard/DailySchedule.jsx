// "Upcoming lectures" panel: today's first lectures (the demo week starts on Monday).
import React from 'react';
import { ArrowUpRight, ChevronRight, MapPin, MoreHorizontal } from 'lucide-react';
import { fmt } from '../../utils/formatDate';

export default function DailySchedule({ classes, onViewTimetable, onSelect }) {
  const today = classes.filter((c) => c.day === 0).slice(0, 4);
  return (
    <section className="panel schedule-panel">
      <div className="panel-head">
        <div><h3>Upcoming lectures</h3><p>Your next scheduled classes</p></div>
        <button className="text-action" onClick={onViewTimetable}>Full timetable <ArrowUpRight size={15} /></button>
      </div>
      <div className="upcoming-list">
        {today.map((c) => (
          <div className="upcoming-row" key={c.id}>
            <div className="upcoming-time"><b>{fmt(c.start)}</b><small>{fmt(c.end)}</small></div>
            <div className={`class-color ${c.color}`}></div>
            <div className="upcoming-info"><b>{c.title}</b><span>{c.code} <i>•</i> {c.lecturer}</span></div>
            <div className="upcoming-room"><MapPin size={13} />{c.room}</div>
            <button className="icon-btn tiny" onClick={() => onSelect(c)}><MoreHorizontal size={17} /></button>
          </div>
        ))}
      </div>
      <button className="bottom-link" onClick={onViewTimetable}>View all lectures <ChevronRight size={16} /></button>
    </section>
  );
}
