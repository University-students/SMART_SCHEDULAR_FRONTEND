// Lecturers page: lecturer directory and teaching-load summaries.
import React, { useState } from 'react';
import {
  MoreHorizontal, CheckCircle2, CalendarCheck, DoorOpen, Clock3, MapPin, Zap,
  ChevronRight, ArrowUpRight, Sparkles, Plus, Users, GraduationCap,
  CalendarDays, Search, X, SlidersHorizontal, ChevronDown, Filter,
  Check, AlertTriangle, Download, ChevronLeft, BookOpen, UserRound, Bell
} from 'lucide-react';
import { days, times, fmt } from '../data';
import { StatCard, SearchBar, ToggleRow, ShieldIcon } from '../components/shared';

export function Lecturers({people,query,setQuery,openAdd,notify}){const list=people.filter(p=>`${p.name} ${p.area}`.toLowerCase().includes(query.toLowerCase()));return <><div className="resource-stats"><div><span>Total lecturers</span><b>{people.length}</b><small>Across the department</small></div><div><span>Availability submitted</span><b>{Math.max(people.length-1,0)}/{people.length}</b><small>For this scheduling cycle</small></div><div><span>Avg. teaching hours</span><b>{people.length?(people.reduce((a,p)=>a+p.hours,0)/people.length).toFixed(1):'0'}</b><small>Hours per week</small></div></div><div className="panel table-panel"><div className="table-toolbar"><SearchBar query={query} setQuery={setQuery} placeholder="Search lecturers..."/><button className="filter-button"><Filter size={15}/> Filter by status</button></div><div className="table-scroll"><table><thead><tr><th>LECTURER</th><th>SPECIALISATION</th><th>TEACHING LOAD</th><th>AVAILABILITY</th><th></th></tr></thead><tbody>{list.map(p=><tr key={p.name}><td><div className="person-cell"><span className="avatar person-avatar">{p.initials}</span><div><b>{p.name}</b><small>{p.role}</small></div></div></td><td>{p.area}</td><td><div className="load-cell"><div className="load-track"><i style={{width:`${Math.min(100,p.hours/20*100)}%`}}/></div><span>{p.hours}/20 hrs</span></div></td><td><span className={`status-label ${p.status==='Available'?'good':'warning'}`}><i/>{p.status}</span></td><td><button className="icon-btn" onClick={()=>notify(`${p.name} profile selected`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{list.length===0&&<div className="empty-state">No lecturers found.</div>}</div><div className="table-footer"><span>Showing <b>{list.length}</b> lecturers</span><span>Teaching load target: 20 hrs/week</span></div></div></>}

