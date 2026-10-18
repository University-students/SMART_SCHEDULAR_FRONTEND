// "Schedule health" panel: conflict count, lecturer assignment and room usage at a glance.
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AlertWidget({ stats, onViewProgress }) {
  const { clashCount, health, assignedPct, roomUtil } = stats;
  return (
    <section className="panel health-panel">
      <div className="panel-head">
        <div><h3>Schedule health</h3><p>Timetable quality at a glance</p></div>
        <span className="health-badge"><span></span> {clashCount ? 'Needs review' : 'Good'}</span>
      </div>
      <div className="health-score">
        <div className="score-ring"><div><b>{health}</b><small>/100</small></div></div>
        <div className="score-copy">
          <b>{clashCount ? 'Needs attention' : 'Looking great!'}</b>
          <p>{clashCount ? 'Review overlapping lectures before publishing.' : 'No resource conflicts detected in the current schedule.'}</p>
        </div>
      </div>
      <div className="health-metrics">
        <div><span><span className="metric-dot green-dot"></span>Conflicts detected</span><b>{clashCount}</b></div>
        <div><span><span className="metric-dot purple-dot"></span>Lecturers assigned</span><b>{assignedPct}%</b></div>
        <div><span><span className="metric-dot orange-dot"></span>Rooms in use</span><b>{roomUtil}%</b></div>
      </div>
      <button className="outline-wide" onClick={onViewProgress}>View detailed progress <ArrowUpRight size={15} /></button>
    </section>
  );
}
