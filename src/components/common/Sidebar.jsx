import React from 'react';

/** Lightweight reusable sidebar wrapper; the existing app sidebar is unchanged. */
export default function Sidebar({ children, className = '' }) {
  return <aside className={className}>{children}</aside>;
}
