import styles from "./DetailsBox.module.css";

type DetailsBoxProps = {
  title: string;
  items: string[];
};

export function DetailsBox({ title, items }: DetailsBoxProps) {
  return (
    <div>
      <h3 className={styles.detailsTitle}>{title}</h3>
      <ul className={styles.detailsList}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
