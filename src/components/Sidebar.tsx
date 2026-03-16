"use client";

import { useState } from "react";
import type { County, Orientation } from "@/types/data";
import { VAR_META, VAR_GROUPS } from "@/lib/constants";
import RadioGroup from "./ui/RadioGroup";
import styles from "./Sidebar.module.css";

interface Props {
  data: County[];
  // Bar chart
  currentVar: string;
  onVarChange: (v: string) => void;
  orientation: Orientation;
  onOrientChange: (v: Orientation) => void;
  // Scatter plot
  scatterX: string;
  scatterY: string;
  onScatterXChange: (v: string) => void;
  onScatterYChange: (v: string) => void;
}

const GROUP_ORDER = ["income", "health", "behavior", "access"] as const;
const NUM_VARS = Object.entries(VAR_META)
  .filter(([, m]) => m.type === "numerical")
  .map(([k, m]) => ({ key: k, label: m.label }));

export default function Sidebar({
  currentVar, onVarChange,
  orientation, onOrientChange,
  scatterX, scatterY, onScatterXChange, onScatterYChange,
}: Props) {
  // Which axis the picker currently targets
  const [scatterTarget, setScatterTarget] = useState<"x" | "y">("x");

  // The displayed value in the picker is whichever axis is currently targeted
  const pickerValue = scatterTarget === "x" ? scatterX : scatterY;

  function handleScatterVarChange(v: string) {
    if (scatterTarget === "x") onScatterXChange(v);
    else                       onScatterYChange(v);
  }

  return (
    <aside className={styles.aside}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandLabel}>CSE 564</div>
        <div className={styles.brandChip}>
          <span className={styles.chipDot} />
          Visualization &amp; Visual Analytics
        </div>
      </div>

      <div className={styles.card}>

        {/* ── Bar / Histogram ── */}
        <div className={styles.sectionHeader}>Distribution Chart</div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>Variable</div>
          <select
            className={styles.select}
            value={currentVar}
            onChange={(e) => onVarChange(e.target.value)}
          >
            {GROUP_ORDER.map((grp) => (
              <optgroup key={grp} label={VAR_GROUPS[grp]}>
                {Object.entries(VAR_META)
                  .filter(([, m]) => m.group === grp)
                  .map(([key, m]) => (
                    <option key={key} value={key}>{m.label}</option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>Orientation</div>
          <RadioGroup
            value={orientation}
            onChange={(v) => onOrientChange(v as Orientation)}
            options={[
              { value: "upright",  label: "Vertical" },
              { value: "sideways", label: "Horizontal" },
            ]}
          />
        </div>

        <div className={styles.divider} />

        {/* ── Scatter Plot ── */}
        <div className={styles.sectionHeader}>Scatter Plot</div>

        {/* Step 1 — pick the axis to target */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Assign to axis</div>
          <RadioGroup
            value={scatterTarget}
            onChange={(v) => setScatterTarget(v as "x" | "y")}
            options={[
              { value: "x", label: "X-axis" },
              { value: "y", label: "Y-axis" },
            ]}
          />
        </div>

        {/* Step 2 — pick the variable for that axis */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>
            Variable → {scatterTarget === "x" ? "X" : "Y"}-axis
          </div>
          <select
            className={styles.select}
            value={pickerValue}
            onChange={(e) => handleScatterVarChange(e.target.value)}
          >
            {NUM_VARS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        

      </div>
    </aside>
  );
}