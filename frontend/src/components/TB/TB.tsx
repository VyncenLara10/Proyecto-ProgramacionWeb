"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/menu/Button";
import styles from "./TB.module.css";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { label: "Perfil", href: "/profile" },
    { label: "Configuración", href: "/settings" },
    { label: "Cerrar Sesión", href: "/logout" },
  ];
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando:", query);
  };

  return (
    <header className={styles.topbar}>
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar Empresa o ETF"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="secondary" type="submit">Buscar</Button>
      </form>

      {/* Perfil */}
      <div className={styles.profile}>
        <button
          className={styles.avatarBtn}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          👤
        </button>

        {/* Rectángulo flotante */}
        {menuOpen && (
          <div className={styles.dropdown}>
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
          </div>
        )}
      </div>
    </header>
  );
}

