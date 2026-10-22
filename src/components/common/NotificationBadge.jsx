import React from 'react';

export default function NotificationBadge({ count = 0, children }) {
  return <span className="notification-badge-wrap">{children}<span className="notification-badge">{count}</span></span>;
}
