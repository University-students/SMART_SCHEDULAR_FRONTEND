import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, CalendarDays, BookOpen, Users, DoorOpen, Bell, Settings,
  Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Clock3, MapPin,
  GraduationCap, Menu, X, Sparkles, Download, CheckCircle2, AlertTriangle,
  SlidersHorizontal, CalendarCheck, UserRound, BarChart3, LogOut, Zap,
  CircleHelp, MoreHorizontal, ArrowUpRight, Filter, Check, XCircle
} from 'lucide-react';
import { initialClasses, days, times, courses, initialPeople, initialRooms, initialBatches, fmt, loadSaved } from './data';
import { Dashboard, Timetable, Courses, Lecturers, Rooms, Batches, Availability, Analytics, SettingsPage } from './pages';
import { Modal } from './components/Modal';
import './styles.css';
import { Login } from './components/Login';

const navGroups = [
  { label: 'WORKSPACE', items: [{ id: 'Dashboard', icon: LayoutDashboard }, { id: 'Timetable', icon: CalendarDays }, { id: 'Courses', icon: BookOpen }] },
  { label: 'MANAGEMENT', items: [{ id: 'Lecturers', icon: Users }, { id: 'Rooms', icon: DoorOpen }, { id: 'Batches', icon: GraduationCap }] },
  { label: 'SYSTEM', items: [{ id: 'Availability', icon: CalendarCheck }, { id: 'Analytics', icon: BarChart3 }, { id: 'Settings', icon: Settings }] },
];

