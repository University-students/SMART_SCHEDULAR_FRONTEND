// Top bar: mobile menu button, breadcrumb, semester chip, notifications and avatar.
import React from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import NotificationBadge from './NotificationBadge';

export default function Navbar({ page, onMenuClick, initials }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn mobile-menu" onClick={onMenuClick} aria-label="Open menu"><Menu size={20} /></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div>
      </div>
      <div className="topbar-actions">
        <div className="semester-select"><span className="semester-dot"></span><span>Semester 2, 2026</span><ChevronDown size={15} /></div>
        <NotificationBadge />
        <div className="top-avatar">{initials}</div>
      </div>
    </header>
  );
}
