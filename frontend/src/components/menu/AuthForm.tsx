"use client";
import React, { useState } from "react";
import Button from "./Button";
import styles from "./AuthForm.module.css";

type AuthFormProps = {
  mode?: "login" | "register";
  onSubmit?: (data: { email: string; password: string }) => void;
};

export default function AuthForm({ mode = "login", onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password });
  };

  return (
    <form className={`${styles.form} ${styles.card}`} onSubmit={submit}>
      <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>

      <input
        className={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className={styles.actions}>
        <Button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </Button>
        <Button variant="secondary" type="button">
          Cancelar
        </Button>
      </div>

      <div className={styles.smallMuted}>Continuar.</div>
    </form>
  );
}
