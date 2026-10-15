import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'CA 2 එකට තව දින 3ක්!', type: 'warning', read: false },
    { id: 2, message: 'කාලසටහන වෙනස් විය: CS101', type: 'info', read: false },
  ])

  const addNotification = (notification) => {
    setNotifications((prev) => [
      { id: Date.now(), read: false, ...notification },
      ...prev,
    ])
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
