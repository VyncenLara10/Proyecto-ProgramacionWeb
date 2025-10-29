"use client";

import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB";
import { useRouter } from "next/navigation";
import styles from "./phase3.module.css";
import TextInput from "@/components/transaction/TextInput";
import { SummaryCard } from "@/components/transaction/SummaryCard";
import StepIndicator from "@/components/transaction/StepIndicator";

import { useState } from "react"; 

export default function TransactionPage() {
  const router = useRouter();
  const [number, setNumber] = useState(""); 
  const [name, setName] = useState(""); 
  const [date, setDate] = useState(""); 
  const [cvv, setCvv] = useState(""); 
  const [cui, setCui] = useState(""); 

  return (
    <Layout>
      <TB />
      <div className={styles.container_main}>

        <div className={styles.container}>

          <div className={styles.left}>
            <div className={styles.input_container_main}>
              <TextInput
                label="Número de Tarjeta"
                placeholder="1234-5678-9123-4567"
                value={number}
                onChange={setNumber}
              />
              <TextInput
                label="Nombre del Titular"
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={setName}
              />              

              <div className={styles.input_container}>
                <TextInput
                  label="Fecha de Vencimiento"
                  placeholder="mm/AA"
                  value={date}
                  onChange={setDate}
                />
                <TextInput
                  label="CVV"
                  placeholder="CVV"
                  value={cvv}
                  onChange={setCvv}
                />
              </div>

              <TextInput
                label="CUI"
                placeholder="Ingresa tu CUI"
                value={cui}
                onChange={setCui}
              />

            </div>


            <div className={styles.details}>
              
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <SummaryCard shippingCost={2.5} total={3850.47} />
            </div>
            <button className={styles.button}>
              Pagar
            </button>
          </div>

        </div>

        <div className={styles.stepWrapper}>
          <StepIndicator total={3} current={3} />
        </div>

      </div>
    </Layout>
  );
}

