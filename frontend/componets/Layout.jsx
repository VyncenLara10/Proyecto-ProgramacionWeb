import React from 'react';
import Sidebar from './Sidebar';

// layout con sidebar, contenedor 
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main container">{children}</main>
    </div>
  );
}
