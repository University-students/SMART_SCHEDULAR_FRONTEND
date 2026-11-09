import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard, CalendarDays, BookOpen, Users, DoorOpen, Bell, Settings,
  Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Clock3, MapPin,
  GraduationCap, Menu, X, Sparkles, Printer, CheckCircle2, AlertTriangle,
  SlidersHorizontal, CalendarCheck, UserRound, BarChart3, LogOut, Zap,
  CircleHelp, MoreHorizontal, ArrowUpRight, Filter, Check, XCircle
} from 'lucide-react';
import { days, fmt, timeInputToHour, timeInputValue } from './data';
import { findScheduleConflicts } from './utils/scheduling';
import { apiRequest } from './services/api';
import { getCurrentUser, signOut } from './services/authService';
import { getLectures, saveLectures } from './services/lectureService';
import { Dashboard, Timetable, Courses, Lecturers, Rooms, Batches, Availability, Analytics, SettingsPage, Announcements, HelpCenter } from './pages';
import { Modal } from './components/Modal';
import './styles.css';
import { Login } from './components/Login';

const navGroups = [
  { label: 'WORKSPACE', items: [{ id: 'Dashboard', icon: LayoutDashboard }, { id: 'Timetable', icon: CalendarDays }, { id: 'Courses', icon: BookOpen }, { id: 'Announcements', icon: Bell }] },
  { label: 'MANAGEMENT', items: [{ id: 'Lecturers', icon: Users }, { id: 'Rooms', icon: DoorOpen }, { id: 'Batches', icon: GraduationCap }] },
  { label: 'SYSTEM', items: [{ id: 'Availability', icon: CalendarCheck }, { id: 'Analytics', icon: BarChart3 }, { id: 'Settings', icon: Settings }] },
];

