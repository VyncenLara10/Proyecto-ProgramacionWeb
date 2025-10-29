import styles from "./StepIndicator.module.css";

type StepIndicatorProps = {
  total: number;     // Número total de pasos (ej. 3)
  current: number;   // Paso actual (empieza en 1)
};

export default function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`${styles.dot} ${i + 1 === current ? styles.active : ""}`}
        />
      ))}
    </div>
  );
}
