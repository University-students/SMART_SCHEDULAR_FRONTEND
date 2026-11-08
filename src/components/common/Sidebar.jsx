import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg mb-1 ${
    isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
  }`

const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r hidden md:block p-4">
      <nav>
        <NavLink to="/" className={linkClass} end>
          📊 Dashboard
        </NavLink>
        <NavLink to="/timetable" className={linkClass}>
          📅 Timetable
        </NavLink>
        <NavLink to="/progress" className={linkClass}>
          📈 Progress
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
