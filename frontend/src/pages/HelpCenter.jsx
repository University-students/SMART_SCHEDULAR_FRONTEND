import React from 'react';
import { ArrowRight, BarChart3, BookOpen, CalendarDays, CircleHelp, DoorOpen, GraduationCap, Megaphone, Settings, UserRound, Users, Video } from 'lucide-react';

const guides = [
  { title: 'Dashboard', description: 'Review schedule totals, room use, lecturer assignments and shortcuts.', icon: BookOpen },
  { title: 'Timetable', description: 'Browse recurring weekly lectures in a searchable table. Filter by student batch; add leave periods if you are an Administrator or HOD.', icon: CalendarDays },
  { title: 'Courses', description: 'Maintain course codes, titles, assigned lecturers, batches and weekly hours.', icon: BookOpen },
  { title: 'Lecturers', description: 'Maintain lecturer names, roles, specialisations and teaching hours.', icon: Users },
  { title: 'Rooms', description: 'Manage room codes, capacities, buildings and room types.', icon: DoorOpen },
  { title: 'Batches', description: 'Maintain student batches, year, semester and enrolment details.', icon: GraduationCap },
  { title: 'Availability', description: 'View lecturer availability; lecturers can update their own available weekdays.', icon: UserRound },
  { title: 'Analytics', description: 'Review schedule summaries, room use and lecturer assignments.', icon: BarChart3 },
  { title: 'Announcements', description: 'Read important updates. Administrators and HODs can post or remove announcements for all signed-in users.', icon: Megaphone },
  { title: 'Settings', description: 'Update your profile preferences and opt in to email lecture reminders.', icon: Settings },
];

export function HelpCenter({ setPage }) {
  return <div className="help-center">
    <section className="panel help-video">
      <div className="help-video-icon"><Video size={26} /></div>
      <div>
        <span className="help-video-label">PROJECT WALKTHROUGH</span>
        <h2>Video guide coming soon</h2>
        <p>A walkthrough video has not been linked yet. In the meantime, use this guide to learn what each section does.</p>
        <span className="help-video-status"><CircleHelp size={15} /> No video URL is configured</span>
      </div>
    </section>

    <section className="help-guide-section">
      <div className="agenda-section-heading"><div><h2>How to use UniSchedule</h2><p>Quick guide to the main features available in your account.</p></div></div>
      <div className="help-guide-list">
        {guides.map(({ title, description, icon: Icon }) => (
          <article className="panel help-guide" key={title}>
            <span className="help-guide-icon"><Icon size={18} /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
            <button className="text-action" onClick={() => setPage(title)} aria-label={`Open ${title}`}>
              Open <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
    </section>
  </div>;
}
