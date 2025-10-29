"use client";

import React from "react";
import styles from "./TextInput.module.css";

type TextInputProps = {
  label?: string;            // Etiqueta opcional
  placeholder?: string;      // Texto de ayuda
  value: string;             // Valor controlado
  onChange: (value: string) => void; // Función para actualizar valor
  type?: string;             
  required?: boolean;        
};

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false
}: TextInputProps) {
  return (
    <div className={styles.input_group}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        required={required}
      />
    </div>
  );
}
