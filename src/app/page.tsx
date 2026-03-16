"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Orientation } from "@/types/data";
import { VAR_META } from "@/lib/constants";
import { useData } from "@/hooks/useData";
import { useChartDims } from "@/hooks/useChartDims";
import { useTooltip } from "@/hooks/useTooltip";

import Sidebar from "@/components/Sidebar";
import DistributionChart from "@/components/charts/DistributionChart";
import Scatterplot from "@/components/charts/Scatterplot";
import Tooltip from "@/components/ui/Tooltip";

import styles from "./page.module.css";

const NUM_VARS = Object.entries(VAR_META)
  .filter(([, m]) => m.type === "numerical")
  .map(([k]) => k);

export default function Page() {
  const { data, loading, error } = useData();

  // Bar chart variable
  const [currentVar,  setCurrentVar]  = useState(NUM_VARS[0]);
  const [orientation, setOrientation] = useState<Orientation>("upright");

  // Scatter plot variables — fully independent from bar chart
  const [scatterX, setScatterX] = useState(NUM_VARS[0]);
  const [scatterY, setScatterY] = useState(NUM_VARS[1] ?? NUM_VARS[0]);

  const scatterWrapRef = useRef<HTMLDivElement>(null);
  const { width: scatterW } = useChartDims(scatterWrapRef, 420);

  const { tooltip, showTooltip, hideTooltip, moveTooltip } = useTooltip();

  useEffect(() => {
    const handler = (e: MouseEvent) => moveTooltip(e);
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [moveTooltip]);

  const handleVarChange     = useCallback((v: string) => setCurrentVar(v), []);
  const handleScatterXChange = useCallback((v: string) => setScatterX(v), []);
  const handleScatterYChange = useCallback((v: string) => setScatterY(v), []);

  if (loading) return <div className={styles.loading}><span>Loading county data…</span></div>;
  if (error)   return <div className={styles.loading}><span>Error: {error}</span></div>;

  return (
    <div className={styles.app}>

      {/* ── Sidebar ── */}
      <Sidebar
        data={data}
        currentVar={currentVar}
        orientation={orientation}
        scatterX={scatterX}
        scatterY={scatterY}
        onVarChange={handleVarChange}
        onOrientChange={setOrientation}
        onScatterXChange={handleScatterXChange}
        onScatterYChange={handleScatterYChange}
      />

      {/* ── Main scroll area ── */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>County Health &amp; Socioeconomic Dashboard  (2025)</h1>
          <p className={styles.pageSub}>
            Interactive analysis of fused County Health Rankings data &nbsp;·&nbsp; ~540 counties &nbsp; 20+ quantitative attributes
          </p>
        </div>

        {/* Chart 1 — Distribution */}
        <div className={styles.chartCard}>
          <DistributionChart
            data={data}
            varKey={currentVar}
            orientation={orientation}
            onTooltip={showTooltip}
            onHideTooltip={hideTooltip}
          />
        </div>

        {/* Chart 2 — Scatterplot */}
        <div className={styles.chartCard}>
          <div ref={scatterWrapRef} className={styles.scatterWrap}>
            <Scatterplot
              data={data}
              xKey={scatterX}
              yKey={scatterY}
              width={scatterW}
              height={420}
              onTooltip={showTooltip}
              onHideTooltip={hideTooltip}
            />
          </div>
        </div>
      </main>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}