// Timetable page: weekly calendar, filters, add-lecture form and conflict warnings.
import React, { useState } from 'react';
import {
  AlertTriangle, ArrowUpRight, Check, ChevronLeft, ChevronRight, Download, Filter, Plus, Search, Sparkles, X
} from 'lucide-react';
import Button from '../components/common/Button';
import CalendarView from '../components/timetable/CalendarView';
import { days, times, fmt } from '../utils/formatDate';

// Small labelled text input used by the add-lecture form.
function Field({ label, value, onChange, placeholder, required = false }) {
  return (
    <div className="field"><label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </div>
  );
}

// "Add a lecture" modal. onSubmit(form) returns true when the lecture was saved.
function AddLectureModal({ batchNames, defaultBatch, onClose, onSubmit }) {
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    const start = Number(form.start ?? 8);
    const end = Number(form.end ?? 10);
    if (end <= start) { setFormError('End time must be later than the start time.'); return; }
    setFormError('');
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-top"><div className="modal-icon"><Plus size={20} /></div><button type="button" className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <h2>Add a lecture</h2>
        <p>Enter the details below. Changes are saved in this browser on this device.</p>
        <div className="form-row">
          <Field label="Course code" value={form.code || ''} onChange={(v) => set('code', v)} placeholder="e.g. ICT 2201" required />
          <Field label="Course title" value={form.title || ''} onChange={(v) => set('title', v)} placeholder="Lecture title" required />
        </div>
        <div className="form-row">
          <div className="field"><label>Day</label><select value={form.day ?? '0'} onChange={(e) => set('day', e.target.value)}>{days.map((d, i) => <option value={i} key={d}>{d}</option>)}</select></div>
          <div className="field"><label>Batch</label><select value={form.batch || defaultBatch} onChange={(e) => set('batch', e.target.value)}>{batchNames.map((b) => <option key={b}>{b}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Start time</label><select value={form.start ?? '8'} onChange={(e) => set('start', e.target.value)}>{times.slice(0, 7).map((t) => <option value={t} key={t}>{fmt(t)}</option>)}</select></div>
          <div className="field"><label>End time</label><select value={form.end ?? '10'} onChange={(e) => set('end', e.target.value)}>{times.slice(1).map((t) => <option value={t} key={t}>{fmt(t)}</option>)}</select></div>
        </div>
        <div className="form-row">
          <Field label="Lecturer" value={form.lecturer || ''} onChange={(v) => set('lecturer', v)} placeholder="Lecturer name" required />
          <Field label="Room" value={form.room || ''} onChange={(v) => set('room', v)} placeholder="e.g. LT 01" required />
        </div>
        {formError && <div className="login-error" role="alert">{formError}</div>}
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <button type="submit" className="btn btn-primary"><Check size={16} /> Save details</button>
        </div>
      </form>
    </div>
  );
}

export default function TimetablePage({
  classes, batches, batchFilter, setBatchFilter, selectedDay, setSelectedDay,
  addOpen, setAddOpen, onAddLecture, onRemoveLecture, onExport, notify,
}) {
  const [view, setView] = useState('Week');
  const [week, setWeek] = useState(6);
  const [search, setSearch] = useState('');
  const [conflicts, setConflicts] = useState([]);

  const batchNames = [...new Set([...batches.map((b) => b.name), ...classes.map((c) => c.batch).filter(Boolean)])];
  const visible = classes.filter((c) =>
    (batchFilter === 'All batches' || c.batch === batchFilter) &&
    (selectedDay === 'All days' || days[c.day] === selectedDay) &&
    `${c.title} ${c.code} ${c.lecturer}`.toLowerCase().includes(search.toLowerCase()));

  // Try to add; the service returns conflict messages when the slot is not free.
  const handleSubmit = (form) => {
    const found = onAddLecture(form);
    if (found.length) setConflicts(found);
    else setAddOpen(false);
  };

  return (
    <>
      <div className="panel timetable-toolbar">
        <div className="toolbar-left">
          <div className="view-switch">{['Week', 'Day'].map((v) => <button className={view === v ? 'selected' : ''} key={v} onClick={() => setView(v)}>{v}</button>)}</div>
          <button className="today-btn" onClick={() => { setWeek(6); setSelectedDay('All days'); }}>Today</button>
          <div className="week-switch">
            <button className="icon-btn" onClick={() => setWeek(Math.max(1, week - 1))}><ChevronLeft size={17} /></button>
            <b>Week {String(week).padStart(2, '0')}, 2026</b>
            <button className="icon-btn" onClick={() => setWeek(week + 1)}><ChevronRight size={17} /></button>
          </div>
        </div>
        <div className="toolbar-right">
          <div className="searchbox compact"><Search size={15} /><input placeholder="Search lectures..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <select className="select-control" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
            <option>All batches</option>{batchNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <button className="icon-btn filter-icon" onClick={() => setSelectedDay(selectedDay === 'All days' ? 'Monday' : 'All days')} title="Toggle day filter"><Filter size={17} /></button>
        </div>
      </div>

      <div className="timetable-summary">
        <div><span className="summary-dot purple-dot"></span><b>{visible.length}</b> lectures this week</div>
        <div><span className="summary-dot green-dot"></span> Conflict checks enabled</div>
        <div className="summary-spacer"></div>
        <button className="text-action" onClick={onExport}><Download size={15} /> Export timetable</button>
      </div>

      <div className="panel calendar-panel">
        <CalendarView lectures={visible} selectedDay={selectedDay} onRemove={onRemoveLecture} />
        <div className="calendar-legend">
          <span><i className="legend violet"></i>Development</span>
          <span><i className="legend blue"></i>Data & algorithms</span>
          <span><i className="legend orange"></i>Databases</span>
          <span><i className="legend mint"></i>Core modules</span>
          <span className="legend-note">Select a lecture to see actions</span>
        </div>
      </div>

      <div className="panel schedule-note">
        <div className="note-icon"><Sparkles size={18} /></div>
        <div><b>Scheduling tip</b><p>Always check lecturer availability and room capacity before publishing. Conflict checks run when you add a lecture in this demo.</p></div>
        <button className="text-action" onClick={() => notify('Publishing is a demo feature')}>Review before publishing <ArrowUpRight size={14} /></button>
      </div>

      {addOpen && (
        <AddLectureModal batchNames={batchNames} defaultBatch={batchFilter === 'All batches' ? (batchNames[0] || 'ICT 22') : batchFilter}
          onClose={() => { setAddOpen(false); setConflicts([]); }} onSubmit={handleSubmit} />
      )}

      {conflicts.length > 0 && (
        <div className="modal-backdrop">
          <div className="modal conflict-modal">
            <div className="modal-top"><div className="modal-icon danger"><AlertTriangle size={20} /></div><button className="icon-btn" onClick={() => setConflicts([])}><X size={18} /></button></div>
            <h2>Schedule conflict detected</h2>
            <p>This lecture overlaps with an existing room, lecturer, or batch booking. Please choose a different time or resource.</p>
            <div className="conflict-list">{conflicts.map((c, i) => <div key={i}><AlertTriangle size={15} />{c}</div>)}</div>
            <Button full onClick={() => setConflicts([])}>Review and edit</Button>
          </div>
        </div>
      )}
    </>
  );
}
