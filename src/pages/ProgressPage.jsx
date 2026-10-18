// Progress page: room utilisation, teaching workload and lecture distribution for the current timetable.
import React from 'react';
import { CalendarCheck, CheckCircle2, AlertTriangle, Clock3, DoorOpen } from 'lucide-react';
import { StatCard } from './Dashboard';
import { days } from '../utils/formatDate';

export default function ProgressPage({ classes, people, rooms, stats }) {
  const perDay = days.map((_, i) => classes.filter((c) => c.day === i).length);
  const maxPerDay = Math.max(1, ...perDay);
  const usage = [72, 84, 65, 40, 58]; // demo utilisation figures per room

  return (
    <>
      <div className="stats-grid">
        <StatCard title="Room utilisation" value={`${stats.roomUtil}%`} foot="based on scheduled lectures" icon={DoorOpen} tone="orange" />
        <StatCard title="Teaching hours" value={`${people.reduce((a, p) => a + p.hours, 0)}h`} foot="per week total" icon={Clock3} tone="blue" />
        <StatCard title="Schedule conflicts" value={stats.clashCount} foot="in current schedule" icon={stats.clashCount ? AlertTriangle : CheckCircle2} tone="green" />
        <StatCard title="Lectures scheduled" value={classes.length} foot="across the week" icon={CalendarCheck} tone="purple" />
      </div>

      <div className="analytics-grid">
        <div className="panel chart-panel">
          <div className="panel-head"><div><h3>Weekly lecture distribution</h3><p>Scheduled classes by day</p></div><span className="chart-tag">This week</span></div>
          <div className="bar-chart">
            {days.map((d, i) => (
              <div className="bar-column" key={d}>
                <span>{perDay[i]}</span>
                <div className="bar-track"><i style={{ height: `${Math.max(8, (perDay[i] / maxPerDay) * 100)}%` }} /></div>
                <small>{d.slice(0, 3)}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel chart-panel">
          <div className="panel-head"><div><h3>Lecturer workload</h3><p>Teaching hours per week</p></div><span className="chart-tag">Max 20 hrs</span></div>
          <div className="workload-list">
            {people.map((p) => (
              <div className="workload-row" key={p.name}>
                <div className="workload-name"><span className="avatar mini-avatar">{p.initials}</span><b>{p.name}</b><small>{p.hours}h</small></div>
                <div className="load-track"><i style={{ width: `${(p.hours / 20) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel table-panel analytics-rooms">
        <div className="panel-head"><div><h3>Room utilisation overview</h3><p>Capacity and current availability</p></div></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>ROOM</th><th>TYPE</th><th>CAPACITY</th><th>STATUS</th><th>UTILISATION</th></tr></thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={r.code}>
                  <td><b>{r.code}</b></td><td>{r.type}</td><td>{r.capacity} seats</td>
                  <td><span className={`room-status ${r.status === 'In use' ? 'busy' : ''}`}><i />{r.status}</span></td>
                  <td><div className="load-cell"><div className="load-track"><i style={{ width: `${usage[i % 5]}%` }} /></div><span>{usage[i % 5]}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
