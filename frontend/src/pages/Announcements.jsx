import React from 'react';
import { Megaphone, Trash2 } from 'lucide-react';

function formatCreatedAt(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function Announcements({ items, canManage, onDelete }) {
  return <section className="announcements-list">
    {!items.length && <div className="panel agenda-empty"><Megaphone size={20} /><span>No announcements have been posted.</span></div>}
    {items.map(item => (
      <article className="panel announcement-card" key={item.id}>
        <div className="announcement-icon"><Megaphone size={19} /></div>
        <div className="announcement-content">
          <div className="announcement-meta"><span>IMPORTANT ANNOUNCEMENT</span><time dateTime={item.createdAt}>{formatCreatedAt(item.createdAt)}</time></div>
          <h2>{item.title}</h2>
          <p>{item.message}</p>
          <small>Posted by {item.createdBy}</small>
        </div>
        {canManage && <button className="icon-btn" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}><Trash2 size={16} /></button>}
      </article>
    ))}
  </section>;
}
