// Left navigation: brand, workspace chip, page links, help card and the signed-in profile.
import React from 'react';
import { ArrowUpRight, BarChart3, CalendarDays, ChevronDown, CircleHelp, GraduationCap, LayoutDashboard, LogOut, X } from 'lucide-react';

const navGroups = [
  { label: 'WORKSPACE', items: [{ id: 'Dashboard', icon: LayoutDashboard }, { id: 'Timetable', icon: CalendarDays }] },
  { label: 'INSIGHTS', items: [{ id: 'Progress', icon: BarChart3 }] },
];

export default function Sidebar({ page, onNavigate, open, onClose, user, initials, onLogout, onHelp }) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><CalendarDays size={23} /></div>
          <div><div className="brand-name">Uni<span>Schedule</span></div><div className="brand-sub">SMART ACADEMIC PLANNER</div></div>
          <button className="icon-btn sidebar-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="workspace-chip">
          <div className="university-mark"><GraduationCap size={19} /></div>
          <div className="workspace-text"><b>Faculty of Technology</b><small>South Eastern University</small></div>
          <ChevronDown size={15} />
        </div>
        <nav>
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map(({ id, icon: Icon }) => (
                <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => { onNavigate(id); onClose(); }}>
                  <Icon size={18} /><span>{id}</span>{id === 'Timetable' && <span className="nav-pill">W06</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <b>Need a hand?</b><p>Get help with timetable planning and system tools.</p>
            <button onClick={onHelp}>Visit help centre <ArrowUpRight size={14} /></button>
          </div>
          <div className="profile">
            <div className="avatar admin-avatar">{initials}</div>
            <div className="profile-info"><b>{user.name}</b><small>{user.role}</small></div>
            <button className="icon-btn" title="Log out" onClick={onLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      {open && <div className="mobile-scrim" onClick={onClose}></div>}
    </>
  );
}
