import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

//  barra lateral izquierda (Sin fotos aun y solo unas vistas)
export default function Sidebar() {
  const r = useRouter();
  const items = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
  ];
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>InvestCorp</h3>
        <div className="small-muted">Fictional exchange firm</div>
      </div>
      {items.map((i) => (
        <Link key={i.href} href={i.href} legacyBehavior>
          <a className={r.pathname === i.href ? 'active' : ''}>{i.label}</a>
        </Link>
      ))}
    </aside>
  );
}
