import React from 'react';
import { Check, Plus, X } from 'lucide-react';
import { days, fmt, timeInputToHour, timeInputValue } from '../data';

export function Modal({ type, form, setForm, onClose, onSubmit, batches = [], initialBatch = 'ICT 22' }) {
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const batchOptions = [...new Set([initialBatch, ...batches.map(batch => batch.name)].filter(Boolean))];
  const defaultBatch = batchOptions[0] || 'ICT 22';
  const startValue = form.start || timeInputValue(8);
  const endValue = form.end || timeInputValue(10);
  const startHour = timeInputToHour(startValue);
  const titles = {
    class: 'Add a lecture',
    course: 'Add a course',
    lecturer: 'Add a lecturer',
    room: 'Add a teaching room',
    batch: 'Add a student batch',
    period: 'Add a calendar period',
    announcement: 'Post an announcement',
  };
  const setStartTime = value => {
    set('start', value);
    if (timeInputToHour(endValue) <= timeInputToHour(value)) {
      set('end', timeInputValue(Math.min(timeInputToHour(value) + 2, 18)));
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={onSubmit}>
        <div className="modal-top">
          <div className="modal-icon"><Plus size={20} /></div>
          <button type="button" className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <h2>{titles[type] || 'Add item'}</h2>
        <p>{type === 'period' ? 'Add a vacation or study-leave date range. Existing lectures will remain on the calendar.' : type === 'announcement' ? 'This announcement will be visible to everyone who signs in.' : 'Enter the details below. Times can be set in 15-minute steps.'}</p>
        {type === 'class' && <>
          <div className="form-row">
            <Field label="Course code" value={form.code || ''} onChange={value => set('code', value)} placeholder="e.g. ICT 2201" required />
            <Field label="Course title" value={form.title || ''} onChange={value => set('title', value)} placeholder="Lecture title" required />
          </div>
          <div className="form-row">
            <div className="field">
              <label>Day</label>
              <select value={form.day ?? '0'} onChange={event => set('day', event.target.value)}>
                {days.map((day, index) => <option value={index} key={day}>{day}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Batch</label>
              <select value={form.batch || defaultBatch} onChange={event => set('batch', event.target.value)}>
                {batchOptions.map(batch => <option value={batch} key={batch}>{batch}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <Field
              label="Start time"
              type="time"
              value={startValue}
              onChange={setStartTime}
              min="08:00"
              max="17:45"
              step="900"
              required
            />
            <Field
              label="End time"
              type="time"
              value={endValue}
              onChange={value => set('end', value)}
              min={timeInputValue(startHour + 0.25)}
              max="18:00"
              step="900"
              required
            />
          </div>
          <div className="form-row">
            <Field label="Lecturer" value={form.lecturer || ''} onChange={value => set('lecturer', value)} placeholder="Lecturer name" required />
            <Field label="Room" value={form.room || ''} onChange={value => set('room', value)} placeholder="e.g. LT 01" required />
          </div>
        </>}
        {type === 'course' && <>
          <Field label="Course code" value={form.code || ''} onChange={value => set('code', value)} placeholder="ICT 2207" required />
          <Field label="Course title" value={form.title || ''} onChange={value => set('title', value)} placeholder="Course name" required />
          <Field label="Assigned lecturer" value={form.lecturer || ''} onChange={value => set('lecturer', value)} placeholder="Lecturer name" />
          <div className="form-row">
            <Field label="Student batch" value={form.batch || 'ICT 22'} onChange={value => set('batch', value)} placeholder="ICT 22" />
            <Field label="Weekly hours" value={form.hours || '2'} onChange={value => set('hours', value)} type="number" placeholder="2" />
          </div>
          <Field label="Enrolment" value={form.students || '40'} onChange={value => set('students', value)} type="number" placeholder="40" />
        </>}
        {type === 'lecturer' && <>
          <Field label="Full name" value={form.name || ''} onChange={value => set('name', value)} placeholder="Dr. A. Example" required />
          <Field label="Role" value={form.role || 'Lecturer'} onChange={value => set('role', value)} placeholder="Lecturer" />
          <Field label="Specialisation" value={form.area || ''} onChange={value => set('area', value)} placeholder="e.g. Networking" />
          <Field label="Weekly teaching hours" value={form.hours || ''} onChange={value => set('hours', value)} placeholder="12" type="number" />
        </>}
        {type === 'room' && <>
          <Field label="Room name" value={form.name || ''} onChange={value => set('name', value)} placeholder="Computer Lab 03" required />
          <div className="form-row">
            <Field label="Room code" value={form.code || ''} onChange={value => set('code', value)} placeholder="Lab 03" required />
            <Field label="Capacity" value={form.capacity || ''} onChange={value => set('capacity', value)} placeholder="45" type="number" />
          </div>
          <Field label="Room type" value={form.type || 'Computer lab'} onChange={value => set('type', value)} placeholder="Computer lab" />
          <Field label="Building" value={form.building || ''} onChange={value => set('building', value)} placeholder="ICT Block" />
        </>}
        {type === 'batch' && <>
          <Field label="Batch name" value={form.name || ''} onChange={value => set('name', value)} placeholder="ICT 24" required />
          <div className="form-row">
            <Field label="Year" value={form.year || 'Year 1'} onChange={value => set('year', value)} placeholder="Year 1" />
            <Field label="Semester" value={form.semester || 'Semester 2'} onChange={value => set('semester', value)} placeholder="Semester 2" />
          </div>
          <div className="form-row">
            <Field label="Student count" value={form.students || ''} onChange={value => set('students', value)} placeholder="40" type="number" />
            <Field label="Course count" value={form.courses || ''} onChange={value => set('courses', value)} placeholder="5" type="number" />
          </div>
        </>}
        {type === 'period' && <>
          <div className="field">
            <label>Period type</label>
            <select value={form.type || 'Vacation'} onChange={event => set('type', event.target.value)}>
              <option>Vacation</option>
              <option>Study leave</option>
            </select>
          </div>
          <Field label="Title" value={form.title || ''} onChange={value => set('title', value)} placeholder="e.g. Semester break" required />
          <div className="form-row">
            <Field label="Start date" type="date" value={form.startDate || ''} onChange={value => set('startDate', value)} required />
            <Field label="End date" type="date" value={form.endDate || ''} onChange={value => set('endDate', value)} min={form.startDate || undefined} required />
          </div>
          <Field label="Details (optional)" value={form.description || ''} onChange={value => set('description', value)} placeholder="Additional information for students" />
        </>}
        {type === 'announcement' && <>
          <Field label="Announcement title" value={form.title || ''} onChange={value => set('title', value)} placeholder="Important update" required />
          <div className="field">
            <label htmlFor="announcement-message">Message</label>
            <textarea id="announcement-message" value={form.message || ''} onChange={event => set('message', event.target.value)} placeholder="Write the announcement for all users" rows="5" maxLength="2000" required />
          </div>
        </>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Check size={16} /> Save details</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false, min, max, step }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
