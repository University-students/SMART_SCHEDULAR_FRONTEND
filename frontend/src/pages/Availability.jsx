import React, { useEffect, useState } from 'react';
import { CalendarCheck, Check, UserRound } from 'lucide-react';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function Availability({ people, records = [], onSave, canSubmit = true, currentLecturer = '' }) {
  const [selectedDays, setSelectedDays] = useState(() => Object.fromEntries(
    records.map(record => [record.lecturer, record.days || []]),
  ));
  useEffect(() => {
    setSelectedDays(current => ({
      ...Object.fromEntries(records.map(record => [record.lecturer, record.days || []])),
      ...current,
    }));
  }, [records]);
  const submittedCount = people.filter(person =>
    records.some(record => record.lecturer === person.name),
  ).length;

  const toggleDay = (lecturer, day) => {
    setSelectedDays(current => {
      const currentDays = current[lecturer] || [];
      const days = currentDays.includes(day)
        ? currentDays.filter(item => item !== day)
        : [...currentDays, day];
      return { ...current, [lecturer]: days };
    });
  };

  return <>
    <div className="info-banner">
      <CalendarCheck size={19} />
      <div>
        <b>Lecturer availability</b>
        <p>Choose available days and save them to the shared schedule database.</p>
      </div>
      <span className="availability-count">{submittedCount} submitted</span>
    </div>
    <div className="availability-grid">
      {people.map(person => {
        const saved = records.some(record => record.lecturer === person.name);
        const canEdit = canSubmit && (
          !currentLecturer ||
          currentLecturer.trim().toLowerCase() === person.name.trim().toLowerCase()
        );
        const days = selectedDays[person.name] || [];
        return (
          <div className="panel availability-card" key={person.id || person.name}>
            <div className="availability-person">
              <span className="avatar person-avatar">{person.initials || <UserRound size={16} />}</span>
              <div><b>{person.name}</b><small>{person.area}</small></div>
              <span className={`status-label ${saved ? 'good' : 'warning'}`}><i />{saved ? 'Submitted' : 'Pending'}</span>
            </div>
            <p className="availability-desc">Select the days when this lecturer is available for scheduled lectures.</p>
            <div className="availability-days">
              {weekDays.map(day => (
                <button
                  type="button"
                  key={day}
                  className={days.includes(day) ? 'day-selected' : ''}
                  aria-pressed={days.includes(day)}
                  disabled={!canEdit}
                  onClick={() => toggleDay(person.name, day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {canEdit && (
              <button type="button" className="btn btn-secondary full-btn" onClick={() => onSave(person.name, days)}>
                <Check size={15} /> Save availability
              </button>
            )}
          </div>
        );
      })}
    </div>
  </>;
}
