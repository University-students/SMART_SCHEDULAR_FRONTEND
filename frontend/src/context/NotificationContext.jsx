import React, { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const value = useMemo(() => ({
    notifications,
    addNotification: (notification) => setNotifications((items) => [...items, { id: Date.now(), ...notification }]),
    clearNotifications: () => setNotifications([]),
  }), [notifications]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
export default NotificationContext;
