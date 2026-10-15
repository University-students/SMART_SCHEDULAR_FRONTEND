import { Link } from 'react-router-dom'
import NotificationBadge from './NotificationBadge'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold">
        🎓 Lecture Scheduler
      </Link>
      <div className="flex items-center gap-4">
        <NotificationBadge />
        <span className="hidden sm:inline">{user?.name || 'User'}</span>
        <button
          onClick={logout}
          className="bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
