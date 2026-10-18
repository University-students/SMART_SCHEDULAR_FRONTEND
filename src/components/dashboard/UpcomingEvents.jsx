// "Later this week" panel: the next lectures after today, with their day.
import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { days, fmt } from '../../utils/formatDate';

export default function UpcomingEvents({ classes, onViewTimetable }) {
  const later = classes.filter((c) => c.day > 0).slice(0, 3);
  return (
    <section className="panel mini-panel">
      <div className="panel-head">
        <div><h3>Later this week</h3><p>Lectures coming up after today</p></div>
        <button className="text-action" onClick={onViewTimetable}>View timetable <ArrowUpRight size={14} /></button>
      </div>
      <div className="upcoming-list">
        {later.length === 0 && <p>No more lectures scheduled this week.</p>}
        {later.map((c) => (
          <div className="upcoming-row" key={c.id}>
            <div className="upcoming-time"><b>{days[c.day].slice(0, 3)}</b><small>{fmt(c.start)}</small></div>
            <div className={`class-color ${c.color}`}></div>
            <div className="upcoming-info"><b>{c.title}</b><span>{c.code} <i>•</i> {c.lecturer}</span></div>
            <div className="upcoming-room"><MapPin size={13} />{c.room}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
