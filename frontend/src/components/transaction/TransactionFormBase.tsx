"use client";

import { useState } from "react";
import StepIndicator from "@/components/transaction/StepIndicator";
import styles from "./TransactionFormBase.module.css";

type TransactionFormBaseProps = {
  title: string;
  mode: "deposit" | "withdraw";          // 👈 nueva prop
  onSubmit: (data: FormData) => void;
};

export type FormData = {
  country: string;
  method: string;
  cui: string;
};

export default function TransactionFormBase({
  title,
  mode,
  onSubmit
}: TransactionFormBaseProps) {
  const [country, setCountry] = useState("");
  const [method, setMethod] = useState("");
  const [cui, setCui] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ country, method, cui });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{title}</h2>

      <input
        type="text"
        placeholder="País"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className={styles.input}
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className={styles.select}
      >
        <option value="">
          {mode === "deposit" ? "Método de Depósito" : "Método de Retiro"}
        </option>
        {mode === "deposit" ? (
          <>
            <option value="transferencia">Transferencia Bancaria</option>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
          </>
        ) : (
          <>
            <option value="cuenta">Cuenta Bancaria</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">Efectivo en ventanilla</option>
          </>
        )}
      </select>

      <input
        type="text"
        placeholder="CUI"
        value={cui}
        onChange={(e) => setCui(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Continuar
      </button>
      <StepIndicator total={3} current={1} />
    </form>
    
  );
}
