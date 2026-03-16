import * as d3 from "d3";
import type { County } from "@/types/data";
import { VAR_META } from "@/lib/constants";
import styles from "./StatBox.module.css";

interface Props {
  varKey: string;
  data: County[];
}

export default function StatBox({ varKey, data }: Props) {
  const meta = VAR_META[varKey];

  let min = "—", mean = "—", max = "—";
  const n = data.length;

  if (meta?.type === "numerical") {
    const vals = data
      .map((d) => (d as Record<string, unknown>)[varKey] as number | null)
      .filter((v): v is number => v != null && !isNaN(v));

    if (vals.length > 0) {
      min  = meta.fmt(d3.min(vals)!);
      mean = meta.fmt(d3.mean(vals)!);
      max  = meta.fmt(d3.max(vals)!);
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.title}>{varKey}</div>
      <div className={styles.row}>
        <span>Min</span>
        <span className={styles.val}>{min}</span>
      </div>
      <div className={styles.row}>
        <span>Mean</span>
        <span className={`${styles.val} ${styles.highlight}`}>{mean}</span>
      </div>
      <div className={styles.row}>
        <span>Max</span>
        <span className={styles.val}>{max}</span>
      </div>
      <div className={styles.row}>
        <span>Counties</span>
        <span className={styles.val}>{n}</span>
      </div>
    </div>
  );
}
