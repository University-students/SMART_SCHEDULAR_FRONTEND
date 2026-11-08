import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import Dashboard from './pages/Dashboard'
import TimetablePage from './pages/TimetablePage'
import ProgressPage from './pages/ProgressPage'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
