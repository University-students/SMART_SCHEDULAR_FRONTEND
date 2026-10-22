import React from 'react';
export default function AlertWidget({ title = 'Alerts', message = '' }) {
  return <section aria-label={title}><strong>{title}</strong>{message && <p>{message}</p>}</section>;
}
