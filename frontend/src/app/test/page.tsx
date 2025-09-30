"use client";
import React from "react";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";
import Button from "@/components/Button";

export default function TestPage() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log("Login data:", data);
  };

  return (
    <Layout>
      <h1>Prueba de componentes</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>Formulario Auth</h2>
        <AuthForm mode="login" onSubmit={handleLogin} />
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Botones</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="primary">Primario</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secundario</Button>
        </div>
      </section>
    </Layout>
  );
}
