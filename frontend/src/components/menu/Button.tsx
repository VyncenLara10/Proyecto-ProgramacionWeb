"use client";
import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const variantClass =
    variant === "ghost"
      ? styles.ghost
      : variant === "outline"
      ? styles.outline
      : variant === "secondary"
      ? styles.secondary
      : styles.primary;

  return (
    <button
      className={`${styles.btn} ${variantClass} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
