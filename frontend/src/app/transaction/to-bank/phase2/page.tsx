"use client";

import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB";
import AmountInput from "@/components/transaction/AmountInput";
import { SummaryCard } from "@/components/transaction/SummaryCard";
import { DetailsBox } from "@/components/transaction/DetailsBox";
import StepIndicator from "@/components/transaction/StepIndicator";
import styles from "./phase2.module.css";
import { useState } from "react";

export default function DepositPage() {
  const [amount, setAmount] = useState(0);

  return (
<Layout>
  <TB />
  <div className={styles.container_main}>
    <div className={styles.container}>
      <div className={styles.left}>

        <div className={styles.input}>
          <AmountInput
            label="Monto de Depósito:"
            currencySymbol="$"
            value={amount}
            onChange={setAmount}
          />
        </div>

        <div className={styles.details}>
          <DetailsBox
            title="Detalles"
            items={[
              "Los depósitos deben provenir de una cuenta bancaria a nombre del mismo titular de la cuenta en Hapi. Fondos enviados de terceros pueden perderse por completo.",
              "Depósitos antes de las 12 pm CT en días hábiles se validan y reflejan en un máximo de 3 horas. Después de ese horario, se procesan al siguiente día hábil."
            ]}
          />
        </div>
        
      </div>

      <div className={styles.right}>

        <div className={styles.card}>
          <SummaryCard shippingCost={2.5} total={3850.47} />
        </div>
        <button className={styles.button}>Continuar</button>

      </div>
      
    </div>

    <div className={styles.stepWrapper}>
      <StepIndicator total={3} current={2} />
    </div>
    
  </div>
  </Layout>

  );
}
