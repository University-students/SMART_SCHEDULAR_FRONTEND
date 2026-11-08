import React from 'react';
export default function UpcomingEvents({ events = [] }) {
  return <section aria-label="Upcoming events">{events.map((event, index) => <div key={event.id ?? index}>{event.title ?? String(event)}</div>)}</section>;
}
