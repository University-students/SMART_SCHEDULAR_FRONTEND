// Dashboard page: welcome banner, key statistics, today's schedule, schedule health and quick actions.
import React, { useState } from 'react';
import {
  ArrowUpRight, BookOpen, CalendarCheck, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight,
  DoorOpen, MoreHorizontal, Plus, Sparkles, Users, Zap
} from 'lucide-react';
import Button from '../components/common/Button';
import DailySchedule from '../components/dashboard/DailySchedule';
import AlertWidget from '../components/dashboard/AlertWidget';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';

// Reusable statistic card (also used by the Progress page).
export function StatCard({ title, value, change, icon: Icon, tone, foot }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <div className="stat-top"><span>{title}</span><button className="icon-btn tiny"><MoreHorizontal size={18} /></button></div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{change && <span className={change.startsWith('+') ? 'positive' : 'neutral'}>{change}</span>}<span>{foot}</span></div>
    </div>
  );
}

export default function Dashboard({ classes, courses, people, stats, onNavigate, onAddLecture, onGenerate, notify }) {
  const [filter, setFilter] = useState('This week');

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-kicker"><span className="banner-spark"><Sparkles size={13} /></span> YOUR DEPARTMENT AT A GLANCE</div>
          <h2>Plan smarter. Teach better.</h2>
          <p>One clear view of lectures, rooms and people — so your department stays in sync.</p>
          <div className="banner-actions">
            <Button variant="light" icon={CalendarDays} onClick={() => onNavigate('Timetable')}>View timetable <ArrowUpRight size={15} /></Button>
            <Button variant="glass" icon={Zap} onClick={onGenerate}>Generate schedule</Button>
          </div>
        </div>
        <div className="banner-art">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
          <div className="art-calendar">
            <div className="art-cal-head"><span></span><span></span><span></span></div>
            <div className="art-cal-title">THIS WEEK</div>
            <div className="art-cal-grid">{Array.from({ length: 21 }, (_, i) => <i key={i} className={[3, 5, 10, 12, 16].includes(i) ? 'marked' : ''}></i>)}</div>
            <div className="art-check"><Check size={17} /></div>
          </div>
          <div className="art-floating"><CheckCircle2 size={16} /><div><b>Conflict-free</b><small>Schedule preview</small></div></div>
        </div>
        <div className="banner-decoration"></div>
      </div>

      <div className="section-heading">
        <div><h2>Overview</h2><p>Key scheduling metrics for your department</p></div>
        <button className="filter-button" onClick={() => setFilter(filter === 'This week' ? 'This semester' : 'This week')}><CalendarDays size={15} />{filter}<ChevronDown size={14} /></button>
      </div>
      <div className="stats-grid">
        <StatCard title="Scheduled lectures" value={String(classes.length).padStart(2, '0')} change="+12.5%" foot="vs. last week" icon={CalendarCheck} tone="purple" />
        <StatCard title="Active courses" value={String(courses.length).padStart(2, '0')} foot="this semester" icon={BookOpen} tone="blue" />
        <StatCard title="Lecturers" value={String(people.length).padStart(2, '0')} foot="across the department" icon={Users} tone="green" />
        <StatCard title="Room utilisation" value={`${stats.roomUtil}%`} foot="based on scheduled lectures" icon={DoorOpen} tone="orange" />
      </div>

      <div className="dashboard-grid">
        <DailySchedule classes={classes} onViewTimetable={() => onNavigate('Timetable')} onSelect={(c) => notify(`${c.title} details selected`)} />
        <AlertWidget stats={stats} onViewProgress={() => onNavigate('Progress')} />
      </div>

      <div className="dashboard-bottom">
        <UpcomingEvents classes={classes} onViewTimetable={() => onNavigate('Timetable')} />
        <section className="panel mini-panel">
          <div className="panel-head"><div><h3>Quick actions</h3><p>Common tasks, one click away</p></div></div>
          <div className="quick-actions">
            <button onClick={onAddLecture}><span className="quick-icon purple"><Plus size={17} /></span><span><b>Add a lecture</b><small>Schedule a new class</small></span><ChevronRight size={16} /></button>
            <button onClick={onGenerate}><span className="quick-icon blue"><Sparkles size={17} /></span><span><b>Generate timetable</b><small>Auto-build a draft schedule</small></span><ChevronRight size={16} /></button>
            <button onClick={() => onNavigate('Progress')}><span className="quick-icon green"><CalendarCheck size={17} /></span><span><b>Check progress</b><small>Review workload and room usage</small></span><ChevronRight size={16} /></button>
          </div>
        </section>
      </div>
    </>
  );
}