// Main application shell: manages login state, navigation, demo data, and page routing.
function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const authenticated = Boolean(session);
  const [page, setPage] = useState('Dashboard');
  const [role, setRole] = useState('Student');
  const [classes, setClasses] = useState([]);
  const [people, setPeople] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [availabilityRecords, setAvailabilityRecords] = useState([]);
  const [calendarPeriods, setCalendarPeriods] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('ICT 22');
  const [toast, setToast] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('class');
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const [form, setForm] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const toastTimer = useRef(null);
  const filteredCourses = useMemo(() => courseList.filter(c => `${c.code} ${c.title} ${c.lecturer}`.toLowerCase().includes(query.toLowerCase())), [courseList, query]);
  const notify = (msg, duration = 3000) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(''), duration);
  };
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (!notificationsOpen) return undefined;
    const handlePointerDown = event => {
      if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false);
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);
  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then(data => {
        if (active) {
          setSession(data);
          setRole(data.role);
        }
      })
      .catch(error => {
        if (active && error.status !== 401) setAuthError(`${error.message} Check that the backend is running.`);
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    Promise.all([
      getLectures(),
      apiRequest('/courses'),
      apiRequest('/lecturers'),
      apiRequest('/rooms'),
      apiRequest('/batches'),
      apiRequest('/availability'),
      apiRequest('/calendar-periods'),
      apiRequest('/announcements'),
    ]).then(([classResult, courseResult, lecturerResult, roomResult, batchResult, availabilityResult, periodResult, announcementResult]) => {
      if (!active) return;
      setClasses(classResult);
      setCourseList(courseResult.data);
      setPeople(lecturerResult.data);
      setRooms(roomResult.data);
      setBatches(batchResult.data);
      setAvailabilityRecords(availabilityResult.data);
      setCalendarPeriods(periodResult.data);
      setAnnouncements(announcementResult.data);
    }).catch(error => {
      if (active) reportApiError(error);
    });
    return () => { active = false; };
  }, [session]);
  useEffect(() => {
    if (!session || !['Timetable', 'Announcements'].includes(page)) return undefined;
    let active = true;
    const request = page === 'Announcements'
      ? apiRequest('/announcements').then(result => {
        if (active) setAnnouncements(result.data);
      })
      : apiRequest('/calendar-periods').then(result => {
        if (active) setCalendarPeriods(result.data);
      });
    request.catch(error => {
      if (active) reportApiError(error);
    });
    return () => { active = false; };
  }, [page, session]);
  const reportApiError = error => {
    notify(error.message);
    if (error.status === 401) setSession(null);
  };
  const emailNotificationMessage = meta => {
    const notification = meta?.emailNotifications;
    if (!notification) return '';
    if (!notification.enabled) return ' Email notifications are disabled; configure SMTP to notify students.';
    if (notification.error) return ' Email notifications could not be sent; check the backend logs.';
    if (notification.failed) return ` Email sent to ${notification.sent} of ${notification.recipients} students; delivery failed for ${notification.failed}.`;
    if (!notification.recipients) return ' No active student accounts were found to notify.';
    return ` Email notification sent to ${notification.sent} student(s).`;
  };
  const addResource = async (path, payload, setItems) => {
    const { data, meta } = await apiRequest(`/${path}`, { method: 'POST', body: JSON.stringify(payload) });
    setItems(items => [...items, data]);
    return { data, meta };
  };
  const openAdd = type => { setModalType(type); setEditingLectureId(null); setForm({}); setShowModal(true); };
  const openEditLecture = lecture => {
    setEditingLectureId(lecture.id);
    setModalType('edit-class');
    setForm({
      ...lecture,
      day: String(lecture.day),
      start: timeInputValue(lecture.start),
      end: timeInputValue(lecture.end),
    });
    setShowModal(true);
  };
  const generateTimetable = async () => {
    const next = []; const unplaced = [];
    const slots = [];
    for (let day = 0; day < 5; day++) for (let start = 8; start <= 14; start += 2) slots.push({ day, start, end: start + 2 });
    courseList.forEach((course, idx) => {
      const room = course.room || rooms[0]?.code || 'LT 01';
      const lecturer = course.lecturer || 'Unassigned lecturer';
      const batch = course.batch || batches[0]?.name || 'ICT 22';
      const preferred = [...slots.slice(idx % slots.length), ...slots.slice(0, idx % slots.length)];
      const slot = preferred.find(t => findScheduleConflicts(next, { ...t, room, lecturer, batch }).length === 0);
      if (!slot) { unplaced.push(course.code); return; }
      next.push({ id: Date.now()+idx, ...slot, code: course.code, title: course.title, lecturer, room, batch, color: course.color || 'violet' });
    });
    try {
      const { lectures: savedLectures, meta } = await saveLectures(next);
      setClasses(savedLectures);
      setConflicts([]);
      if (unplaced.length) notify(`Draft created with ${unplaced.length} unscheduled course(s): ${unplaced.join(', ')}. Add more time slots/rooms and try again.`);
      else notify(`Conflict-checked draft timetable generated. Review before publishing.${emailNotificationMessage(meta)}`);
    } catch (error) {
      reportApiError(error);
    }
  };
  const saveModal = async e => {
    e.preventDefault();
    if (modalType === 'class' || modalType === 'edit-class') {
      const editing = modalType === 'edit-class';
      const c = { id: editing ? editingLectureId : Date.now(), day: Number(form.day ?? 0), start: timeInputToHour(form.start || '08:00'), end: timeInputToHour(form.end || '10:00'), code: form.code || 'ICT 2299', title: form.title || 'New lecture', lecturer: form.lecturer || 'Unassigned lecturer', room: form.room || 'LT 01', batch: form.batch || (batchFilter === 'All batches' ? batches[0]?.name || 'ICT 22' : batchFilter), color: form.color || 'violet' };
      if (!Number.isInteger(c.day) || c.day < 0 || c.day >= days.length || !Number.isFinite(c.start) || !Number.isFinite(c.end) || c.start >= c.end) {
        notify('Choose a valid day and an end time after the start time.');
        return;
      }
      const found = findScheduleConflicts(classes, c);
      if (found.length) { setConflicts(found.map(x => `Conflict with ${x.code} (${days[x.day]}, ${fmt(x.start)}) — same room, lecturer, or batch.`)); return; }
      try {
        const { id, ...lecture } = c;
        if (editing) {
          const { data } = await apiRequest(`/classes/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: JSON.stringify(lecture),
          });
          setClasses(items => items.map(item => item.id === id ? data : item));
          notify('Lecture updated successfully');
        } else {
          const { meta } = await addResource('classes', lecture, setClasses);
          notify(`Lecture successfully added.${emailNotificationMessage(meta)}`, 5000);
        }
        setShowModal(false);
        setEditingLectureId(null);
      } catch (error) {
        if (error.code === 'SCHEDULE_CONFLICT') setConflicts([error.message]);
        else reportApiError(error);
      }
    } else if (modalType === 'course') {
      if (courseList.some(c => c.code.toLowerCase() === (form.code || '').trim().toLowerCase())) { notify('A course with this code already exists. Please use a unique course code.'); return; }
      try {
        await addResource('courses', { code: (form.code || 'ICT 2299').trim(), title: form.title || 'New course', lecturer: form.lecturer || 'Unassigned lecturer', room: form.room || (rooms[0]?.code || 'LT 01'), batch: form.batch || (batches[0]?.name || 'ICT 22'), students: Number(form.students || batches.find(b=>b.name===(form.batch||'ICT 22'))?.students || 40), hours: `${Number(form.hours || 2)} hrs`, color: 'violet' }, setCourseList);
        notify('Course added and saved'); setShowModal(false);
      } catch (error) { reportApiError(error); }
    } else if (modalType === 'lecturer') {
      try {
        await addResource('lecturers', { name: form.name || 'New Lecturer', role: form.role || 'Lecturer', area: form.area || 'General', hours: Number(form.hours || 0), status: 'Available', initials: (form.name || 'NL').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() }, setPeople);
        notify('Lecturer added successfully'); setShowModal(false);
      } catch (error) { reportApiError(error); }
    } else if (modalType === 'room') {
      try {
        await addResource('rooms', { name: form.name || 'New Room', code: form.code || 'LT 04', type: form.type || 'Lecture theatre', capacity: Number(form.capacity || 60), building: form.building || 'Technology Block', status: 'Available' }, setRooms);
        notify('Room added successfully'); setShowModal(false);
      } catch (error) { reportApiError(error); }
    } else if (modalType === 'batch') {
      try {
        await addResource('batches', { name: form.name || 'ICT 24', year: form.year || 'Year 1', students: Number(form.students || 40), semester: form.semester || 'Semester 2', courses: Number(form.courses || 5) }, setBatches);
        notify('Batch added successfully'); setShowModal(false);
      } catch (error) { reportApiError(error); }
    } else if (modalType === 'period') {
      try {
        const { data } = await apiRequest('/calendar-periods', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title,
            type: form.type || 'Vacation',
            startDate: form.startDate,
            endDate: form.endDate,
            description: form.description || '',
          }),
        });
        setCalendarPeriods(items => [...items, data].sort((left, right) => left.startDate.localeCompare(right.startDate)));
        notify(`${data.type} added to the calendar`);
        setShowModal(false);
      } catch (error) { reportApiError(error); }
    } else if (modalType === 'announcement') {
      try {
        const { data } = await apiRequest('/announcements', {
          method: 'POST',
          body: JSON.stringify({ title: form.title, message: form.message }),
        });
        setAnnouncements(items => [data, ...items]);
        notify('Announcement posted for all users');
        setShowModal(false);
      } catch (error) { reportApiError(error); }
    }
  };
  const saveAvailability = async (lecturer, selectedDays) => {
    try {
      const { data } = await apiRequest(`/availability/${encodeURIComponent(lecturer)}`, {
        method: 'PUT',
        body: JSON.stringify({ days: selectedDays }),
      });
      setAvailabilityRecords(records => [...records.filter(record => record.lecturer !== lecturer), data]);
      notify(`Availability saved for ${lecturer}`);
    } catch (error) { reportApiError(error); }
  };
  const removeLecture = async id => {
    try {
      await apiRequest(`/classes/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setClasses(items => items.filter(lecture => lecture.id !== id));
      notify('Lecture removed from this timetable');
    } catch (error) { reportApiError(error); }
  };
  const clearTimetable = async () => {
    try {
      const { data } = await apiRequest('/schedule', { method: 'DELETE' });
      setClasses([]);
      notify(`${data.deletedCount} timetable ${data.deletedCount === 1 ? 'lecture' : 'lectures'} cleared`);
      return true;
    } catch (error) {
      reportApiError(error);
      return false;
    }
  };
  const removeCalendarPeriod = async id => {
    try {
      await apiRequest(`/calendar-periods/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setCalendarPeriods(items => items.filter(period => period.id !== id));
      notify('Calendar period removed');
    } catch (error) { reportApiError(error); }
  };
  const removeAnnouncement = async id => {
    try {
      await apiRequest(`/announcements/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setAnnouncements(items => items.filter(announcement => announcement.id !== id));
      notify('Announcement removed');
    } catch (error) { reportApiError(error); }
  };
  const handleLogin = user => {
    setAuthError('');
    setRole(user.role);
    setSession(user);
  };
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      reportApiError(error);
    } finally {
      setSession(null);
      setClasses([]);
      setPeople([]);
      setRooms([]);
      setBatches([]);
      setCourseList([]);
      setAvailabilityRecords([]);
      setCalendarPeriods([]);
      setAnnouncements([]);
      setPage('Dashboard');
    }
  };
  const profileName = session?.name || 'Admin Demo';
  const profileInitials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'AD';
  const canManage = role === 'Administrator' || role === 'Head of Department';
  const menu = <><div className="brand"><div className="brand-mark"><CalendarDays size={23}/></div><div><div className="brand-name">Uni<span>Schedule</span></div><div className="brand-sub">SMART ACADEMIC PLANNER</div></div><button className="icon-btn sidebar-close" onClick={()=>setSidebarOpen(false)}><X size={18}/></button></div>
    <div className="workspace-chip"><div className="university-mark"><GraduationCap size={19}/></div><div className="workspace-text"><b>Faculty of Technology</b><small>South Eastern University</small></div><ChevronDown size={15}/></div>
    <nav>{navGroups.map(group=><div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>{setPage(item.id);setSidebarOpen(false)}}><Icon size={18}/><span>{item.id}</span></button>})}</div>)}</nav>
    <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Get help with timetable planning and system tools.</p><button onClick={()=>{setPage('Help Center');setSidebarOpen(false)}}>Visit help centre <ArrowUpRight size={14}/></button></div><div className="profile"><div className="avatar admin-avatar">{profileInitials}</div><div className="profile-info"><b>{profileName}</b><small>{role}</small></div><button className="icon-btn" title="Log out" onClick={handleLogout}><LogOut size={17}/></button></div></div></>;
  if (!authReady) return <main className="login-page"><section className="login-form-panel"><p className="login-welcome">Connecting to the UniSchedule API…</p></section></main>;
  return !authenticated ? <Login onLogin={handleLogin} initialError={authError} /> : <div className="app-shell"><aside className={`sidebar ${sidebarOpen?'sidebar-open':''}`}>{menu}</aside>{sidebarOpen&&<div className="mobile-scrim" onClick={()=>setSidebarOpen(false)}></div>}
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div></div><div className="topbar-actions"><div className="semester-select"><span className="semester-dot"></span><span>Semester 2, 2026</span><ChevronDown size={15}/></div><div className="notification-wrap" ref={notificationRef}><button className="icon-btn notification-btn" aria-label="Announcements" aria-expanded={notificationsOpen} aria-haspopup="true" onClick={()=>setNotificationsOpen(open=>!open)}><Bell size={19}/>{announcements.length>0&&<i/>}</button>{notificationsOpen&&<div className="notification-pop" role="region" aria-label="Announcements"><div className="pop-head"><b>Announcements</b><button onClick={()=>{setPage('Announcements');setNotificationsOpen(false)}}>View all</button></div>{announcements.length===0?<p className="notice-empty">No announcements</p>:announcements.slice(0,5).map(item=><div className="notice" key={item.id}><span className="notice-dot"></span><div><b>{item.title}</b><p>{item.message}</p><small>{item.createdBy} · {new Date(item.createdAt).toLocaleDateString()}</small></div></div>)}</div>}</div><div className="top-avatar">{profileInitials}</div></div></header>
    <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><Sparkles size={14}/> SMART SCHEDULING WORKSPACE</div><h1>{page==='Dashboard'?`Good evening, ${profileName.split(/\s+/)[0]}`:page}</h1><p>{page==='Dashboard'?'Here’s what’s happening with your academic schedule today.':page==='Timetable'?'View recurring classes in a searchable weekly table.':page==='Announcements'?'Important updates shared with everyone.':page==='Help Center'?'Learn about the project features and how to use them.':`Manage your department’s ${page.toLowerCase()} in one place.`}</p></div><div className="heading-actions">{page==='Timetable'&&<button className="btn btn-secondary" onClick={()=>window.print()}><Printer size={16}/> Export PDF</button>}{canManage&&(page==='Timetable'||page==='Announcements')&&<button className="btn btn-primary" onClick={()=>openAdd(page==='Timetable'?'class':'announcement')}><Plus size={17}/>{page==='Timetable'?'Add lecture':'Post announcement'}</button>}{canManage&&!['Timetable','Announcements','Help Center'].includes(page)&&<button className="btn btn-primary" onClick={()=>openAdd(page==='Courses'?'course':page==='Lecturers'?'lecturer':page==='Rooms'?'room':page==='Batches'?'batch':'class')}><Plus size={17}/> {`Add ${page==='Dashboard'?'new item':page.slice(0,-1).toLowerCase()}`}</button>}</div></div>
    {page==='Dashboard'&&<Dashboard classes={classes} people={people} rooms={rooms} batches={batches} courseList={courseList} setPage={setPage} openAdd={openAdd} generate={generateTimetable} notify={notify} canManage={canManage}/>} 
    {page==='Timetable'&&<Timetable classes={classes} onRemove={removeLecture} onEdit={openEditLecture} onClearAll={clearTimetable} canManage={canManage} batches={batches} batchFilter={batchFilter} setBatchFilter={setBatchFilter} periods={calendarPeriods} onDeletePeriod={removeCalendarPeriod} openAdd={openAdd} conflicts={conflicts} setConflicts={setConflicts}/>}
    {page==='Announcements'&&<Announcements items={announcements} canManage={canManage} onDelete={removeAnnouncement}/>}
    {page==='Help Center'&&<HelpCenter setPage={setPage}/>}
    {page==='Courses'&&<Courses query={query} setQuery={setQuery} filteredCourses={filteredCourses} openAdd={openAdd} canManage={canManage}/>}
    {page==='Lecturers'&&<Lecturers people={people} query={query} setQuery={setQuery} openAdd={openAdd} notify={notify}/>}
    {page==='Rooms'&&<Rooms rooms={rooms} query={query} setQuery={setQuery} openAdd={openAdd}/>}
    {page==='Batches'&&<Batches batches={batches} openAdd={openAdd} setPage={setPage} setBatchFilter={setBatchFilter} classes={classes} canManage={canManage}/>}
    {page==='Availability'&&<Availability people={people} records={availabilityRecords} onSave={saveAvailability} canSubmit={canManage||role==='Lecturer'} currentLecturer={role==='Lecturer'?session.name:''}/>}
    {page==='Analytics'&&<Analytics classes={classes} people={people} rooms={rooms}/>}
    {page==='Settings'&&<SettingsPage role={role} notify={notify} user={session} batches={batches} onUserUpdate={setSession}/>}
    <footer className="footer"><span>© 2026 UniSchedule <span className="footer-sep">•</span> Smart academic planning</span><span><span className="status-dot"></span> API connected <span className="footer-sep">•</span> MongoDB</span></footer></div></main>
    {showModal&&<Modal type={modalType} form={form} setForm={setForm} batches={batches} initialBatch={batchFilter} onClose={()=>{setShowModal(false);setEditingLectureId(null);setConflicts([])}} onSubmit={saveModal}/>}
    {conflicts.length>0&&<div className="modal-backdrop"><div className="modal conflict-modal"><div className="modal-top"><div className="modal-icon danger"><AlertTriangle size={20}/></div><button className="icon-btn" onClick={()=>setConflicts([])}><X size={18}/></button></div><h2>Schedule conflict detected</h2><p>This lecture overlaps with an existing room, lecturer, or batch booking. Please choose a different time or resource.</p><div className="conflict-list">{conflicts.map((c,i)=><div key={i}><AlertTriangle size={15}/>{c}</div>)}</div><button className="btn btn-primary full-btn" onClick={()=>setConflicts([])}>Review and edit</button></div></div>}
    {toast&&<div className="toast" role="status" aria-live="polite"><CheckCircle2 size={18}/>{toast}<button aria-label="Dismiss notification" onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>;
}

export default App;
