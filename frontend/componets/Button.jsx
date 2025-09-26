import React from 'react';

// boton reutilizable
export default function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  const cls = `btn ${variant === 'ghost' ? 'btn-ghost' : variant === 'outline' ? 'btn-outline' : 'btn-primary'} ${className}`;
  return (
    <button className={cls} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
