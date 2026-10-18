// Application shell: shows Login or the workspace (Sidebar + Navbar + current page).
// Navigation is simple state (no router) and lecture data is loaded/saved through lectureService.
import React, { useState } from 'react';
import { Download, Plus, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useNotifications } from './context/NotificationContext';
import {
  getClasses, saveClasses, getCourses, getPeople, getRooms, getBatches,
  findConflicts, buildLecture, generateTimetable, getScheduleStats, downloadTimetableCSV,
} from './services/lectureService';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Button from './components/common/Button';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TimetablePage from './pages/TimetablePage';
import ProgressPage from './pages/ProgressPage';

const pageText = {
  Dashboard: 'Here’s what’s happening with your academic schedule today.',
  Timetable: 'Plan, review and manage your weekly lecture schedule.',
  Progress: 'Track room usage, teaching workload and lecture distribution.',
};

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notify } = useNotifications();

  const [page, setPage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClassesState] = useState(getClasses);
  const [batchFilter, setBatchFilter] = useState('ICT 22');
  const [selectedDay, setSelectedDay] = useState('All days');
  const [addOpen, setAddOpen] = useState(false);

  // Reference data (read-only in this version).
  const [courses] = useState(getCourses);
  const [people] = useState(getPeople);
  const [rooms] = useState(getRooms);
  const [batches] = useState(getBatches);

  // Keep state and localStorage in sync.
  const setClasses = (list) => { setClassesState(list); saveClasses(list); };

  // Returns conflict messages; an empty array means the lecture was added.
  const addLecture = (form) => {
    const lecture = buildLecture(form, batchFilter === 'All batches' ? (batches[0]?.name || 'ICT 22') : batchFilter);
    const found = findConflicts(classes, lecture);
    if (found.length) return found;
    setClasses([...classes, lecture]);
    notify('Lecture added successfully');
    return [];
  };

  const removeLecture = (id) => { setClasses(classes.filter((c) => c.id !== id)); notify('Lecture removed from this demo timetable'); };

  const generate = () => {
    const { classes: next, unplaced } = generateTimetable(courses, rooms, batches);
    setClasses(next);
    if (unplaced.length) notify(`Draft created with ${unplaced.length} unscheduled course(s): ${unplaced.join(', ')}. Add more time slots/rooms and try again.`);
    else notify('Conflict-checked draft timetable generated. Review before publishing.');
  };

  const exportCSV = () => { downloadTimetableCSV(classes); notify('Timetable exported as CSV'); };
  const openAddLecture = () => { setPage('Timetable'); setAddOpen(true); };

  if (!isAuthenticated) return <Login />;

  const stats = getScheduleStats(classes, rooms);
  const initials = user.name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  const firstName = user.name.split(' ')[0];

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        user={user} initials={initials} onLogout={() => { logout(); setPage('Dashboard'); }} onHelp={() => notify('Help centre is a demo feature')} />
      <main className="main-area">
        <Navbar page={page} onMenuClick={() => setSidebarOpen(true)} initials={initials} />
        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> SMART SCHEDULING WORKSPACE</div>
              <h1>{page === 'Dashboard' ? `Welcome back, ${firstName}` : page}</h1>
              <p>{pageText[page]}</p>
            </div>
            <div className="heading-actions">
              <Button variant="secondary" icon={Download} onClick={exportCSV}>Export</Button>
              <Button icon={Plus} onClick={openAddLecture}>Add lecture</Button>
            </div>
          </div>

          {page === 'Dashboard' && <Dashboard classes={classes} courses={courses} people={people} stats={stats}
            onNavigate={setPage} onAddLecture={openAddLecture} onGenerate={generate} notify={notify} />}
          {page === 'Timetable' && <TimetablePage classes={classes} batches={batches} batchFilter={batchFilter} setBatchFilter={setBatchFilter}
            selectedDay={selectedDay} setSelectedDay={setSelectedDay} addOpen={addOpen} setAddOpen={setAddOpen}
            onAddLecture={addLecture} onRemoveLecture={removeLecture} onExport={exportCSV} notify={notify} />}
          {page === 'Progress' && <ProgressPage classes={classes} people={people} rooms={rooms} stats={stats} />}

          <footer className="footer">
            <span>© 2026 UniSchedule <span className="footer-sep">•</span> Smart academic planning</span>
            <span><span className="status-dot"></span> All systems operational <span className="footer-sep">•</span> Demo mode</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
