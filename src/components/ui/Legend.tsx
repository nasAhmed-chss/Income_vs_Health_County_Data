import { STATE_COLORS } from "@/lib/constants";
import styles from "./Legend.module.css";

interface Props {
  states: string[];
}

export default function Legend({ states }: Props) {
  return (
    <div className={styles.legend}>
      {states.map((s) => (
        <div key={s} className={styles.item}>
          <div
            className={styles.swatch}
            style={{ background: STATE_COLORS[s] ?? "#aaa" }}
          />
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}
