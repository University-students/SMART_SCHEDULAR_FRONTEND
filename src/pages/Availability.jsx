// Availability page: collect lecturer preferred/unavailable days for this demo.
import React, { useState } from 'react';
import {
  MoreHorizontal, CheckCircle2, CalendarCheck, DoorOpen, Clock3, MapPin, Zap,
  ChevronRight, ArrowUpRight, Sparkles, Plus, Users, GraduationCap,
  CalendarDays, Search, X, SlidersHorizontal, ChevronDown, Filter,
  Check, AlertTriangle, Download, ChevronLeft, BookOpen, UserRound, Bell
} from 'lucide-react';
import { days, times, fmt } from '../data';
import { StatCard, SearchBar, ToggleRow, ShieldIcon } from '../components/shared';

export function Availability({people,notify}){const [checked,setChecked]=useState({});return <><div className="info-banner"><CalendarCheck size={19}/><div><b>Lecturer availability</b><p>Collect preferred and unavailable time slots before generating the timetable.</p></div><span className="availability-count">{Object.values(checked).filter(Boolean).length} submitted</span></div><div className="availability-grid">{people.map((p,i)=><div className="panel availability-card" key={p.name}><div className="availability-person"><span className="avatar person-avatar">{p.initials}</span><div><b>{p.name}</b><small>{p.area}</small></div><span className={`status-label ${checked[p.name]?'good':'warning'}`}><i/>{checked[p.name]?'Submitted':'Pending'}</span></div><p className="availability-desc">Select the days when this lecturer is available for scheduled lectures.</p><div className="availability-days">{['Mon','Tue','Wed','Thu','Fri'].map(d=><button key={d} className={(checked[`${p.name}-${d}`]?'day-selected':'')} onClick={()=>setChecked({...checked,[`${p.name}-${d}`]:!checked[`${p.name}-${d}`]})}>{d}</button>)}</div><button className="btn btn-secondary full-btn" onClick={()=>{setChecked({...checked,[p.name]:true});notify(`Availability saved for ${p.name}`)}}><Check size={15}/> Save availability</button></div>)}</div></>}

