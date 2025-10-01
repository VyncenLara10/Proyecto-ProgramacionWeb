"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className={styles.sidebar}>
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
