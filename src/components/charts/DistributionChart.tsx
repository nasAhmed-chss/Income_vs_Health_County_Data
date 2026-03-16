"use client";

import { useRef } from "react";
import type { County, Orientation } from "@/types/data";
import { VAR_META, NUM_BINS } from "@/lib/constants";
import { useChartDims } from "@/hooks/useChartDims";
import BarChart from "./BarChart";
import Histogram from "./Histogram";
import styles from "./DistributionChart.module.css";

interface Props {
  data: County[];
  varKey: string;
  orientation: Orientation;
  onTooltip: (e: MouseEvent, head: string, rows: { label: string; value: string }[]) => void;
  onHideTooltip: () => void;
}

export default function DistributionChart({ data, varKey, orientation, onTooltip, onHideTooltip }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { width } = useChartDims(wrapRef, 380);
  const meta = VAR_META[varKey];

  return (
    <div ref={wrapRef} className={styles.svgWrap}>
      {meta?.type === "categorical" ? (
        <BarChart data={data} varKey={varKey} width={width} height={380}
          orientation={orientation} onTooltip={onTooltip} onHideTooltip={onHideTooltip} />
      ) : (
        <Histogram data={data} varKey={varKey} width={width} height={380}
          orientation={orientation} onTooltip={onTooltip} onHideTooltip={onHideTooltip} />
      )}
    </div>
  );
}
