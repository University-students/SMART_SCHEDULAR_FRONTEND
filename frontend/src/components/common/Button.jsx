import React from 'react';

/** Shared button primitive. Existing screens retain their original button styling. */
export default function Button({ children, onClick, type = 'button', className = '', disabled = false, ...props }) {
  return <button type={type} onClick={onClick} className={className} disabled={disabled} {...props}>{children}</button>;
}
