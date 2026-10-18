// Bell icon with an unread dot and a dropdown list of notifications.
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBadge() {
  const { notices, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-wrap">
      <button className="icon-btn notification-btn" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell size={19} />{unreadCount > 0 && <i />}
      </button>
      {open && (
        <div className="notification-pop">
          <div className="pop-head"><b>Notifications</b><button onClick={markAllRead}>Mark all read</button></div>
          {notices.map((n) => (
            <div className={`notice ${n.unread ? 'unread' : ''}`} key={n.id}>
              <span className="notice-dot"></span>
              <div><b>{n.title}</b><p>{n.text}</p><small>{n.time}</small></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
