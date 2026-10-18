// Reusable button. variant: primary | secondary | light | glass. Pass an icon component via `icon`.
import React from 'react';

export default function Button({ variant = 'primary', icon: Icon, full = false, className = '', children, ...props }) {
  const classes = ['btn', `btn-${variant}`, full ? 'full-btn' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
