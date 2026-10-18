// Notification context: toast messages plus the notification list shown by the bell icon.
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const NotificationContext = createContext(null);

const INITIAL_NOTICES = [
  { id: 1, title: 'Room update', text: 'ICT 2202 moved to Lab 01.', time: '10 min ago', unread: true },
  { id: 2, title: 'Timetable published', text: 'Week 06 timetable is ready to view.', time: '1 hour ago', unread: true },
  { id: 3, title: 'Availability submitted', text: 'A lecturer updated availability.', time: 'Yesterday', unread: false },
];

export function NotificationProvider({ children }) {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [toast, setToast] = useState('');
  const timer = useRef(null);

  // Show a toast for 3 seconds.
  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(''), 3000);
  }, []);

  const markAllRead = () => setNotices((list) => list.map((n) => ({ ...n, unread: false })));
  const unreadCount = notices.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notices, unreadCount, notify, markAllRead }}>
      {children}
      {toast && (
        <div className="toast"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')}><X size={15} /></button></div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
};
