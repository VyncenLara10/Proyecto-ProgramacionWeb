"use client";

import { useState } from "react";

export default function TransactionForm() {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ amount, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Monto:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <label>
        Descripción:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <button type="submit">Agregar</button>
    </form>
  );
}
