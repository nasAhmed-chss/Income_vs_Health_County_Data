import type { VarType } from "@/types/data";
import styles from "./TypeBadge.module.css";

interface Props {
  type: VarType;
}

export default function TypeBadge({ type }: Props) {
  if (type === "categorical") {
    return <span className={`${styles.badge} ${styles.cat}`}>Categorical → Bar Chart</span>;
  }
  return <span className={`${styles.badge} ${styles.num}`}>Numerical → Histogram</span>;
}
