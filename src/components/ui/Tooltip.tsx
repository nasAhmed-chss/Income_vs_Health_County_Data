"use client";

import { useEffect, useRef } from "react";
import type { TooltipState } from "@/types/data";
import styles from "./Tooltip.module.css";

interface Props {
  tooltip: TooltipState;
}

export default function Tooltip({ tooltip }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Clamp position so tooltip never goes off-screen
  let x = tooltip.x;
  let y = tooltip.y;
  if (ref.current) {
    const w = ref.current.offsetWidth  || 220;
    const h = ref.current.offsetHeight || 80;
    if (x + w > window.innerWidth)  x = x - w - 24;
    if (y + h > window.innerHeight) y = y - h;
  }

  return (
    <div
      ref={ref}
      className={`${styles.tooltip} ${tooltip.visible ? styles.show : ""}`}
      style={{ left: x, top: y }}
    >
      <div className={styles.head}>{tooltip.head}</div>
      {tooltip.rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.label}>{row.label}</span>
          <span className={styles.val}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
