// One lecture block inside the weekly calendar. Click to reveal the Remove action.
import React from 'react';
import { Clock3, MapPin, X } from 'lucide-react';
import { fmt } from '../../utils/formatDate';

export default function LectureCard({ lecture: c, selected, onSelect, onRemove }) {
  return (
    <button
      className={`calendar-event ${c.color}`}
      style={{ height: `${Math.max(52, (c.end - c.start) * 53 - 5)}px` }}
      onClick={() => onSelect(selected ? null : c.id)}
    >
      <b>{c.code}</b>
      <span>{c.title}</span>
      <small><Clock3 size={11} />{fmt(c.start)} – {fmt(c.end)}</small>
      <small><MapPin size={11} />{c.room}</small>
      {selected && (
        <span className="event-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onRemove(c.id)}><X size={12} /> Remove</button>
        </span>
      )}
    </button>
  );
}
