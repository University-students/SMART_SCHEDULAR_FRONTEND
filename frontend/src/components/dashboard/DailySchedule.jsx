import React from 'react';
export default function DailySchedule({ items = [] }) {
  return <section aria-label="Daily schedule">{items.map((item, index) => <div key={item.id ?? index}>{item.title ?? item.code ?? String(item)}</div>)}</section>;
}
