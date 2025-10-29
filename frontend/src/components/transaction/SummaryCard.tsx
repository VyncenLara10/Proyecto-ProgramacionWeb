import styles from "./SummaryCard.module.css";

type SummaryCardProps = {
  shippingCost: number;
  total: number;
};

export function SummaryCard({ shippingCost, total }: SummaryCardProps) {
  return (
    <div className={styles.summary_card}>
      <div className={styles.line}>
        <span className={styles.label}>Costo Envío</span>
        <span className={styles.value}>${shippingCost.toFixed(2)}</span>
      </div>
      <div className={`${styles.line} ${styles.total}`}>
        <span className={styles.label}>Total a Pagar</span>
        <span className={styles.value}>Q{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
