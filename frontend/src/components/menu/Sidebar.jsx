"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/home", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/transferir", label: "Transferir" },
    { href: "/invitar", label: "Invitar" },
    { href: "/buscar", label: "Buscar" },
  ];

  return (
    
    <aside className={styles.sidebar}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet"></link>
      <div className={styles.header}>
        <h3 className={styles.title}>InvestCorp</h3>
        <div className={styles.subtitle}>Fictional exchange firm</div>
      </div>

      <nav className={styles.nav}>
        {items.map((i) => (
          
          <Link key={i.href} href={i.href} legacyBehavior>
            <a
              className={`${styles.link} ${
                pathname === i.href ? styles.active : ""
              }`}
            >
              {i.label}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