// Main application shell: manages login state, navigation, demo data, and page routing.
function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('unischedule:authenticated') === 'true');
  const [page, setPage] = useState('Dashboard');
  const [role, setRole] = useState('Administrator');
  const [classes, setClasses] = useState(() => loadSaved('classes', initialClasses));
  const [people, setPeople] = useState(() => loadSaved('people', initialPeople));
  const [rooms, setRooms] = useState(() => loadSaved('rooms', initialRooms));
  const [batches, setBatches] = useState(() => loadSaved('batches', initialBatches));
  const [courseList, setCourseList] = useState(() => loadSaved('courses', courses));
  useEffect(() => { localStorage.setItem('unischedule:classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('unischedule:people', JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem('unischedule:rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('unischedule:batches', JSON.stringify(batches)); }, [batches]);
  useEffect(() => { localStorage.setItem('unischedule:courses', JSON.stringify(courseList)); }, [courseList]);
  const [query, setQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('ICT 22');
  const [toast, setToast] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('class');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All days');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notices, setNotices] = useState([
    { id: 1, title: 'Room update', text: 'ICT 2202 moved to Lab 01.', time: '10 min ago', unread: true },
    { id: 2, title: 'Timetable published', text: 'Week 06 timetable is ready to view.', time: '1 hour ago', unread: true },
    { id: 3, title: 'Availability submitted', text: 'A lecturer updated availability.', time: 'Yesterday', unread: false },
  ]);
  const [form, setForm] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const filteredCourses = useMemo(() => courseList.filter(c => `${c.code} ${c.title} ${c.lecturer}`.toLowerCase().includes(query.toLowerCase())), [courseList, query]);
  const notify = msg => { setToast(msg); window.setTimeout(() => setToast(''), 3000); };
  const openAdd = type => { setModalType(type); setForm({}); setShowModal(true); };
  const exportCSV = () => {
    const header = 'Day,Start,End,Course,Title,Lecturer,Room,Batch';
    const rows = classes.map(c => `${days[c.day]},${fmt(c.start)},${fmt(c.end)},${c.code},"${c.title}",${c.lecturer},${c.room},${c.batch}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'unischedule-timetable.csv'; a.click(); URL.revokeObjectURL(url);
    notify('Timetable exported as CSV');
  };
  const generateTimetable = () => {
    const next = []; const unplaced = [];
    const slots = [];
    for (let day = 0; day < 5; day++) for (let start = 8; start <= 14; start += 2) slots.push({ day, start, end: start + 2 });
    courseList.forEach((course, idx) => {
      const room = course.room || rooms[0]?.code || 'LT 01';
      const lecturer = course.lecturer || 'Unassigned lecturer';
      const batch = course.batch || batches[0]?.name || 'ICT 22';
      const preferred = [...slots.slice(idx % slots.length), ...slots.slice(0, idx % slots.length)];
      const slot = preferred.find(t => !next.some(c => c.day === t.day && c.start < t.end && c.end > t.start && (c.room === room || (lecturer !== 'Unassigned lecturer' && c.lecturer === lecturer) || c.batch === batch)));
      if (!slot) { unplaced.push(course.code); return; }
      next.push({ id: Date.now()+idx, ...slot, code: course.code, title: course.title, lecturer, room, batch, color: course.color || 'violet' });
    });
    setClasses(next); setConflicts([]);
    if (unplaced.length) notify(`Draft created with ${unplaced.length} unscheduled course(s): ${unplaced.join(', ')}. Add more time slots/rooms and try again.`);
    else notify('Conflict-checked draft timetable generated. Review before publishing.');
  };
  const saveModal = e => {
    e.preventDefault();
    if (modalType === 'class') {
      const c = { id: Date.now(), day: Number(form.day ?? 0), start: Number(form.start ?? 8), end: Number(form.end ?? 10), code: form.code || 'ICT 2299', title: form.title || 'New lecture', lecturer: form.lecturer || 'Unassigned lecturer', room: form.room || 'LT 01', batch: form.batch || batchFilter, color: form.color || 'violet' };
      const found = classes.filter(x => x.day === c.day && x.start < c.end && x.end > c.start && (x.room === c.room || x.lecturer === c.lecturer || x.batch === c.batch));
      if (found.length) { setConflicts(found.map(x => `Conflict with ${x.code} (${days[x.day]}, ${fmt(x.start)}) — same room, lecturer, or batch.`)); return; }
      setClasses([...classes, c]); notify('Lecture added successfully'); setShowModal(false);
    } else if (modalType === 'course') {
      if (courseList.some(c => c.code.toLowerCase() === (form.code || '').trim().toLowerCase())) { setConflicts(['A course with this code already exists. Please use a unique course code.']); return; }
      setCourseList([...courseList, { code: (form.code || 'ICT 2299').trim(), title: form.title || 'New course', lecturer: form.lecturer || 'Unassigned lecturer', room: form.room || (rooms[0]?.code || 'LT 01'), batch: form.batch || (batches[0]?.name || 'ICT 22'), students: Number(form.students || batches.find(b=>b.name===(form.batch||'ICT 22'))?.students || 40), hours: `${Number(form.hours || 2)} hrs`, color: 'violet' }]);
      notify('Course added and saved'); setShowModal(false);
    } else if (modalType === 'lecturer') {
      setPeople([...people, { name: form.name || 'New Lecturer', role: form.role || 'Lecturer', area: form.area || 'General', hours: Number(form.hours || 0), status: 'Available', initials: (form.name || 'NL').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() }]);
      notify('Lecturer added successfully'); setShowModal(false);
    } else if (modalType === 'room') {
      setRooms([...rooms, { name: form.name || 'New Room', code: form.code || 'LT 04', type: form.type || 'Lecture theatre', capacity: Number(form.capacity || 60), building: form.building || 'Technology Block', status: 'Available' }]);
      notify('Room added successfully'); setShowModal(false);
    } else if (modalType === 'batch') {
      setBatches([...batches, { name: form.name || 'ICT 24', year: form.year || 'Year 1', students: Number(form.students || 40), semester: form.semester || 'Semester 2', courses: Number(form.courses || 5) }]);
      notify('Batch added successfully'); setShowModal(false);
    }
  };
  const markAllRead = () => setNotices(notices.map(n => ({ ...n, unread: false })));
  // Save demo login state in this browser. Use a backend for real authentication.
  const handleLogin = (user) => { localStorage.setItem('unischedule:authenticated', 'true'); localStorage.setItem('unischedule:user', JSON.stringify(user)); setRole(user.role); setAuthenticated(true); };
  // Clear the local demo session and return to the login page.
  const handleLogout = () => { localStorage.removeItem('unischedule:authenticated'); localStorage.removeItem('unischedule:user'); setAuthenticated(false); setPage('Dashboard'); };
  const menu = <><div className="brand"><div className="brand-mark"><CalendarDays size={23}/></div><div><div className="brand-name">Uni<span>Schedule</span></div><div className="brand-sub">SMART ACADEMIC PLANNER</div></div><button className="icon-btn sidebar-close" onClick={()=>setSidebarOpen(false)}><X size={18}/></button></div>
    <div className="workspace-chip"><div className="university-mark"><GraduationCap size={19}/></div><div className="workspace-text"><b>Faculty of Technology</b><small>South Eastern University</small></div><ChevronDown size={15}/></div>
    <nav>{navGroups.map(group=><div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>{setPage(item.id);setSidebarOpen(false)}}><Icon size={18}/><span>{item.id}</span>{item.id==='Timetable'&&<span className="nav-pill">W06</span>}</button>})}</div>)}</nav>
    <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Get help with timetable planning and system tools.</p><button onClick={()=>notify('Help centre is a demo feature')}>Visit help centre <ArrowUpRight size={14}/></button></div><div className="profile"><div className="avatar admin-avatar">AD</div><div className="profile-info"><b>{JSON.parse(localStorage.getItem('unischedule:user') || '{}').name || 'Admin Demo'}</b><small>{role}</small></div><button className="icon-btn" title="Log out" onClick={handleLogout}><LogOut size={17}/></button></div></div></>;
  return !authenticated ? <Login onLogin={handleLogin} /> : <div className="app-shell"><aside className={`sidebar ${sidebarOpen?'sidebar-open':''}`}>{menu}</aside>{sidebarOpen&&<div className="mobile-scrim" onClick={()=>setSidebarOpen(false)}></div>}
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div></div><div className="topbar-actions"><div className="semester-select"><span className="semester-dot"></span><span>Semester 2, 2026</span><ChevronDown size={15}/></div><div className="notification-wrap"><button className="icon-btn notification-btn" onClick={()=>setNotificationsOpen(!notificationsOpen)}><Bell size={19}/>{notices.some(n=>n.unread)&&<i/>}</button>{notificationsOpen&&<div className="notification-pop"><div className="pop-head"><b>Notifications</b><button onClick={markAllRead}>Mark all read</button></div>{notices.map(n=><div className={`notice ${n.unread?'unread':''}`} key={n.id}><span className="notice-dot"></span><div><b>{n.title}</b><p>{n.text}</p><small>{n.time}</small></div></div>)}</div>}</div><div className="top-avatar">AD</div></div></header>
    <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><Sparkles size={14}/> SMART SCHEDULING WORKSPACE</div><h1>{page==='Dashboard'?'Good evening, Admin':page}</h1><p>{page==='Dashboard'?'Here’s what’s happening with your academic schedule today.':page==='Timetable'?'Plan, review and manage your weekly lecture schedule.':`Manage your department’s ${page.toLowerCase()} in one place.`}</p></div><div className="heading-actions"><button className="btn btn-secondary" onClick={exportCSV}><Download size={16}/> Export</button><button className="btn btn-primary" onClick={()=>openAdd(page==='Timetable'?'class':page==='Courses'?'course':page==='Lecturers'?'lecturer':page==='Rooms'?'room':page==='Batches'?'batch':'class')}><Plus size={17}/> {page==='Timetable'?'Add lecture':`Add ${page==='Dashboard'?'new item':page.slice(0,-1).toLowerCase()}`}</button></div></div>
    {page==='Dashboard'&&<Dashboard classes={classes} people={people} rooms={rooms} batches={batches} courseList={courseList} setPage={setPage} openAdd={openAdd} generate={generateTimetable} exportCSV={exportCSV} notify={notify}/>} 
    {page==='Timetable'&&<Timetable classes={classes} setClasses={setClasses} batches={batches} batchFilter={batchFilter} setBatchFilter={setBatchFilter} selectedDay={selectedDay} setSelectedDay={setSelectedDay} openAdd={openAdd} exportCSV={exportCSV} conflicts={conflicts} setConflicts={setConflicts} notify={notify}/>}
    {page==='Courses'&&<Courses query={query} setQuery={setQuery} filteredCourses={filteredCourses} openAdd={openAdd}/>}
    {page==='Lecturers'&&<Lecturers people={people} query={query} setQuery={setQuery} openAdd={openAdd} notify={notify}/>}
    {page==='Rooms'&&<Rooms rooms={rooms} query={query} setQuery={setQuery} openAdd={openAdd}/>}
    {page==='Batches'&&<Batches batches={batches} openAdd={openAdd} setPage={setPage} setBatchFilter={setBatchFilter} classes={classes}/>}
    {page==='Availability'&&<Availability people={people} notify={notify}/>}
    {page==='Analytics'&&<Analytics classes={classes} people={people} rooms={rooms}/>}
    {page==='Settings'&&<SettingsPage role={role} setRole={setRole} notify={notify}/>}
    <footer className="footer"><span>© 2026 UniSchedule <span className="footer-sep">•</span> Smart academic planning</span><span><span className="status-dot"></span> All systems operational <span className="footer-sep">•</span> Demo mode</span></footer></div></main>
    {showModal&&<Modal type={modalType} form={form} setForm={setForm} onClose={()=>{setShowModal(false);setConflicts([])}} onSubmit={saveModal}/>}
    {conflicts.length>0&&<div className="modal-backdrop"><div className="modal conflict-modal"><div className="modal-top"><div className="modal-icon danger"><AlertTriangle size={20}/></div><button className="icon-btn" onClick={()=>setConflicts([])}><X size={18}/></button></div><h2>Schedule conflict detected</h2><p>This lecture overlaps with an existing room, lecturer, or batch booking. Please choose a different time or resource.</p><div className="conflict-list">{conflicts.map((c,i)=><div key={i}><AlertTriangle size={15}/>{c}</div>)}</div><button className="btn btn-primary full-btn" onClick={()=>setConflicts([])}>Review and edit</button></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>;
}

export default App;
