"use client";

import TransactionFormBase, { FormData } from "@/components/transaction/TransactionFormBase";
import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB";
import styles from "@/components/transaction/TransactionFormBase.module.css";

export default function ToBankPage() {
  const handleSubmit = (data: FormData) => {
    console.log("Enviando depósito:", data);
    // Aquí va tu lógica para depósito
  };

  return (
    <Layout>
          <TB />

          <TransactionFormBase
            title="Depositar fondos"
            mode="deposit"
            onSubmit={handleSubmit}
          />
   
        </Layout>
  );
}


