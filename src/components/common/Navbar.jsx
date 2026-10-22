import React from 'react';

/** Lightweight reusable navigation wrapper for future screens. */
export default function Navbar({ children, className = '' }) {
  return <header className={className}>{children}</header>;
}
