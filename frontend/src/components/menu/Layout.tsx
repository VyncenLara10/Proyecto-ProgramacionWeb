"use client";
import React from "react";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={`${styles.main} container`}>{children}</main>
    </div>
  );
}
