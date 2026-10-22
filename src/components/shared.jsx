// Shared small UI components used by multiple pages.
import React from 'react';
import { MoreHorizontal, Search, X, CheckCircle2 } from 'lucide-react';

// Reusable statistic card for dashboard and analytics.
export function StatCard({title,value,change,icon:Icon,tone,foot}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-top"><span>{title}</span><button className="icon-btn tiny"><MoreHorizontal size={18}/></button></div><div className="stat-value">{value}</div><div className="stat-foot">{change&&<span className={change.startsWith('+')?'positive':'neutral'}>{change}</span>}<span>{foot}</span></div></div>}

// Reusable search input used by management pages.
export function SearchBar({query,setQuery,placeholder='Search...'}){return <div className="searchbox"><Search size={16}/><input placeholder={placeholder} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery('')}><X size={14}/></button>}</div>}

// Small icon used in the security settings section.
export function ShieldIcon(){return <CheckCircle2 size={19}/>}

// Reusable toggle row for user preferences.
export function ToggleRow({title,desc,value,onChange}){return <div className="toggle-row"><div><b>{title}</b><small>{desc}</small></div><button className={`toggle ${value?'on':''}`} onClick={()=>onChange(!value)} aria-label={title}><i/></button></div>}
