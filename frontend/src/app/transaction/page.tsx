"use client";

import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB";
import { useRouter } from "next/navigation";
import styles from "./transaction.module.css";

export default function TransactionPage() {
  const router = useRouter();

  return (
    <Layout>
      <TB />

      <div className={styles.container_main}>
        <div className={styles.container}>

          <div
            className={styles.card}
            onClick={() => router.push("/transaction/to-bank/phase1")}
          >
            <h2>Transferir a tu Banco</h2>
            <p>Transfiere fondos desde tu cuenta Bancaria hacia Hapi</p>
          
          </div>
          <div
            className={styles.card}
            onClick={() => router.push("/transaction/to-hapi")}
          >
            <h2>Transferir a Hapi</h2>
            <p>Transfiere fondos desde Hapi hacia tu cuenta bancaria</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}



