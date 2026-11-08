import { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'

const NotificationBadge = () => {
  const { notifications, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open)
          if (!open) markAllRead()
        }}
        className="relative p-1"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b font-semibold">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-3 border-b text-sm">
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBadge
