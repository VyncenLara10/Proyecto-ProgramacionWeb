"use client";

import TransactionFormBase, { FormData } from "@/components/transaction/TransactionFormBase";
import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB";
import styles from "./phase1.module.css";
import StepIndicator from "@/components/transaction/StepIndicator";


export default function ToBankPage() {
  const handleSubmit = (data: FormData) => {
    console.log("Enviando depósito:", data);
    // Aquí va tu lógica para depósito
  };

  return (
    <Layout>
          <TB />
          <div className={styles.container_main}>
            <div className={styles.container}>
              <TransactionFormBase
                title="Depositar fondos"
                mode="deposit"
                onSubmit={handleSubmit}
              />
            </div>
            <StepIndicator total={3} current={1} />
          </div>
          
        
        </Layout>
  );
}


