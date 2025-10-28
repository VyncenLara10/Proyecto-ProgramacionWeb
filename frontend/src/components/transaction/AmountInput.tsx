import { useState } from "react";
import styles from "./AmountInput.module.css";

type AmountInputProps = {
  label: string;
  currencySymbol?: string;
  value: number;
  onChange: (v: number) => void;
};

export default function AmountInput({
  label,
  currencySymbol = "$",
  value,
  onChange
}: AmountInputProps) {
  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => onChange(value > 0 ? value - 1 : 0);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <span className={styles.prefix}>{currencySymbol}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.input}
        />
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.btn}
            onClick={handleIncrement}
          >
            ▲
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={handleDecrement}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
