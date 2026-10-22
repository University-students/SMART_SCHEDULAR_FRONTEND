// Courses page: search and review the department course list.
import React, { useState } from 'react';
import {
  MoreHorizontal, CheckCircle2, CalendarCheck, DoorOpen, Clock3, MapPin, Zap,
  ChevronRight, ArrowUpRight, Sparkles, Plus, Users, GraduationCap,
  CalendarDays, Search, X, SlidersHorizontal, ChevronDown, Filter,
  Check, AlertTriangle, Download, ChevronLeft, BookOpen, UserRound, Bell
} from 'lucide-react';
import { days, times, fmt } from '../data';
import { StatCard, SearchBar, ToggleRow, ShieldIcon } from '../components/shared';

export function Courses({query,setQuery,filteredCourses,openAdd}){return <><div className="panel table-panel"><div className="table-toolbar"><SearchBar query={query} setQuery={setQuery} placeholder="Search by course, code or lecturer..."/><button className="filter-button"><SlidersHorizontal size={15}/> Filters <ChevronDown size={14}/></button></div><div className="table-scroll"><table><thead><tr><th>COURSE</th><th>LECTURER</th><th>ROOM</th><th>BATCH</th><th>ENROLMENT</th><th>HOURS</th><th></th></tr></thead><tbody>{filteredCourses.map(c=><tr key={c.code}><td><div className="course-cell"><span className={`course-square ${c.color}`}>{c.code.split(' ')[1].slice(-2)}</span><div><b>{c.title}</b><small>{c.code}</small></div></div></td><td>{c.lecturer}</td><td><span className="room-tag">{c.room}</span></td><td><span className="batch-tag">{c.batch}</span></td><td>{c.students} students</td><td>{c.hours}/week</td><td><button className="icon-btn" title="Course actions"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{filteredCourses.length===0&&<div className="empty-state">No courses match your search.</div>}</div><div className="table-footer"><span>Showing <b>{filteredCourses.length}</b> courses</span><span>Semester 2, 2026</span></div></div><div className="info-banner"><BookOpen size={18}/><div><b>Keep course information up to date</b><p>Course details are used by the scheduling engine to assign lecturers, rooms and weekly time slots.</p></div><button className="btn btn-secondary" onClick={()=>openAdd('course')}><Plus size={15}/> Add course</button></div></>}

