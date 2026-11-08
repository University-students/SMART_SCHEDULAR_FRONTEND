// Rooms page: teaching spaces, capacities, and room utilisation.
import React, { useState } from 'react';
import {
  MoreHorizontal, CheckCircle2, CalendarCheck, DoorOpen, Clock3, MapPin, Zap,
  ChevronRight, ArrowUpRight, Sparkles, Plus, Users, GraduationCap,
  CalendarDays, Search, X, SlidersHorizontal, ChevronDown, Filter,
  Check, AlertTriangle, Download, ChevronLeft, BookOpen, UserRound, Bell
} from 'lucide-react';
import { days, times, fmt } from '../data';
import { StatCard, SearchBar, ToggleRow, ShieldIcon } from '../components/shared';

export function Rooms({rooms,query,setQuery,openAdd}){const list=rooms.filter(r=>`${r.name} ${r.code} ${r.type}`.toLowerCase().includes(query.toLowerCase()));return <><div className="resource-stats"><div><span>Total teaching spaces</span><b>{rooms.length}</b><small>Lecture theatres and labs</small></div><div><span>Total seating capacity</span><b>{rooms.reduce((a,r)=>a+r.capacity,0)}</b><small>Across all rooms</small></div><div><span>Available right now</span><b>{rooms.filter(r=>r.status==='Available').length}</b><small>Demo status</small></div></div><div className="panel table-panel"><div className="table-toolbar"><SearchBar query={query} setQuery={setQuery} placeholder="Search rooms..."/><button className="filter-button"><SlidersHorizontal size={15}/> Room type <ChevronDown size={14}/></button></div><div className="room-card-grid">{list.map((r,i)=><div className="room-card" key={r.code}><div className="room-card-top"><div className={`room-symbol room-${i%3}`}><DoorOpen size={21}/></div><span className={`room-status ${r.status==='In use'?'busy':''}`}><i/>{r.status}</span><button className="icon-btn"><MoreHorizontal size={17}/></button></div><h3>{r.name}</h3><span className="room-code">{r.code} <i>•</i> {r.type}</span><div className="room-card-meta"><span><Users size={14}/>{r.capacity} seats</span><span><MapPin size={14}/>{r.building}</span></div><div className="room-card-bottom"><span>Utilisation this week</span><b>{[72,84,65,40,58][i%5]}%</b></div><div className="util-track"><i style={{width:`${[72,84,65,40,58][i%5]}%`}}/></div></div>)}</div>{list.length===0&&<div className="empty-state">No rooms found.</div>}</div></>}

