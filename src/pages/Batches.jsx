// Batches page: student intake summaries and batch timetable navigation.
import React, { useState } from 'react';
import {
  MoreHorizontal, CheckCircle2, CalendarCheck, DoorOpen, Clock3, MapPin, Zap,
  ChevronRight, ArrowUpRight, Sparkles, Plus, Users, GraduationCap,
  CalendarDays, Search, X, SlidersHorizontal, ChevronDown, Filter,
  Check, AlertTriangle, Download, ChevronLeft, BookOpen, UserRound, Bell
} from 'lucide-react';
import { days, times, fmt } from '../data';
import { StatCard, SearchBar, ToggleRow, ShieldIcon } from '../components/shared';

export function Batches({batches,openAdd,setPage,setBatchFilter,classes}){return <><div className="resource-stats"><div><span>Student batches</span><b>{batches.length}</b><small>Active intakes</small></div><div><span>Total students</span><b>{batches.reduce((a,b)=>a+b.students,0)}</b><small>Across listed batches</small></div><div><span>Courses assigned</span><b>{batches.reduce((a,b)=>a+b.courses,0)}</b><small>Batch-course assignments</small></div></div><div className="batch-grid">{batches.map((b,i)=><div className="panel batch-card" key={b.name}><div className="batch-card-top"><div className={`batch-illustration batch-${i%3}`}><GraduationCap size={26}/></div><span className="active-label"><i/>Active</span><button className="icon-btn"><MoreHorizontal size={17}/></button></div><h3>{b.name}</h3><p>{b.year} <i>•</i> {b.semester}</p><div className="batch-metrics"><div><b>{b.students}</b><small>Students</small></div><div><b>{b.courses}</b><small>Courses</small></div><div><b>5</b><small>Days/week</small></div></div><button className="outline-wide" onClick={()=>{setBatchFilter(b.name);setPage('Timetable')}}>View batch timetable <ArrowUpRight size={15}/></button></div>)}<button className="add-batch-card" onClick={()=>openAdd('batch')}><span><Plus size={22}/></span><b>Add new batch</b><small>Set up a new student intake</small></button></div></>}

