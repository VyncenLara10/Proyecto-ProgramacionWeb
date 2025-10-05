"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // 👈 importa el router
import StepIndicator from "@/components/transaction/StepIndicator";
import styles from "./TransactionFormBase.module.css";

type TransactionFormBaseProps = {
  title: string;
  mode: "deposit" | "withdraw";          // 👈 nueva prop
  onSubmit?: (data: FormData) => void;   // la hago opcional si solo quieres navegar
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

  const router = useRouter(); // 👈

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Si quieres seguir ejecutando alguna lógica que envíe datos:
    onSubmit?.({ country, method, cui });

    // 👇 Redirige a la siguiente fase según el modo
    if (mode === "deposit") {
      router.push("/transaction/to-bank/phase2");
    } else {
      router.push("/transaction/to-hapi/phase2");
    }
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
